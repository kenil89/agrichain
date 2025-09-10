#!/bin/bash

# FarmChain Raspberry Pi Setup Script
# This script sets up the Raspberry Pi environment for QR code printing

echo "🌱 FarmChain Raspberry Pi Setup"
echo "================================"

# Check if running on Raspberry Pi
if ! grep -q "Raspberry Pi" /proc/cpuinfo 2>/dev/null; then
    echo "⚠️  Warning: This doesn't appear to be a Raspberry Pi"
    echo "   Some features may not work correctly"
fi

# Update system packages
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js (if not already installed)
if ! command -v node &> /dev/null; then
    echo "📦 Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
else
    echo "✅ Node.js already installed: $(node --version)"
fi

# Install system dependencies for canvas and GPIO
echo "📦 Installing system dependencies..."
sudo apt-get install -y \
    build-essential \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    python3-dev \
    python3-pip

# Install Python GPIO library (alternative to rpi-gpio)
echo "📦 Installing Python GPIO library..."
sudo pip3 install RPi.GPIO

# Enable serial interface
echo "🔧 Configuring serial interface..."
sudo raspi-config nonint do_serial 0

# Add user to dialout group for serial port access
echo "👤 Adding user to dialout group..."
sudo usermod -a -G dialout $USER

# Install npm dependencies
echo "📦 Installing npm dependencies..."
npm install

# Create systemd service file
echo "⚙️  Creating systemd service..."
sudo tee /etc/systemd/system/farmchain-printer.service > /dev/null <<EOF
[Unit]
Description=FarmChain QR Printer Service
After=network.target

[Service]
Type=simple
User=pi
WorkingDirectory=/home/pi/farmchain-raspberry-pi
ExecStart=/usr/bin/node qr-printer.js server
Restart=always
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

# Enable and start the service
echo "🚀 Enabling FarmChain printer service..."
sudo systemctl daemon-reload
sudo systemctl enable farmchain-printer.service

# Create udev rule for printer (optional)
echo "🖨️  Setting up printer udev rules..."
sudo tee /etc/udev/rules.d/99-thermal-printer.rules > /dev/null <<EOF
# Thermal printer udev rules
SUBSYSTEM=="tty", ATTRS{idVendor}=="067b", ATTRS{idProduct}=="2303", SYMLINK+="thermal-printer"
EOF

sudo udevadm control --reload-rules

# Create configuration file
echo "📝 Creating configuration file..."
tee config.json > /dev/null <<EOF
{
  "printer": {
    "port": "/dev/serial0",
    "baudRate": 19200,
    "timeout": 5000
  },
  "gpio": {
    "statusLED": 18,
    "buttonPin": 16
  },
  "server": {
    "port": 3001,
    "host": "0.0.0.0"
  },
  "qr": {
    "size": 200,
    "margin": 2,
    "errorCorrectionLevel": "M"
  }
}
EOF

# Create log directory
echo "📁 Creating log directory..."
mkdir -p logs

# Set up log rotation
sudo tee /etc/logrotate.d/farmchain-printer > /dev/null <<EOF
/home/pi/farmchain-raspberry-pi/logs/*.log {
    daily
    missingok
    rotate 7
    compress
    delaycompress
    notifempty
    copytruncate
}
EOF

# Create test script
echo "🧪 Creating test script..."
tee test-printer.js > /dev/null <<'EOF'
const { QRPrinter } = require('./qr-printer.js');

async function testPrinter() {
  console.log('🧪 Testing printer connection...');
  
  const printer = new QRPrinter();
  
  try {
    await printer.connect();
    
    // Wait for connection
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (printer.isConnected) {
      console.log('✅ Printer connected successfully');
      
      // Test print
      const testBatch = {
        id: 'TEST-' + Date.now(),
        productType: 'Test Product',
        quantity: 1,
        location: 'Test Location',
        baseUrl: 'https://farmchain.example.com'
      };
      
      await printer.printBatchQR(testBatch);
      console.log('✅ Test print completed');
      
    } else {
      console.log('❌ Printer connection failed');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    printer.disconnect();
  }
}

testPrinter();
EOF

# Make scripts executable
chmod +x qr-printer.js
chmod +x test-printer.js

echo ""
echo "✅ Setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Reboot your Raspberry Pi: sudo reboot"
echo "2. Connect your thermal printer to the serial pins"
echo "3. Test the printer: npm run test"
echo "4. Start the service: sudo systemctl start farmchain-printer"
echo "5. Check service status: sudo systemctl status farmchain-printer"
echo ""
echo "Hardware connections:"
echo "- Printer VCC → 5V (Pin 2)"
echo "- Printer GND → Ground (Pin 6)"
echo "- Printer RX → GPIO 14 (Pin 8, UART TX)"
echo "- Printer TX → GPIO 15 (Pin 10, UART RX)"
echo ""
echo "Web API will be available at: http://[pi-ip-address]:3001"
echo "Status endpoint: http://[pi-ip-address]:3001/status"
echo ""
echo "⚠️  Remember to reboot after setup to apply all changes!"