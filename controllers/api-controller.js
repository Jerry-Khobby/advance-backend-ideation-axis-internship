const User = require("../models/user");
const Product = require("../models/products");
const dotenv = require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Blacklist = require("../models/blacklist");

const secrets = process.env.JWT_SECRET;

// using jwt to verify the user 
const verifyToken = async (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }
  const tokenParts = token.split(' ');
  if (tokenParts[0] !== 'Bearer' || !tokenParts[1]) {
    return res.status(401).json({ error: "Unauthorized: Invalid token format" });
  }
  const actualToken = tokenParts[1];
  try {
    const isBlacklisted = await Blacklist.findOne({ token: actualToken });
    if (isBlacklisted) {
      return res.status(401).json({ error: "Unauthorized: Token has been invalidated" });
    }
    const decoded = jwt.verify(actualToken, secrets);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: "Unauthorized: User not found" });
    }

    req.user = user;
    req.userId = decoded.id;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Token verification failed' });
  }
}

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
      username: username, // Fixed to match your schema
      password: hashedPassword,
      email: email,
    });
    await newUser.save();

    // Generate a JWT
    const token = jwt.sign({ id: newUser._id }, secrets, { expiresIn: '1d' });
    res.status(200).json({ message: 'Signup successful', token: token });

  } catch (error) {
    console.error(error); // Fixed to use the correct variable name
    res.status(500).json({ error: 'Internal server error' });
  }
}


const login= async(req,res)=>{
  const {email,password}=req.body;
  if(!email||!password){
    return res.status(400).json({error:'All fields are required'});
  }
  // try and check for the user 
  try{
  const user = await User.findOne({email:email});
  if(!user){
    return res.status(401).json({error:'Invalid credentials'});
  }
  // compare the passwords 
  const passwordmatch = await bcrypt.compare(password,user.password);
  if(!passwordmatch){
    return res.status(401).json({error:'Invalid credentials'});
  }
  
   const token =jwt.sign({id: user._id },secrets,{expiresIn:'1d'});
  res.status(200).json({message:'Login successful',token: token});
  
  }catch(error){
    console.error('Error logging in:', error); 
    res.status(500).json({ error: 'Internal server error' });
  }
  }
  
  const logout = async (req, res) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
      return res.status(400).json({ message: "No token provided" });
    }
  
    try {
      const decoded = jwt.verify(token, secrets);
      
      // Add the token to the blacklist with its expiration time
      const expiresAt = new Date(decoded.exp * 1000); // Token expiration time
      const blacklistedToken = new Blacklist({ token, expiresAt });
  
      await blacklistedToken.save();
  
      res.status(200).json({ message: "You have been logged out" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Logout failed" });
    }
  };
  



module.exports = {
  createUser,
  login,
  logout,
}
