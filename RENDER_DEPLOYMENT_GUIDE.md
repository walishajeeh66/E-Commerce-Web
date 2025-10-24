# Render Deployment Guide for Wali E-commerce - Electronic Zone

This guide will help you deploy both your Next.js frontend and Node.js backend on Render.

## Prerequisites

1. **GitHub Repository**: Ensure your code is pushed to a GitHub repository
2. **Render Account**: Sign up at [render.com](https://render.com)
3. **Database**: Set up a PostgreSQL database (Render provides managed PostgreSQL)

## Step 1: Database Setup

### 1.1 Create PostgreSQL Database on Render

1. Go to your Render Dashboard
2. Click "New +" → "PostgreSQL"
3. Configure:
   - **Name**: `electronics-shop-db`
   - **Database**: `electronics_shop`
   - **User**: `electronics_user`
   - **Region**: Choose closest to your users
4. Click "Create Database"
5. **Save the connection details** - you'll need them for environment variables

### 1.2 Update Database Schema

1. Connect to your database using the connection string from Render
2. Run the Prisma migrations:
   ```bash
   npx prisma migrate deploy
   ```

## Step 2: Backend (Node.js) Deployment

### 2.1 Create Backend Service

1. In Render Dashboard, click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `electronics-shop-backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Root Directory**: `server` (if your backend is in a server folder)

### 2.2 Environment Variables for Backend

Add these environment variables in Render Dashboard:

```env
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://username:password@host:port/database
JWT_SECRET=your-super-secret-jwt-key-here
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXTAUTH_URL=https://your-frontend-url.onrender.com
```

### 2.3 Backend Configuration

1. **Build Command**: `npm install && npm run build`
2. **Start Command**: `npm start`
3. **Health Check Path**: `/api/health` (create this endpoint if it doesn't exist)

## Step 3: Frontend (Next.js) Deployment

### 3.1 Create Frontend Service

1. In Render Dashboard, click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `electronics-shop-frontend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Root Directory**: `.` (root of your project)

### 3.2 Environment Variables for Frontend

Add these environment variables in Render Dashboard:

```env
NODE_ENV=production
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXTAUTH_URL=https://your-frontend-url.onrender.com
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
```

## Step 4: Configure API Endpoints

### 4.1 Update API Client

Make sure your `lib/api.ts` file uses the correct API URL:

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
```

### 4.2 Update CORS Settings

In your backend server, ensure CORS is configured for your frontend domain:

```javascript
const cors = require('cors');
app.use(cors({
  origin: ['https://your-frontend-url.onrender.com'],
  credentials: true
}));
```

## Step 5: File Upload Configuration

### 5.1 Configure File Storage

For production, consider using cloud storage (AWS S3, Cloudinary, etc.) instead of local file storage:

1. **Option 1: Use Render's persistent disk**
   - Add persistent disk in Render dashboard
   - Mount it to `/uploads` directory

2. **Option 2: Use cloud storage**
   - Update your file upload logic to use cloud storage
   - Update image URLs in your database

### 5.2 Update Image Paths

Ensure your image paths work in production:

```typescript
// In your components
const imageUrl = process.env.NODE_ENV === 'production' 
  ? `https://your-backend-url.onrender.com/uploads/${imageName}`
  : `/${imageName}`;
```

## Step 6: Database Connection

### 6.1 Update Prisma Configuration

Update your `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### 6.2 Run Database Migrations

After deployment, run:

```bash
npx prisma generate
npx prisma migrate deploy
```

## Step 7: SSL and Domain Configuration

### 7.1 SSL Certificates

Render automatically provides SSL certificates for all services.

### 7.2 Custom Domain (Optional)

1. Go to your service settings
2. Click "Custom Domains"
3. Add your custom domain
4. Update DNS records as instructed

## Step 8: Monitoring and Logs

### 8.1 Health Checks

Create health check endpoints:

**Backend** (`server/routes/health.js`):
```javascript
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});
```

**Frontend** (create `app/api/health/route.ts`):
```typescript
export async function GET() {
  return Response.json({ status: 'OK', timestamp: new Date().toISOString() });
}
```

### 8.2 Logging

Configure logging for production:

```javascript
// In your backend
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console()
  ]
});
```

## Step 9: Performance Optimization

### 9.1 Frontend Optimizations

1. **Image Optimization**: Use Next.js Image component
2. **Code Splitting**: Implement dynamic imports
3. **Caching**: Configure proper cache headers

### 9.2 Backend Optimizations

1. **Database Indexing**: Add indexes for frequently queried fields
2. **Connection Pooling**: Configure database connection pooling
3. **Caching**: Implement Redis caching for frequently accessed data

## Step 10: Security Configuration

### 10.1 Environment Variables Security

- Never commit `.env` files
- Use strong, unique secrets
- Rotate secrets regularly

### 10.2 API Security

1. **Rate Limiting**: Implement rate limiting
2. **Input Validation**: Validate all inputs
3. **Authentication**: Secure all API endpoints

## Step 11: Deployment Checklist

### 11.1 Pre-Deployment

- [ ] All environment variables configured
- [ ] Database migrations ready
- [ ] File upload strategy decided
- [ ] CORS configured correctly
- [ ] Health check endpoints created

### 11.2 Post-Deployment

- [ ] Test all API endpoints
- [ ] Verify file uploads work
- [ ] Check database connections
- [ ] Test authentication flow
- [ ] Verify SSL certificates
- [ ] Check performance metrics

## Step 12: Troubleshooting

### 12.1 Common Issues

1. **Build Failures**: Check build logs for missing dependencies
2. **Database Connection**: Verify DATABASE_URL format
3. **CORS Errors**: Check CORS configuration
4. **File Upload Issues**: Verify file storage configuration

### 12.2 Debugging

1. **Check Logs**: Use Render's log viewer
2. **Health Checks**: Monitor health check endpoints
3. **Database**: Check database connection and queries

## Step 13: Scaling

### 13.1 Auto-Scaling

Render automatically scales your services based on traffic.

### 13.2 Manual Scaling

1. Go to service settings
2. Adjust instance count
3. Monitor performance metrics

## Step 14: Backup Strategy

### 14.1 Database Backups

1. Render provides automatic database backups
2. Configure backup retention period
3. Test restore procedures

### 14.2 Code Backups

1. Use Git for version control
2. Tag releases
3. Keep deployment documentation updated

## Step 15: Maintenance

### 15.1 Regular Updates

1. Update dependencies regularly
2. Monitor security advisories
3. Test updates in staging environment

### 15.2 Monitoring

1. Set up uptime monitoring
2. Monitor performance metrics
3. Configure alerting for critical issues

## Environment Variables Summary

### Backend (.env)
```env
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://username:password@host:port/database
JWT_SECRET=your-super-secret-jwt-key-here
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXTAUTH_URL=https://your-frontend-url.onrender.com
```

### Frontend (.env.local)
```env
NODE_ENV=production
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXTAUTH_URL=https://your-frontend-url.onrender.com
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
```

## Support

If you encounter issues:

1. Check Render's documentation: [render.com/docs](https://render.com/docs)
2. Review deployment logs
3. Test locally with production environment variables
4. Contact Render support if needed

## Additional Resources

- [Render Documentation](https://render.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
