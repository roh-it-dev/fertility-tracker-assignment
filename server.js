require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const authRoutes = require('./src/routes/auth');
const testRoutes = require('./src/routes/test');
const authenticate = require('./src/middlewares/auth');

const app = express();
app.use(bodyParser.json());

// routes
app.use('/auth', authRoutes);
app.use('/test',testRoutes)

// Start server

const PORT = process.env.PORT || 3000;
app.listen(PORT,() => console.log(`Server running on port ${PORT}`));
