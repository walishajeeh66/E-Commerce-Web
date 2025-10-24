# Neon Database Setup Guide

## 🚨 **Current Issue**
The Prisma schema validation is failing because of missing environment variables and potential schema conflicts.

## 🔧 **Step-by-Step Fix**

### 1. **Create Environment Files**

#### Create `server/.env` file:
```env
DATABASE_URL="your_neon_database_url_here"
NODE_ENV=development
```

#### Create root `.env` file:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
NODE_ENV=development
DATABASE_URL="your_neon_database_url_here"
NEXTAUTH_SECRET=12D16C923BA17672F89B18C1DB22A
NEXTAUTH_URL=http://localhost:3000
```

### 2. **Get Your Neon Database URL**

1. Go to your Neon dashboard
2. Copy the connection string
3. It should look like: `postgresql://username:password@host:port/database?sslmode=require`

### 3. **Test the Schema**

After creating the `.env` files, run:

```bash
cd server
npx prisma generate
```

### 4. **If Still Getting Errors**

The schema has been fixed with:
- ✅ Removed conflicting constraint names
- ✅ Added missing relation fields
- ✅ Fixed foreign key mappings

### 5. **Run Migration**

Once the schema generates successfully:

```bash
cd server
npx prisma migrate dev
```

## 🎯 **Expected Neon Database URL Format**

Your Neon URL should look like:
```
postgresql://username:password@ep-xxx-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require
```

## 🔍 **Troubleshooting**

### If you get "relation field missing" errors:
- The schema has been updated to include all necessary relations
- Make sure you're using the `server/prisma/schema.prisma` file

### If you get connection errors:
- Check your Neon database URL
- Make sure the database is accessible
- Verify the credentials are correct

### If you get constraint name conflicts:
- The schema has been updated to use unique constraint names
- All `_fkey` suffixes changed to `_idx` for indexes

## 📋 **Next Steps**

1. Create the `.env` files with your Neon database URL
2. Run `npx prisma generate` from the server directory
3. Run `npx prisma migrate dev` to create the database tables
4. Test your application

---

**The schema is now PostgreSQL-compatible and should work with Neon! 🚀**
