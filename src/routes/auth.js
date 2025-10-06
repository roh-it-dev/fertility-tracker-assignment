const express = require('express');
const { signup, login, refreshToken, logout , getCurrentUser} = require('../controllers/authController');
const { validateLogin, validateSignUp } = require('../middlewares/validateRequest');
const authenticate = require('../middlewares/auth');
const router = express.Router();

router.post('/signup', validateSignUp, signup);
router.post('/login', validateLogin, login);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);
router.get("/me", authenticate, getCurrentUser);

module.exports = router;
