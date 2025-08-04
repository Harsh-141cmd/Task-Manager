const express = require('express');
const AuthController = require('../controllers/authController');

const router = express.Router();

// Auth Routes
router.post('/signup', AuthController.signup);
router.post('/signin', AuthController.signin);

module.exports = router;
