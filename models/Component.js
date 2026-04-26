const mongoose = require('mongoose');

const componentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxLength: 200
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  unit: {
    type: String,
    enum: ['pcs', 'kg', 'm', 'L', 'set', 'other'],
    default: 'pcs'
  },
  specifications: {
    type: String,
    trim: true,
    maxLength: 500
  },
  partNumber: {
    type: String,
    trim: true,
    maxLength: 50
  },
  material: {
    type: String,
    trim: true,
    maxLength: 100
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes
componentSchema.index({ product: 1 });
componentSchema.index({ name: 1 });

const Component = mongoose.model('Component', componentSchema);
module.exports = Component;
