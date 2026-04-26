const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxLength: 200
  },
  description: {
    type: String,
    trim: true,
    maxLength: 1000
  },
  version: {
    type: String,
    required: true,
    default: '1.0',
    maxLength: 20
  },
  category: {
    type: String,
    enum: ['Mechanical', 'Electrical', 'Software', 'Assembly', 'Document', 'Other']
  },
  status: {
    type: String,
    enum: ['Active', 'Discontinued', 'In Review'],
    default: 'Active'
  },
  components: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Component'
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes
productSchema.index({ name: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ status: 1 });
productSchema.index({ createdBy: 1 });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
