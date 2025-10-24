// Vercel serverless function for API routes
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const compression = require('compression');

// Import your existing routes
const productsRouter = require('../server/routes/products');
const productImagesRouter = require('../server/routes/productImages');
const categoryRouter = require('../server/routes/category');
const searchRouter = require('../server/routes/search');
const mainImageRouter = require('../server/routes/mainImages');
const userRouter = require('../server/routes/users');
const orderRouter = require('../server/routes/customer_orders');
const slugRouter = require('../server/routes/slugs');
const orderProductRouter = require('../server/routes/customer_order_product');
const wishlistRouter = require('../server/routes/wishlist');
const notificationsRouter = require('../server/routes/notifications');
const merchantRouter = require('../server/routes/merchant');
const statsRouter = require('../server/routes/stats');
const heroRouter = require('../server/routes/hero');

const app = express();

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.NEXTAUTH_URL, 'https://your-frontend-domain.vercel.app']
    : ['http://localhost:3000'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.use('/api/products', productsRouter);
app.use('/api/product-images', productImagesRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/search', searchRouter);
app.use('/api/main-images', mainImageRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);
app.use('/api/slugs', slugRouter);
app.use('/api/order-products', orderProductRouter);
app.use('/api/wishlist', wishlistRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/merchants', merchantRouter);
app.use('/api/stats', statsRouter);
app.use('/api/hero', heroRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = app;
