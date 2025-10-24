// Vercel serverless function entry point
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
const fs = require('fs');

// Import your existing app configuration
const app = require('../app.js');

// Export for Vercel
module.exports = app;
