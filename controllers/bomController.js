const Product = require('../models/Product');

const getBOMList = async (req, res) => {
  try {
    const products = await Product.find({ status: { $ne: 'Discontinued' } })
      .populate('components')
      .populate('createdBy', 'name')
      .sort({ name: 1 });
      
    // Summary stats
    const totalProducts = products.length;
    let totalComponents = 0;
    products.forEach(p => {
      totalComponents += p.components.length;
    });

    res.render('bom/index', {
      pageTitle: 'BOM Viewer',
      currentPage_nav: 'bom',
      products,
      totalProducts,
      totalComponents
    });
  } catch (err) {
    console.error(err);
    if(res.flash) res.flash('error', 'Failed to load BOM list');
    res.redirect('/dashboard');
  }
};

const getBOMView = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId)
      .populate('components')
      .populate('createdBy', 'name');
      
    if (!product) {
      if(res.flash) res.flash('error', 'Product not found');
      return res.redirect('/bom');
    }

    res.render('bom/view', {
      pageTitle: `BOM - ${product.name}`,
      currentPage_nav: 'bom',
      product
    });
  } catch (err) {
    console.error(err);
    if(res.flash) res.flash('error', 'Failed to load product BOM');
    res.redirect('/bom');
  }
};

module.exports = {
  getBOMList,
  getBOMView
};
