#!/usr/bin/env node

/**
 * Raspberry Pi QR Code Printer Script
 * 
 * This script demonstrates how to integrate with a thermal printer
 * to print QR codes for batch tracking on a Raspberry Pi.
 * 
 * Hardware Requirements:
 * - Raspberry Pi (any model with GPIO)
 * - Thermal printer (e.g., Adafruit Mini Thermal Receipt Printer)
 * - Proper wiring and power supply
 * 
 * Software Requirements:
 * - Node.js installed on Raspberry Pi
 * - npm packages: serialport, qrcode, canvas
 */

const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');
const { SerialPort } = require('serialport');

class QRPrinter {
  constructor(portPath = '/dev/serial0', baudRate = 19200) {
    this.portPath = portPath;
    this.baudRate = baudRate;
    this.printer = null;
    this.isConnected = false;
  }

  async connect() {
    try {
      this.printer = new SerialPort({
        path: this.portPath,
        baudRate: this.baudRate,
        dataBits: 8,
        parity: 'none',
        stopBits: 1,
        flowControl: false
      });

      this.printer.on('open', () => {
        console.log('✅ Printer connected successfully');
        this.isConnected = true;
        this.initializePrinter();
      });

      this.printer.on('error', (err) => {
        console.error('❌ Printer connection error:', err.message);
        this.isConnected = false;
      });

      this.printer.on('close', () => {
        console.log('🔌 Printer connection closed');
        this.isConnected = false;
      });

    } catch (error) {
      console.error('❌ Failed to connect to printer:', error.message);
      throw error;
    }
  }

  initializePrinter() {
    if (!this.isConnected) return;

    // Initialize printer with basic settings
    const initCommands = Buffer.from([
      0x1B, 0x40,        // Initialize printer
      0x1B, 0x61, 0x01,  // Center alignment
      0x1D, 0x21, 0x11   // Double height and width
    ]);

    this.printer.write(initCommands);
  }

  async printBatchQR(batchData) {
    if (!this.isConnected) {
      throw new Error('Printer not connected');
    }

    try {
      console.log('🖨️  Printing QR code for batch:', batchData.id);

      // Generate QR code URL
      const qrUrl = `${batchData.baseUrl}/trace/${batchData.id}`;
      
      // Print header
      await this.printText('FARMCHAIN BATCH TRACKER\n');
      await this.printText('========================\n\n');
      
      // Print batch information
      await this.printText(`Batch ID: ${batchData.id}\n`);
      await this.printText(`Product: ${batchData.productType}\n`);
      await this.printText(`Quantity: ${batchData.quantity} kg\n`);
      await this.printText(`Farm: ${batchData.location}\n`);
      await this.printText(`Date: ${new Date().toLocaleDateString()}\n\n`);
      
      // Generate and print QR code
      await this.printQRCode(qrUrl);
      
      // Print footer
      await this.printText('\nScan to track this batch\n');
      await this.printText('========================\n\n\n');
      
      // Cut paper (if supported)
      this.cutPaper();
      
      console.log('✅ QR code printed successfully');
      
    } catch (error) {
      console.error('❌ Failed to print QR code:', error.message);
      throw error;
    }
  }

  async printText(text) {
    return new Promise((resolve, reject) => {
      this.printer.write(text, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  async printQRCode(data) {
    try {
      // Generate QR code as buffer
      const qrBuffer = await QRCode.toBuffer(data, {
        type: 'png',
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      // Convert to printer-compatible format (simplified)
      // In a real implementation, you'd need to convert the image
      // to the specific format your thermal printer expects
      
      // For demonstration, we'll print a text representation
      const qrText = await QRCode.toString(data, {
        type: 'terminal',
        small: true
      });
      
      await this.printText(qrText + '\n');
      
    } catch (error) {
      console.error('❌ Failed to generate QR code:', error.message);
      throw error;
    }
  }

  cutPaper() {
    if (!this.isConnected) return;
    
    // Send paper cut command (varies by printer model)
    const cutCommand = Buffer.from([0x1D, 0x56, 0x42, 0x00]);
    this.printer.write(cutCommand);
  }

  disconnect() {
    if (this.printer && this.isConnected) {
      this.printer.close();
    }
  }
}

// Example usage and CLI interface
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
🌱 FarmChain QR Printer for Raspberry Pi

Usage:
  node qr-printer.js print <batchId> <productType> <quantity> <location>
  node qr-printer.js test

Examples:
  node qr-printer.js print 123 "Organic Tomatoes" 100 "Green Valley Farm"
  node qr-printer.js test

Hardware Setup:
  1. Connect thermal printer to Raspberry Pi GPIO pins
  2. Ensure proper power supply for the printer
  3. Configure serial port permissions: sudo usermod -a -G dialout $USER
  4. Enable serial interface: sudo raspi-config > Interface Options > Serial
`);
    process.exit(0);
  }

  const command = args[0];
  const printer = new QRPrinter();

  try {
    await printer.connect();
    
    // Wait for connection to establish
    await new Promise(resolve => setTimeout(resolve, 2000));

    if (command === 'test') {
      console.log('🧪 Running printer test...');
      
      const testBatch = {
        id: 'TEST001',
        productType: 'Test Product',
        quantity: 50,
        location: 'Test Farm',
        baseUrl: 'https://farmchain.example.com'
      };
      
      await printer.printBatchQR(testBatch);
      
    } else if (command === 'print' && args.length >= 5) {
      const [, batchId, productType, quantity, location] = args;
      const baseUrl = args[5] || 'https://farmchain.example.com';
      
      const batchData = {
        id: batchId,
        productType,
        quantity: parseInt(quantity),
        location,
        baseUrl
      };
      
      await printer.printBatchQR(batchData);
      
    } else {
      console.error('❌ Invalid command or missing arguments');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    printer.disconnect();
    process.exit(0);
  }
}

// GPIO LED indicator functions (optional)
function setupStatusLED() {
  // Example GPIO setup for status LED
  // Requires 'rpi-gpio' package: npm install rpi-gpio
  
  try {
    const gpio = require('rpi-gpio');
    
    gpio.setup(18, gpio.DIR_OUT, (err) => {
      if (err) {
        console.log('⚠️  GPIO setup failed:', err.message);
        return;
      }
      console.log('💡 Status LED initialized on GPIO 18');
    });
    
    return {
      on: () => gpio.write(18, true),
      off: () => gpio.write(18, false),
      blink: (times = 3) => {
        let count = 0;
        const interval = setInterval(() => {
          gpio.write(18, count % 2 === 0);
          count++;
          if (count >= times * 2) {
            clearInterval(interval);
            gpio.write(18, false);
          }
        }, 200);
      }
    };
    
  } catch (error) {
    console.log('⚠️  GPIO not available (not running on Raspberry Pi?)');
    return {
      on: () => {},
      off: () => {},
      blink: () => {}
    };
  }
}

// Web server for remote printing (optional)
function startWebServer(printer) {
  const http = require('http');
  const url = require('url');
  
  const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }
    
    if (parsedUrl.pathname === '/print' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk.toString());
      req.on('end', async () => {
        try {
          const batchData = JSON.parse(body);
          await printer.printBatchQR(batchData);
          
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, message: 'QR code printed successfully' }));
          
        } catch (error) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: error.message }));
        }
      });
      
    } else if (parsedUrl.pathname === '/status') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        connected: printer.isConnected,
        timestamp: new Date().toISOString()
      }));
      
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not found' }));
    }
  });
  
  const PORT = process.env.PORT || 3001;
  server.listen(PORT, () => {
    console.log(`🌐 QR Printer web server running on port ${PORT}`);
    console.log(`   Status: http://localhost:${PORT}/status`);
    console.log(`   Print: POST http://localhost:${PORT}/print`);
  });
}

// Export for use as module
module.exports = { QRPrinter, setupStatusLED, startWebServer };

// Run as CLI if called directly
if (require.main === module) {
  main().catch(console.error);
}