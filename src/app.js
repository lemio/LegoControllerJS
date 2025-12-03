// PoweredUP is loaded globally from the browser bundle

// Global variables
let hub = null;
const peripheralElements = {};

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    const connectBtn = document.getElementById('connectBtn');
    const statusDiv = document.getElementById('status');
    const peripheralsDiv = document.getElementById('peripherals');

    connectBtn.addEventListener('click', async () => {
        try {
            statusDiv.textContent = 'Connecting...';
            statusDiv.className = 'status connecting';
            connectBtn.disabled = true;

            await connectToHub();

        } catch (error) {
            console.error('Connection error:', error);
            statusDiv.textContent = `Error: ${error.message}`;
            statusDiv.className = 'status disconnected';
            connectBtn.disabled = false;
        }
    });
});

async function connectToHub() {
    const statusDiv = document.getElementById('status');
    const connectBtn = document.getElementById('connectBtn');
    const peripheralsDiv = document.getElementById('peripherals');

    try {
        // Create PoweredUP instance - it's available globally
        const poweredUP = new PoweredUP.PoweredUP();

        // Scan for hubs using Web Bluetooth
        poweredUP.scan();

        console.log('Scanning for LEGO devices...');

        // Wait for hub to be discovered
        poweredUP.on("discover", async (discoveredHub) => {
            console.log(`Discovered ${discoveredHub.name}!`);
            
            hub = discoveredHub;

            // Connect to the hub
            await hub.connect();
            
            console.log('Connected to hub!');
            statusDiv.textContent = `Connected to ${hub.name}`;
            statusDiv.className = 'status connected';
            
            // Set up peripheral detection
            setupPeripheralDetection();

            // Handle disconnection
            hub.on("disconnect", () => {
                console.log('Hub disconnected');
                statusDiv.textContent = 'Disconnected';
                statusDiv.className = 'status disconnected';
                connectBtn.disabled = false;
                peripheralsDiv.innerHTML = '<div class="no-peripherals">Device disconnected</div>';
                hub = null;
            });
        });

    } catch (error) {
        // Re-throw to be caught by the outer handler which displays the error to the user
        throw error;
    }
}

function setupPeripheralDetection() {
    const peripheralsDiv = document.getElementById('peripherals');
    peripheralsDiv.innerHTML = '';

    if (!hub) return;

    // Listen for device attachments
    hub.on("attach", (device) => {
        console.log(`Device attached to port ${device.portName}:`, device.typeName);
        displayPeripheral(device);
    });

    // Listen for device detachments
    hub.on("detach", (device) => {
        console.log(`Device detached from port ${device.portName}`);
        removePeripheral(device);
    });
}

function displayPeripheral(device) {
    const peripheralsDiv = document.getElementById('peripherals');
    const portId = device.portName;

    // Remove "no peripherals" message if present
    const noPeripherals = peripheralsDiv.querySelector('.no-peripherals');
    if (noPeripherals) {
        noPeripherals.remove();
    }

    // Create peripheral element
    const peripheralDiv = document.createElement('div');
    peripheralDiv.className = 'peripheral';
    peripheralDiv.id = `peripheral-${portId}`;

    const title = document.createElement('h3');
    title.textContent = `Port ${portId}: ${device.typeName}`;
    peripheralDiv.appendChild(title);

    // Add controls based on device type
    const deviceType = device.typeName;

    if (deviceType.includes('Motor') || deviceType.includes('MOTOR')) {
        addMotorControls(peripheralDiv, device);
    } else if (deviceType.includes('Distance') || deviceType.includes('DISTANCE')) {
        addDistanceSensorDisplay(peripheralDiv, device);
    } else if (deviceType.includes('Tilt') || deviceType.includes('TILT')) {
        addTiltSensorDisplay(peripheralDiv, device);
    } else if (deviceType.includes('Color') || deviceType.includes('COLOR')) {
        addColorSensorDisplay(peripheralDiv, device);
    } else {
        // Generic sensor display
        addGenericSensorDisplay(peripheralDiv, device);
    }

    peripheralsDiv.appendChild(peripheralDiv);
    peripheralElements[portId] = peripheralDiv;
}

function removePeripheral(device) {
    const portId = device.portName;
    const element = peripheralElements[portId];
    
    if (element) {
        element.remove();
        delete peripheralElements[portId];
    }

    const peripheralsDiv = document.getElementById('peripherals');
    if (peripheralsDiv.children.length === 0) {
        peripheralsDiv.innerHTML = '<div class="no-peripherals">No peripherals detected</div>';
    }
}

function addMotorControls(container, device) {
    const controlGroup = document.createElement('div');
    controlGroup.className = 'control-group';

    const label = document.createElement('label');
    label.textContent = 'Speed:';
    controlGroup.appendChild(label);

    const speedSlider = document.createElement('input');
    speedSlider.type = 'range';
    speedSlider.min = '-100';
    speedSlider.max = '100';
    speedSlider.value = '0';
    speedSlider.id = `speed-${device.portName}`;

    const valueDisplay = document.createElement('span');
    valueDisplay.className = 'value-display';
    valueDisplay.textContent = '0';

    speedSlider.addEventListener('input', (e) => {
        const speed = parseInt(e.target.value);
        valueDisplay.textContent = speed;
        
        // Set motor speed
        if (device && device.setPower) {
            device.setPower(speed);
        }
    });

    controlGroup.appendChild(speedSlider);
    controlGroup.appendChild(document.createTextNode(' '));
    controlGroup.appendChild(valueDisplay);
    container.appendChild(controlGroup);

    // Add quick control buttons
    const motorControls = document.createElement('div');
    motorControls.className = 'motor-controls';

    const stopBtn = document.createElement('button');
    stopBtn.textContent = 'Stop';
    stopBtn.addEventListener('click', () => {
        speedSlider.value = '0';
        valueDisplay.textContent = '0';
        if (device && device.brake) {
            device.brake();
        }
    });

    motorControls.appendChild(stopBtn);
    container.appendChild(motorControls);
}

function addDistanceSensorDisplay(container, device) {
    const sensorValue = document.createElement('div');
    sensorValue.className = 'sensor-value';
    sensorValue.textContent = 'Distance: --';
    container.appendChild(sensorValue);

    // Subscribe to distance updates
    if (device) {
        device.on("distance", (distance) => {
            sensorValue.textContent = `Distance: ${distance}`;
        });
    }
}

function addTiltSensorDisplay(container, device) {
    const sensorGrid = document.createElement('div');
    sensorGrid.className = 'sensor-grid';

    const xItem = document.createElement('div');
    xItem.className = 'sensor-item';
    const xLabel = document.createElement('label');
    xLabel.textContent = 'X Tilt';
    const xValue = document.createElement('div');
    xValue.className = 'sensor-value';
    xValue.textContent = '--';
    xItem.appendChild(xLabel);
    xItem.appendChild(xValue);

    const yItem = document.createElement('div');
    yItem.className = 'sensor-item';
    const yLabel = document.createElement('label');
    yLabel.textContent = 'Y Tilt';
    const yValue = document.createElement('div');
    yValue.className = 'sensor-value';
    yValue.textContent = '--';
    yItem.appendChild(yLabel);
    yItem.appendChild(yValue);

    sensorGrid.appendChild(xItem);
    sensorGrid.appendChild(yItem);
    container.appendChild(sensorGrid);

    // Subscribe to tilt updates
    if (device) {
        device.on("tilt", (data) => {
            if (data.x !== undefined) xValue.textContent = data.x;
            if (data.y !== undefined) yValue.textContent = data.y;
        });
    }
}

function addColorSensorDisplay(container, device) {
    const sensorValue = document.createElement('div');
    sensorValue.className = 'sensor-value';
    sensorValue.textContent = 'Color: --';
    container.appendChild(sensorValue);

    // Subscribe to color updates
    if (device) {
        device.on("color", (color) => {
            sensorValue.textContent = `Color: ${color}`;
        });
    }
}

function addGenericSensorDisplay(container, device) {
    const sensorValue = document.createElement('div');
    sensorValue.className = 'sensor-value';
    sensorValue.textContent = 'Waiting for data...';
    container.appendChild(sensorValue);

    const info = document.createElement('p');
    info.style.fontSize = '0.9em';
    info.style.color = '#6c757d';
    info.style.marginTop = '10px';
    info.textContent = 'This device type may have limited support. Check console for events.';
    container.appendChild(info);

    // Try to subscribe to any common events
    // Note: Only one event will typically fire for a given device type,
    // so the display will show whichever event the device supports
    if (device) {
        const events = ['distance', 'color', 'tilt', 'rotate', 'speed'];
        events.forEach(eventName => {
            device.on(eventName, (value) => {
                console.log(`${device.portName} ${eventName}:`, value);
                sensorValue.textContent = `${eventName}: ${JSON.stringify(value)}`;
            });
        });
    }
}

// Make functions available globally for debugging
window.debugHub = () => hub;
