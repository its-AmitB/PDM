require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Product = require('../models/Product');
const Component = require('../models/Component');

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Component.deleteMany({});

    // Create Users
    const users = await User.create([
      {
        name: 'System Administrator',
        email: 'admin@vaultcore.com',
        password: 'Admin@1234',
        role: 'admin'
      },
      {
        name: 'Project Manager',
        email: 'manager@vaultcore.com',
        password: 'Manager@1234',
        role: 'manager'
      },
      {
        name: 'Lead Engineer',
        email: 'engineer@vaultcore.com',
        password: 'Engineer@1234',
        role: 'engineer'
      }
    ]);

    const adminId = users[0]._id;
    const managerId = users[1]._id;

    // Create Products
    const products = await Product.create([
      {
        name: 'Industrial Pump Assembly',
        version: '2.1',
        category: 'Mechanical',
        status: 'Active',
        createdBy: managerId
      },
      {
        name: 'Control Panel Unit',
        version: '1.0',
        category: 'Electrical',
        status: 'In Review',
        createdBy: managerId
      },
      {
        name: 'Hydraulic Valve Block',
        version: '3.0',
        category: 'Mechanical',
        status: 'Active',
        createdBy: adminId
      }
    ]);

    // Create Components for Product 1
    const p1Components = await Component.create([
      {
        name: 'Impeller Casing',
        quantity: 1,
        unit: 'pcs',
        specifications: 'High pressure cast iron',
        partNumber: 'IP-C001',
        material: 'Cast Iron',
        product: products[0]._id,
        createdBy: managerId
      },
      {
        name: 'Drive Shaft',
        quantity: 1,
        unit: 'pcs',
        specifications: '30mm diameter, 400mm length',
        partNumber: 'IP-S040',
        material: 'Stainless Steel 316',
        product: products[0]._id,
        createdBy: managerId
      },
      {
        name: 'O-Ring Seal Set',
        quantity: 2,
        unit: 'set',
        specifications: 'Nitrile rubber, high temp',
        partNumber: 'IP-OR10',
        material: 'Nitrile',
        product: products[0]._id,
        createdBy: managerId
      }
    ]);

    products[0].components = p1Components.map(c => c._id);
    await products[0].save();

    // Create Components for Product 2
    const p2Components = await Component.create([
      {
        name: 'Main PLC',
        quantity: 1,
        unit: 'pcs',
        specifications: 'Siemens S7-1200',
        partNumber: 'CP-PLC12',
        material: 'Plastic/Electronics',
        product: products[1]._id,
        createdBy: managerId
      },
      {
        name: 'Contactor Relay',
        quantity: 4,
        unit: 'pcs',
        specifications: '24V DC Coil, 3-pole',
        partNumber: 'CP-RY24',
        material: 'Mixed',
        product: products[1]._id,
        createdBy: managerId
      },
      {
        name: 'Terminal Block',
        quantity: 20,
        unit: 'pcs',
        specifications: 'Din rail mount, 2.5mm2',
        partNumber: 'CP-TB25',
        material: 'Polyamide',
        product: products[1]._id,
        createdBy: managerId
      }
    ]);
    
    products[1].components = p2Components.map(c => c._id);
    await products[1].save();

    // Create Components for Product 3
    const p3Components = await Component.create([
      {
        name: 'Manifold Block',
        quantity: 1,
        unit: 'pcs',
        specifications: '4-station D03 size',
        partNumber: 'HV-MB04',
        material: 'Aluminum 6061-T6',
        product: products[2]._id,
        createdBy: adminId
      },
      {
        name: 'Solenoid Valve',
        quantity: 4,
        unit: 'pcs',
        specifications: '4-way, 3-position, 24VDC',
        partNumber: 'HV-SV43',
        material: 'Steel/Plastic',
        product: products[2]._id,
        createdBy: adminId
      },
      {
        name: 'Relief Valve Cartridge',
        quantity: 1,
        unit: 'pcs',
        specifications: 'Adjustable 500-3000 PSI',
        partNumber: 'HV-RV3K',
        material: 'Steel',
        product: products[2]._id,
        createdBy: adminId
      }
    ]);
    
    products[2].components = p3Components.map(c => c._id);
    await products[2].save();

    console.log("Seed complete");
    process.exit(0);

  } catch (error) {
    console.error(`Error during seeding: ${error}`);
    process.exit(1);
  }
};

seedData();
