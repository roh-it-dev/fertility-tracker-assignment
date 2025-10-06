const bcrypt = require('bcryptjs');
const ms = require('ms');
const User = require('../models/user');
const RefreshToken = require('../models/refreshToken');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../utils/jwt');

const authController = {
 signup: async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findByEmail(email);
    if (existingUser) return res.status(400).json({ ok: false, errors: { email: 'Email already exists' } });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create(username, email, hashedPassword);

    // Generate tokens
    const accessToken = signAccessToken({ id: user.id });
    const refreshToken = signRefreshToken({ id: user.id });

    const expireAt = new Date(Date.now() + ms(process.env.REFRESH_TOKEN_EXPIRES_IN || '7d'));
    await RefreshToken.create(user.id, refreshToken, expireAt);

    return res.status(201).json({
      ok: true,
      data: {
        userId: user.id,
        username: user.username,
        accessToken,
        refreshToken,
        message: 'User created and logged in'
      }
    });
  } catch (err) {
    next(err);
  }
},


  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await User.findByEmail(email);
      if (!user) return res.status(400).json({ ok: false, errors: { credentials: 'Invalid credentials' } });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ ok: false, errors: { password: 'Password is incorrect' } });

      const accessToken = signAccessToken({ id: user.id });
      const refreshToken = signRefreshToken({ id: user.id });

      const expireAt = new Date(Date.now() + ms(process.env.REFRESH_TOKEN_EXPIRES_IN || '7d'));
      await RefreshToken.create(user.id, refreshToken, expireAt);

      return res.json({ ok: true, data: { accessToken, refreshToken, username: user.username } });
    } catch (err) {
      next(err);
    }
  },

  refreshToken: async (req, res, next) => {
    try {
      const { token } = req.body;
      if (!token) return res.status(401).json({ ok: false, error: 'No token provided' });

      const saved = await RefreshToken.findByToken(token);
      if (!saved) return res.status(403).json({ ok: false, error: 'Invalid refresh token' });

      let payload;
      try {
        payload = verifyRefreshToken(token);
      } catch (e) {
        // token invalid or expired
        await RefreshToken.deleteByToken(token).catch(()=>{});
        return res.status(403).json({ ok: false, error: 'Refresh token expired or invalid' });
      }

      const accessToken = signAccessToken({ id: payload.id });
      return res.json({ ok: true, data: { accessToken } });
    } catch (err) {
      next(err);
    }
  }, 

  logout: async (req, res, next) => {
    try {
      const { token } = req.body;
      if (!token) return res.status(400).json({ ok: false, error: 'No token provided' });

      await RefreshToken.deleteByToken(token);
      return res.json({ ok: true, data: { message: 'Logged out successfully' } });
    } catch (err) {
      next(err);
    }
  },

  getCurrentUser: async (req, res, next) => {
    try {
      const userId = req.user.id; 
      const user = await User.findById(userId);
      console.log(user);
      if (!user) {
        return res.status(404).json({ ok: false, error: "User not found" });
      }

      return res.json({
        ok: true,
        data: {
          id: user.id,
          name: user.username,
          email: user.email
        }
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  }
};


module.exports = authController;
