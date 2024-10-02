const User = require("../models/user");
const bcrypt = require("bcrypt");

const createUser = async (req, res) => {
  const { username, email, password } = req.body;
  
  // Validate input fields
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  // Password validation
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      error: 'Password must be at least 8 characters long and contain at least one letter, one digit, and one special character'
    });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username: username,
      password: hashedPassword,
      email: email,
    });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully', user: newUser });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Get all users from the database with pagination, filtering, and sorting
const getAllUser = async (req, res) => {
  const { page = 1, limit = 10, username, email, sortBy = 'createdAt', sortOrder = 'asc' } = req.query;

  const query = {};
  if (username) {
    query.username = new RegExp(username, 'i'); // case-insensitive match
  }
  if (email) {
    query.email = new RegExp(email, 'i'); // case-insensitive match
  }

  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1; // 1 for ascending, -1 for descending

  try {
    const users = await User.find(query)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit);
    
    const totalUsers = await User.countDocuments(query);
    res.status(200).json({
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page,
      users,
    });

  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Get a single User
const singleUser = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(404).json({ message: 'Invalid or missing id' });
  
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  } 
}

// PUT /users/{id}
const updateUser = async (req, res) => {
  const { username, email, password } = req.body;

  // Validate input fields (similar to createUser)
  if (username === undefined || email === undefined || password === undefined) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  // Password validation
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      error: 'Password must be at least 8 characters long and contain at least one letter, one digit, and one special character'
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Update user details, ensuring to maintain existing fields if not provided
    const updatedUser = {
      username,
      email,
      password: hashedPassword, // Hash the password if it is being updated
    };

    const user = await User.findByIdAndUpdate(req.params.id, updatedUser, { new: true });
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Update failed' });
  }
}
// DELETE /users/{id}
const deletUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Deletion failed' });
  }
}

module.exports = {
  createUser,
  getAllUser,
  singleUser,
  updateUser,
  deletUser,
}
