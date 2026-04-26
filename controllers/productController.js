const Product = require('../models/Product');
const Component = require('../models/Component');

const getProducts = async (req, res) => {
  try {
    const { search, category, status, page } = req.query;
    
    // Query building
    const query = {};
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    if (category) query.category = category;
    if (status) query.status = status;

    // Pagination
    const perPage = 10;
    const currentPage = parseInt(page) || 1;
    const skip = (currentPage - 1) * perPage;
    
    const totalDocs = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalDocs / perPage);
    
    const products = await Product.find(query)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(perPage);

    res.render('products/index', {
      pageTitle: 'Products',
      currentPage_nav: 'products',
      products,
      search: search || '',
      category: category || '',
      status: status || '',
      totalPages,
      currentPage,
      totalDocs
    });
  } catch (err) {
    console.error(err);
    if(res.flash) res.flash('error', 'Failed to load products');
    res.redirect('/dashboard');
  }
};

const getNewProduct = (req, res) => {
  res.render('products/create', {
    pageTitle: 'Add New Product',
    currentPage_nav: 'products',
    product: {} 
  });
};

const postProduct = async (req, res) => {
  try {
    const { name, version, category, status, description } = req.body;

    // Validate
    if (!name || name.trim() === '') {
      if(res.flash) res.flash('error', 'Name is required');
      return res.render('products/create', { pageTitle: 'Add New Product', currentPage_nav: 'products', product: req.body });
    }
    if (!version) {
      if(res.flash) res.flash('error', 'Version is required');
      return res.render('products/create', { pageTitle: 'Add New Product', currentPage_nav: 'products', product: req.body });
    }
    const validCategories = ['Mechanical', 'Electrical', 'Software', 'Assembly', 'Document', 'Other'];
    if (!validCategories.includes(category)) {
      if(res.flash) res.flash('error', 'Invalid category');
      return res.render('products/create', { pageTitle: 'Add New Product', currentPage_nav: 'products', product: req.body });
    }

    const newProduct = await Product.create({
      name: name.trim(),
      version: version.trim(),
      category,
      status: status || 'Active',
      description: description ? description.trim() : '',
      createdBy: req.user.id
    });

    if(res.flash) res.flash('success', 'Product created successfully');
    res.redirect(`/products/${newProduct._id}`);
  } catch (err) {
    console.error(err);
    if(res.flash) res.flash('error', 'Failed to create product');
    res.render('products/create', { pageTitle: 'Add New Product', currentPage_nav: 'products', product: req.body });
  }
};

const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('createdBy', 'name')
      .populate('updatedBy', 'name')
      .populate({
        path: 'components',
        populate: { path: 'createdBy', select: 'name' }
      });
      
    if (!product) {
      if(res.flash) res.flash('error', 'Product not found');
      return res.redirect('/products');
    }

    res.render('products/show', {
      pageTitle: product.name,
      currentPage_nav: 'products',
      product
    });
  } catch (err) {
    console.error(err);
    if(res.flash) res.flash('error', 'Failed to load product');
    res.redirect('/products');
  }
};

const getEditProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      if(res.flash) res.flash('error', 'Product not found');
      return res.redirect('/products');
    }
    res.render('products/edit', {
      pageTitle: 'Edit Product',
      currentPage_nav: 'products',
      product
    });
  } catch (err) {
    console.error(err);
    if(res.flash) res.flash('error', 'Failed to load product for editing');
    res.redirect('/products');
  }
};

const putProduct = async (req, res) => {
  try {
    const { name, version, category, status, description } = req.body;
    
    if (!name || name.trim() === '' || !version) {
      if(res.flash) res.flash('error', 'Name and version are required');
      return res.redirect(`/products/${req.params.id}/edit`);
    }

    await Product.findByIdAndUpdate(req.params.id, {
      name: name.trim(),
      version: version.trim(),
      category,
      status,
      description: description ? description.trim() : '',
      updatedBy: req.user.id
    });

    if(res.flash) res.flash('success', 'Product updated successfully');
    res.redirect(`/products/${req.params.id}`);
  } catch (err) {
    console.error(err);
    if(res.flash) res.flash('error', 'Failed to update product');
    res.redirect(`/products/${req.params.id}/edit`);
  }
};

const deleteProduct = async (req, res) => {
  try {
    await Component.deleteMany({ product: req.params.id });
    await Product.findByIdAndDelete(req.params.id);
    if(res.flash) res.flash('success', 'Product and its components deleted successfully');
    res.redirect('/products');
  } catch (err) {
    console.error(err);
    if(res.flash) res.flash('error', 'Failed to delete product');
    res.redirect('/products');
  }
};

const postComponent = async (req, res) => {
  try {
    const { name, partNumber, quantity, unit, material, specifications } = req.body;
    
    if (!name || name.trim() === '' || !quantity || !unit) {
      if(res.flash) res.flash('error', 'Name, quantity, and unit are required');
      return res.redirect(`/products/${req.params.id}`);
    }

    const component = await Component.create({
      name: name.trim(),
      partNumber: partNumber ? partNumber.trim() : '',
      quantity: parseInt(quantity),
      unit,
      material: material ? material.trim() : '',
      specifications: specifications ? specifications.trim() : '',
      product: req.params.id,
      createdBy: req.user.id
    });

    const product = await Product.findById(req.params.id);
    product.components.push(component._id);
    await product.save();

    if(res.flash) res.flash('success', 'Component added successfully');
    res.redirect(`/products/${req.params.id}`);
  } catch (err) {
    console.error(err);
    if(res.flash) res.flash('error', 'Failed to add component');
    res.redirect(`/products/${req.params.id}`);
  }
};

const deleteComponent = async (req, res) => {
  try {
    const { id, componentId } = req.params;
    await Component.findByIdAndDelete(componentId);
    await Product.findByIdAndUpdate(id, { $pull: { components: componentId } });
    if(res.flash) res.flash('success', 'Component removed successfully');
    res.redirect(`/products/${id}`);
  } catch (err) {
    console.error(err);
    if(res.flash) res.flash('error', 'Failed to remove component');
    res.redirect(`/products/${req.params.id}`);
  }
};

module.exports = {
  getProducts,
  getNewProduct,
  postProduct,
  getProduct,
  getEditProduct,
  putProduct,
  deleteProduct,
  postComponent,
  deleteComponent
};
