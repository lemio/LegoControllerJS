# LegoControllerJS

A simple static web app that uses Web Bluetooth to control LEGO devices (WeDo 2.0, Boost, Powered Up, etc.) directly from your browser.

## Features

- **Web Bluetooth Connection**: Connect to LEGO devices wirelessly via Web Bluetooth
- **Peripheral Detection**: Automatically detects peripherals connected to ports A and B
- **Motor Control**: Control motor speed with an intuitive slider interface
- **Sensor Reading**: View real-time data from:
  - Distance sensors (1-10 range)
  - Tilt sensors (X and Y axes)
  - Color sensors
  - And other compatible LEGO sensors

## Requirements

- A Web Bluetooth compatible browser (Chrome, Edge, Opera)
- HTTPS connection or localhost (required for Web Bluetooth)
- A compatible LEGO device (WeDo 2.0, Boost, Technic Hub, City Hub, etc.)
- Peripherals connected to your LEGO hub

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/lemio/LegoControllerJS.git
   cd LegoControllerJS
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

### Option 1: Using Python HTTP Server (Recommended)

Run the included server script:
```bash
npm run serve
```

Then open your browser to: `http://localhost:8080`

### Option 2: Using any HTTP server

You can use any HTTP server. For example:

**Using Node.js http-server:**
```bash
npx http-server -p 8080
```

**Using PHP:**
```bash
php -S localhost:8080
```

### Option 3: Deploy to a web server

Simply upload all files to your web server. Make sure to use HTTPS as Web Bluetooth requires a secure connection.

## How to Use

1. Turn on your LEGO device (hub)
2. Open the web app in your browser
3. Click "Connect to LEGO Device"
4. Select your LEGO device from the Bluetooth pairing dialog
5. Once connected, attach peripherals to ports A and B
6. The app will automatically detect and display controls for each peripheral:
   - **Motors**: Use the slider to control speed (-100 to 100)
   - **Distance Sensors**: View the distance reading (0-10)
   - **Tilt Sensors**: See X and Y tilt values
   - **Other Sensors**: View real-time data

## Supported Devices

This app works with LEGO Powered Up devices including:
- WeDo 2.0 Smart Hub
- Boost Move Hub
- Powered Up Hub
- Control+ Hub
- Technic Hub
- City Hub

## Supported Peripherals

- Motors (basic, interactive, external)
- Distance sensors
- Tilt sensors
- Color sensors
- Motion sensors
- And more!

## Technology Stack

- **node-poweredup**: JavaScript library for controlling LEGO devices
- **Web Bluetooth API**: Browser API for Bluetooth connectivity
- Vanilla JavaScript (no frameworks required)
- Pure CSS for styling

## Browser Compatibility

Web Bluetooth is supported in:
- Chrome (desktop and Android)
- Edge (desktop and Android)
- Opera (desktop and Android)
- Samsung Internet

**Not supported in:**
- Firefox (no Web Bluetooth support)
- Safari (no Web Bluetooth support)
- iOS browsers (no Web Bluetooth support)

## Troubleshooting

**Connection fails:**
- Make sure your LEGO device is turned on and in pairing mode
- Ensure you're using a supported browser
- Check that you're accessing the page via HTTPS or localhost
- Try refreshing the page and reconnecting

**Peripherals not detected:**
- Make sure peripherals are firmly connected to the hub
- Try disconnecting and reconnecting the peripheral
- Check the browser console for error messages

**No sensors showing data:**
- Some sensors may require specific initialization
- Check the browser console for event data
- Ensure the peripheral is compatible with your hub

## Development

The app consists of:
- `index.html` - Main HTML interface
- `src/app.js` - Application logic and device control
- `node_modules/node-poweredup/dist/browser/poweredup.js` - PoweredUP library (browser build)

No build process is required - just serve the files!

## License

MIT

## Credits

Built with [node-poweredup](https://github.com/nathankellenicki/node-poweredup) by Nathan Kellenicki
