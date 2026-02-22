// Admin Utilities for Database Management
// Run with: node admin-utils.js <command> [args]

const MilesDatabase = require('./database');
const db = new MilesDatabase();

const commands = {
    // View all users
    users: () => {
        const stmt = db.db.prepare('SELECT * FROM users ORDER BY miles DESC');
        const users = stmt.all();
        
        console.log('\n📊 All Users:');
        console.log('═'.repeat(80));
        users.forEach(user => {
            console.log(`${user.username.padEnd(30)} | ${String(user.miles).padStart(10)} miles | ID: ${user.user_id}`);
        });
        console.log('═'.repeat(80));
        console.log(`Total: ${users.length} users\n`);
    },

    // View all staff
    staff: () => {
        const staff = db.getAllStaff();
        
        console.log('\n👥 Staff Members:');
        console.log('═'.repeat(60));
        staff.forEach(member => {
            console.log(`${member.username.padEnd(30)} | ID: ${member.user_id}`);
        });
        console.log('═'.repeat(60));
        console.log(`Total: ${staff.length} staff members\n`);
    },

    // View recent transactions
    transactions: (limit = 20) => {
        const stmt = db.db.prepare(`
            SELECT t.*, u.username 
            FROM transactions t
            JOIN users u ON t.user_id = u.user_id
            ORDER BY timestamp DESC 
            LIMIT ?
        `);
        const transactions = stmt.all(limit);
        
        console.log(`\n📜 Recent ${limit} Transactions:`);
        console.log('═'.repeat(100));
        transactions.forEach(tx => {
            const type = tx.type === 'add' ? '➕' : tx.type === 'deduct' ? '➖' : '📝';
            const amount = tx.type === 'add' ? `+${tx.amount}` : tx.type === 'deduct' ? `-${tx.amount}` : tx.amount;
            console.log(`${type} ${tx.username.padEnd(20)} | ${String(amount).padStart(10)} miles | By: ${tx.staff_username.padEnd(20)} | ${new Date(tx.timestamp).toLocaleString()}`);
            if (tx.reason) console.log(`   Reason: ${tx.reason}`);
        });
        console.log('═'.repeat(100) + '\n');
    },

    // Get statistics
    stats: () => {
        const stats = db.getStats();
        const totalUsers = db.db.prepare('SELECT COUNT(*) as count FROM users').get().count;
        const totalStaff = db.db.prepare('SELECT COUNT(*) as count FROM staff').get().count;
        const totalTransactions = db.db.prepare('SELECT COUNT(*) as count FROM transactions').get().count;
        
        console.log('\n📊 Database Statistics:');
        console.log('═'.repeat(50));
        console.log(`Total Users:        ${totalUsers}`);
        console.log(`Total Staff:        ${totalStaff}`);
        console.log(`Total Transactions: ${totalTransactions}`);
        console.log(`Total Miles:        ${stats.total_miles || 0}`);
        console.log(`Average Miles:      ${Math.round(stats.avg_miles || 0)}`);
        console.log(`Highest Miles:      ${stats.max_miles || 0}`);
        console.log('═'.repeat(50) + '\n');
    },

    // Backup database
    backup: () => {
        const fs = require('fs');
        const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
        const backupFile = `miles_backup_${timestamp}.db`;
        
        try {
            fs.copyFileSync('miles.db', backupFile);
            console.log(`\n✅ Database backed up to: ${backupFile}\n`);
        } catch (error) {
            console.error(`\n❌ Backup failed: ${error.message}\n`);
        }
    },

    // Clear all data (DANGEROUS)
    clear: () => {
        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });

        readline.question('⚠️  WARNING: This will delete ALL data! Type "CONFIRM" to proceed: ', (answer) => {
            if (answer === 'CONFIRM') {
                db.db.exec('DELETE FROM transactions');
                db.db.exec('DELETE FROM users');
                db.db.exec('DELETE FROM staff');
                console.log('\n✅ All data cleared!\n');
            } else {
                console.log('\n❌ Operation cancelled.\n');
            }
            readline.close();
            db.close();
            process.exit(0);
        });
        return; // Don't close DB yet
    },

    // Search user
    search: (username) => {
        if (!username) {
            console.log('\n❌ Please provide a username to search\n');
            return;
        }

        const stmt = db.db.prepare(`
            SELECT * FROM users 
            WHERE username LIKE ? 
            ORDER BY miles DESC
        `);
        const users = stmt.all(`%${username}%`);
        
        if (users.length === 0) {
            console.log(`\n❌ No users found matching "${username}"\n`);
            return;
        }

        console.log(`\n🔍 Search Results for "${username}":`);
        console.log('═'.repeat(80));
        users.forEach(user => {
            console.log(`${user.username.padEnd(30)} | ${String(user.miles).padStart(10)} miles | ID: ${user.user_id}`);
        });
        console.log('═'.repeat(80) + '\n');
    },

    // Help
    help: () => {
        console.log('\n📖 Admin Utilities - Available Commands:');
        console.log('═'.repeat(60));
        console.log('node admin-utils.js users              - List all users');
        console.log('node admin-utils.js staff              - List all staff');
        console.log('node admin-utils.js transactions [N]   - Show last N transactions (default: 20)');
        console.log('node admin-utils.js stats              - Show database statistics');
        console.log('node admin-utils.js backup             - Backup database');
        console.log('node admin-utils.js search <username>  - Search for users');
        console.log('node admin-utils.js clear              - Clear all data (DANGEROUS)');
        console.log('node admin-utils.js help               - Show this help');
        console.log('═'.repeat(60) + '\n');
    }
};

// Parse command line arguments
const args = process.argv.slice(2);
const command = args[0] || 'help';
const commandArgs = args.slice(1);

if (commands[command]) {
    commands[command](...commandArgs);
    if (command !== 'clear') {
        db.close();
    }
} else {
    console.log(`\n❌ Unknown command: ${command}`);
    commands.help();
    db.close();
}
