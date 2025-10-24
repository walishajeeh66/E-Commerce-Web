# Vercel Deployment Guide for Wali E-commerce

## 🚀 **Deploy Both Frontend & Backend on Vercel Free Tier**

### **Prerequisites**
- GitHub repository: `https://github.com/walishajeeh66/E-Commerce-Web.git`
- Vercel account (free tier)
- Neon PostgreSQL database (free tier)

---

## 📋 **Step 1: Prepare Your Repository**

### **1.1 Update Environment Variables**
Create `.env.local` in your root directory:
```env
# Frontend Environment Variables
NEXT_PUBLIC_API_BASE_URL=https://your-app-name.vercel.app/api
NODE_ENV=production
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
NEXTAUTH_SECRET=your_secure_secret_here
NEXTAUTH_URL=https://your-app-name.vercel.app
```

### **1.2 Update API Client Configuration**
Update `lib/api.ts`:
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

// For Vercel deployment, use relative paths
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:3001';
```

---

## 🚀 **Step 2: Deploy to Vercel**

### **2.1 Connect Repository**
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import your repository: `walishajeeh66/E-Commerce-Web`

### **2.2 Configure Build Settings**
- **Framework Preset**: Next.js
- **Root Directory**: `./` (root)
- **Build Command**: `npm run build`
- **Output Directory**: `.next` (auto-detected)
- **Install Command**: `npm install`

### **2.3 Environment Variables**
Add these in Vercel dashboard:
```
NEXT_PUBLIC_API_BASE_URL=https://your-app-name.vercel.app/api
NODE_ENV=production
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require
NEXTAUTH_SECRET=your_secure_secret_here
NEXTAUTH_URL=https://your-app-name.vercel.app
```

---

## 🔧 **Step 3: Configure Serverless Functions**

### **3.1 API Routes Structure**
Your API routes will be automatically converted to Vercel serverless functions:
- `/api/products` → `api/products/index.js`
- `/api/categories` → `api/categories/index.js`
- `/api/users` → `api/users/index.js`
- etc.

### **3.2 Update Route Handlers**
Each API route needs to be a serverless function. Example for `api/products/index.js`:
```javascript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        merchant: true
      }
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await prisma.$disconnect();
  }
}
```

---

## 🗄️ **Step 4: Database Configuration**

### **4.1 Neon Database Setup**
1. Go to [neon.tech](https://neon.tech)
2. Create free account
3. Create new project
4. Copy connection string
5. Add to Vercel environment variables

### **4.2 Run Migrations**
```bash
# In your local environment
cd server
npx prisma migrate deploy
npx prisma generate
```

---

## ⚙️ **Step 5: Vercel Configuration**

### **5.1 vercel.json Configuration**
```json
{
  "version": 2,
  "functions": {
    "api/**/*.js": {
      "runtime": "nodejs18.x"
    }
  },
  "env": {
    "NODE_ENV": "production"
  },
  "build": {
    "env": {
      "NEXT_PUBLIC_API_BASE_URL": "https://your-app-name.vercel.app/api"
    }
  }
}
```

### **5.2 Build Configuration**
- **Node.js Version**: 18.x
- **Build Command**: `npm run build`
- **Install Command**: `npm install`

---

## 🚀 **Step 6: Deployment Process**

### **6.1 Automatic Deployment**
1. Push to GitHub main branch
2. Vercel automatically deploys
3. Check deployment logs in Vercel dashboard

### **6.2 Manual Deployment**
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

---

## 🔍 **Step 7: Testing & Verification**

### **7.1 Health Checks**
- Frontend: `https://your-app-name.vercel.app`
- API Health: `https://your-app-name.vercel.app/api/health`
- Database: Check Vercel function logs

### **7.2 Test Endpoints**
```bash
# Test API endpoints
curl https://your-app-name.vercel.app/api/products
curl https://your-app-name.vercel.app/api/categories
```

---

## 📊 **Step 8: Monitoring & Optimization**

### **8.1 Vercel Analytics**
- Enable Vercel Analytics in dashboard
- Monitor performance metrics
- Check function execution times

### **8.2 Database Monitoring**
- Monitor Neon database usage
- Check connection limits
- Optimize queries for serverless

---

## 🛠️ **Step 9: Troubleshooting**

### **9.1 Common Issues**
- **Function timeout**: Increase timeout in `vercel.json`
- **Database connections**: Use connection pooling
- **Environment variables**: Check Vercel dashboard

### **9.2 Debug Commands**
```bash
# Check Vercel logs
vercel logs

# Check function logs
vercel logs --follow
```

---

## 💰 **Free Tier Limits**

### **Vercel Free Tier:**
- ✅ 100GB bandwidth/month
- ✅ Unlimited deployments
- ✅ Serverless functions (10s timeout)
- ✅ 1GB storage

### **Neon Free Tier:**
- ✅ 3GB storage
- ✅ 10GB transfer/month
- ✅ 0.5GB RAM

---

## 🎯 **Final Checklist**

- [ ] Repository connected to Vercel
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] API routes converted to serverless functions
- [ ] Frontend builds successfully
- [ ] All endpoints working
- [ ] Database connections stable
- [ ] Performance optimized

---

## 🚀 **Deploy Now!**

1. **Push to GitHub**: `git push origin main`
2. **Connect to Vercel**: Import repository
3. **Configure environment**: Add variables
4. **Deploy**: Automatic deployment
5. **Test**: Verify all functionality

Your Wali E-commerce application will be live at:
`https://your-app-name.vercel.app`

**Happy Deploying! 🎉**
