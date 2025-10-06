const express = require('express');
const bodyParser = require('body-parser');

const authRoutes = require('./src/routes/auth');
const testRoutes = require('./src/routes/test');
const db = require('./src/config/db'); 

const app = express();
app.use(bodyParser.json());

// Routes
app.use('/auth', authRoutes);
app.use('/test', testRoutes);


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

module.exports = { app, db };
