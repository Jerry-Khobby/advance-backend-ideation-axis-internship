const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  role: { type: String, default: 'user' },
  products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;
