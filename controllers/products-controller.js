const Product = require("../models/products");

// Create a new product
const createProduct = async (req, res) => {
  const { name, price, description, category, stock } = req.body;

  // Validate required fields
  if (!name || !price) {
    return res.status(400).json({ error: 'Name and price are required' });
  }

  try {
    const newProduct = new Product({
      name,
      price,
      description,
      category,
      stock,
    });
    await newProduct.save();
    res.status(201).json({ message: 'Product created successfully', product: newProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all products with enhanced filtering, sorting, and pagination
const getAllProducts = async (req, res) => {
  const { 
    page = 1, 
    limit = 10, 
    name, 
    category, 
    minPrice, 
    maxPrice, 
    inStock, 
    sortBy = 'createdAt', 
    sortOrder = 'asc' 
  } = req.query;

  const query = {};
  if (name) {
    query.name = new RegExp(name, 'i'); // Case-insensitive name match
  }
  if (category) {
    query.category = new RegExp(category, 'i'); // Case-insensitive category match
  }
  if (minPrice) {
    query.price = { ...query.price, $gte: minPrice }; // Filter by minimum price
  }
  if (maxPrice) {
    query.price = { ...query.price, $lte: maxPrice }; // Filter by maximum price
  }
  if (inStock) {
    query.stock = { $gt: 0 }; // Filter products in stock
  }

  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1; // Ascending or descending sort order

  try {
    const products = await Product.find(query)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit);
    
    const totalProducts = await Product.countDocuments(query);
    res.status(200).json({
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page,
      products,
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get a single product by ID
const singleProduct = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(404).json({ message: 'Invalid or missing ID' });

  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update a product by ID
const updateProduct = async (req, res) => {
  const { name, price, description, category, stock } = req.body;

  // Validate required fields for update
  if (name === undefined || price === undefined) {
    return res.status(400).json({ error: 'Name and price are required for update' });
  }

  try {
    const updatedProduct = {
      name,
      price,
      description,
      category,
      stock,
    };

    const product = await Product.findByIdAndUpdate(req.params.id, updatedProduct, { new: true });
    if (!product) return res.status(404).json({ error: 'Product not found' });

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Update failed' });
  }
};

// Delete a product by ID
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.status(200).json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Deletion failed' });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  singleProduct,
  updateProduct,
  deleteProduct,
};
