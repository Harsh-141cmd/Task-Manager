const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = require('../middleware/auth');

class AuthController {
  static async signup(req, res) {
    try {
      const { name, email, password } = req.body;

      // Check if user already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'Error: Email is already in use!' });
      }

      // Hash password
      const hashedPassword = await User.hashPassword(password);

      // Create user
      await User.create(name, email, hashedPassword);
      
      res.json({ message: 'User registered successfully!' });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  static async signin(req, res) {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Check password
      const isValidPassword = await User.validatePassword(password, user.password);
      if (!isValidPassword) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        token,
        type: 'Bearer',
        id: user.id,
        email: user.email,
        name: user.name
      });
    } catch (error) {
      console.error('Signin error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
}

module.exports = AuthController;
