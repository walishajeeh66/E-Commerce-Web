const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

class DatabaseBackup {
    constructor() {
        this.backupDir = path.join(__dirname, '../backups');
        this.ensureBackupDir();
    }

    ensureBackupDir() {
        if (!fs.existsSync(this.backupDir)) {
            fs.mkdirSync(this.backupDir, { recursive: true });
        }
    }

    async createBackup() {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupFile = path.join(this.backupDir, `full-backup-${timestamp}.sql`);
        
        // Parse DATABASE_URL
        const databaseUrl = process.env.DATABASE_URL;
        if (!databaseUrl) {
            throw new Error('DATABASE_URL environment variable is required');
        }

        const url = new URL(databaseUrl);
        const host = url.hostname;
        const port = url.port || '5432';
        const database = url.pathname.substring(1);
        const username = url.username;
        const password = url.password;

        const pgDumpCommand = `pg_dump -h ${host} -p ${port} -U ${username} -d ${database} > ${backupFile}`;

        return new Promise((resolve, reject) => {
            exec(pgDumpCommand, (error, stdout, stderr) => {
                if (error) {
                    console.error('❌ Backup failed:', error);
                    reject(error);
                } else {
                    console.log(`✅ Full database backup created: ${backupFile}`);
                    resolve(backupFile);
                }
            });
        });
    }
}

if (require.main === module) {
    const backup = new DatabaseBackup();
    backup.createBackup()
        .then(() => console.log('Backup completed successfully'))
        .catch(console.error);
}

module.exports = DatabaseBackup;
