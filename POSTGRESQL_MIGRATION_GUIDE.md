# PostgreSQL Migration Guide

This guide will help you migrate your Wali E-commerce application from MySQL to PostgreSQL.

## ✅ **Changes Already Made**

### 1. **Prisma Schema Updated**
- ✅ `prisma/schema.prisma` - Changed provider from `mysql` to `postgresql`
- ✅ `server/prisma/schema.prisma` - Changed provider from `mysql` to `postgresql`

### 2. **Dependencies Updated**
- ✅ `server/package.json` - Replaced `mysql` with `pg` and `@types/pg`
- ✅ Database connection files updated for PostgreSQL port (5432)

### 3. **Database Scripts Updated**
- ✅ `server/scripts/backup-database.js` - Updated to use `pg_dump` instead of `mysqldump`
- ✅ Database connection logging updated for PostgreSQL

### 4. **Documentation Updated**
- ✅ `README.md` - Updated to mention PostgreSQL instead of MySQL
- ✅ Database URL examples updated to PostgreSQL format
- ✅ `RENDER_DEPLOYMENT_GUIDE.md` - Already uses PostgreSQL

## 🚀 **Next Steps for You**

### 1. **Install PostgreSQL Dependencies**
```bash
cd server
npm install
```

### 2. **Set Up PostgreSQL Database**

#### Option A: Local PostgreSQL
1. Install PostgreSQL on your machine
2. Create a new database:
```sql
CREATE DATABASE wali_ecommerce;
AbdulSaboor123
```

#### Option B: Use Render PostgreSQL (Recommended for Production)
1. Follow the deployment guide to create a PostgreSQL database on Render
2. Use the connection string provided by Render

### 3. **Update Environment Variables**

#### For Local Development:
```env
# .env (root directory)
DATABASE_URL="postgresql://username:password@localhost:5432/wali_ecommerce?sslmode=disable"
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
NODE_ENV=development
NEXTAUTH_SECRET=12D16C923BA17672F89B18C1DB22A
NEXTAUTH_URL=http://localhost:3000
```

```env
# server/.env
DATABASE_URL="postgresql://username:password@localhost:5432/wali_ecommerce?sslmode=disable"
NODE_ENV=development
```

#### For Production (Render):
```env
# Use the DATABASE_URL provided by Render PostgreSQL service
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
```

### 4. **Run Database Migration**
```bash
# Navigate to server directory
cd server

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# (Optional) Seed the database with sample data
node utills/insertDemoData.js
```

### 5. **Test the Application**
```bash
# Start the backend server
cd server
npm start

# In another terminal, start the frontend
npm run dev
```

## 🔧 **Key Differences Between MySQL and PostgreSQL**

### 1. **Connection String Format**
- **MySQL**: `mysql://user:pass@host:3306/db?sslmode=disabled`
- **PostgreSQL**: `postgresql://user:pass@host:5432/db?sslmode=disable`

### 2. **Default Ports**
- **MySQL**: 3306
- **PostgreSQL**: 5432

### 3. **Backup Commands**
- **MySQL**: `mysqldump`
- **PostgreSQL**: `pg_dump`

### 4. **SSL Mode**
- **MySQL**: `sslmode=disabled`
- **PostgreSQL**: `sslmode=disable`

## 🚨 **Important Notes**

1. **Data Migration**: If you have existing data in MySQL, you'll need to export it and import it into PostgreSQL. The schema structure remains the same thanks to Prisma.

2. **Case Sensitivity**: PostgreSQL is more case-sensitive than MySQL. Make sure your queries use the correct case.

3. **UUID Generation**: Both databases support UUID, so no changes needed there.

4. **Text Fields**: PostgreSQL handles `@db.Text` fields the same way as MySQL.

## 🎯 **Benefits of PostgreSQL**

1. **Better Performance**: Generally faster for complex queries
2. **Advanced Features**: JSON support, full-text search, arrays
3. **Better Standards Compliance**: More SQL standard compliant
4. **Extensibility**: Rich ecosystem of extensions
5. **Cloud Support**: Better support on cloud platforms like Render

## 🔍 **Troubleshooting**

### Common Issues:

1. **Connection Refused**: Make sure PostgreSQL is running and accessible
2. **Authentication Failed**: Check username/password in DATABASE_URL
3. **Database Not Found**: Ensure the database exists
4. **SSL Issues**: Try `sslmode=disable` for local development

### Testing Connection:
```bash
# Test database connection
cd server
node scripts/test-connection.js
```

## 📚 **Additional Resources**

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Prisma PostgreSQL Guide](https://www.prisma.io/docs/concepts/database-connectors/postgresql)
- [Render PostgreSQL Setup](https://render.com/docs/databases)

---

**Your application is now ready for PostgreSQL! 🚀**
