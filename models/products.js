const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: { type: String, required: true },             // Name of the product
  price: { type: Number, required: true },            // Product price
  description: { type: String },                      // Optional product description
  category: { type: String },                         // Optional product category
  stock: { type: Number, default: 0 },                // Optional stock count (default 0)
  imageUrl: { type: String,required:false },                         // Optional image URL for the product
  user: { type: Schema.Types.ObjectId, ref: 'User' }, // Reference to the user who created the product
}, { timestamps: true });                             // Automatically add createdAt and updatedAt

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
