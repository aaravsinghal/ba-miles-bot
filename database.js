const Database = require('better-sqlite3');
const path = require('path');

class MilesDatabase {
    constructor() {
        // Create database file in persistent location
        this.db = new Database(path.join(__dirname, 'miles.db'));
        this.initializeDatabase();
    }

    initializeDatabase() {
        // Create tables if they don't exist
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS users (
                user_id TEXT PRIMARY KEY,
                username TEXT NOT NULL,
                miles INTEGER DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS transactions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT NOT NULL,
                amount INTEGER NOT NULL,
                type TEXT NOT NULL,
                reason TEXT,
                staff_id TEXT NOT NULL,
                staff_username TEXT NOT NULL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(user_id)
            );

            CREATE TABLE IF NOT EXISTS staff (
                user_id TEXT PRIMARY KEY,
                username TEXT NOT NULL,
                added_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE INDEX IF NOT EXISTS idx_transactions_user 
            ON transactions(user_id);
            
            CREATE INDEX IF NOT EXISTS idx_transactions_timestamp 
            ON transactions(timestamp);
        `);
    }

    // Staff Management
    addStaff(userId, username) {
        const stmt = this.db.prepare(`
            INSERT OR REPLACE INTO staff (user_id, username) 
            VALUES (?, ?)
        `);
        stmt.run(userId, username);
    }

    removeStaff(userId) {
        const stmt = this.db.prepare('DELETE FROM staff WHERE user_id = ?');
        stmt.run(userId);
    }

    isStaff(userId) {
        const stmt = this.db.prepare('SELECT user_id FROM staff WHERE user_id = ?');
        return stmt.get(userId) !== undefined;
    }

    getAllStaff() {
        const stmt = this.db.prepare('SELECT * FROM staff ORDER BY username');
        return stmt.all();
    }

    // User Management
    getOrCreateUser(userId, username) {
        let stmt = this.db.prepare('SELECT * FROM users WHERE user_id = ?');
        let user = stmt.get(userId);

        if (!user) {
            stmt = this.db.prepare(`
                INSERT INTO users (user_id, username, miles) 
                VALUES (?, ?, 0)
            `);
            stmt.run(userId, username);
            
            stmt = this.db.prepare('SELECT * FROM users WHERE user_id = ?');
            user = stmt.get(userId);
        } else {
            // Update username if changed
            stmt = this.db.prepare('UPDATE users SET username = ? WHERE user_id = ?');
            stmt.run(username, userId);
        }

        return user;
    }

    // Miles Operations
    addMiles(userId, username, amount, reason, staffId, staffUsername) {
        const transaction = this.db.transaction(() => {
            // Get or create user
            this.getOrCreateUser(userId, username);

            // Update miles
            const updateStmt = this.db.prepare(`
                UPDATE users 
                SET miles = miles + ?, updated_at = CURRENT_TIMESTAMP 
                WHERE user_id = ?
            `);
            updateStmt.run(amount, userId);

            // Record transaction
            const transactionStmt = this.db.prepare(`
                INSERT INTO transactions (user_id, amount, type, reason, staff_id, staff_username) 
                VALUES (?, ?, 'add', ?, ?, ?)
            `);
            transactionStmt.run(userId, amount, reason, staffId, staffUsername);

            // Get updated user
            const userStmt = this.db.prepare('SELECT * FROM users WHERE user_id = ?');
            return userStmt.get(userId);
        });

        return transaction();
    }

    deductMiles(userId, username, amount, reason, staffId, staffUsername) {
        const transaction = this.db.transaction(() => {
            // Get or create user
            const user = this.getOrCreateUser(userId, username);

            if (user.miles < amount) {
                throw new Error(`Insufficient miles. User has ${user.miles} miles but tried to deduct ${amount}.`);
            }

            // Update miles
            const updateStmt = this.db.prepare(`
                UPDATE users 
                SET miles = miles - ?, updated_at = CURRENT_TIMESTAMP 
                WHERE user_id = ?
            `);
            updateStmt.run(amount, userId);

            // Record transaction
            const transactionStmt = this.db.prepare(`
                INSERT INTO transactions (user_id, amount, type, reason, staff_id, staff_username) 
                VALUES (?, ?, 'deduct', ?, ?, ?)
            `);
            transactionStmt.run(userId, amount, reason, staffId, staffUsername);

            // Get updated user
            const userStmt = this.db.prepare('SELECT * FROM users WHERE user_id = ?');
            return userStmt.get(userId);
        });

        return transaction();
    }

    setMiles(userId, username, amount, staffId, staffUsername) {
        const transaction = this.db.transaction(() => {
            // Get or create user
            const user = this.getOrCreateUser(userId, username);
            const oldMiles = user.miles;

            // Update miles
            const updateStmt = this.db.prepare(`
                UPDATE users 
                SET miles = ?, updated_at = CURRENT_TIMESTAMP 
                WHERE user_id = ?
            `);
            updateStmt.run(amount, userId);

            // Record transaction
            const transactionStmt = this.db.prepare(`
                INSERT INTO transactions (user_id, amount, type, reason, staff_id, staff_username) 
                VALUES (?, ?, 'set', ?, ?, ?)
            `);
            const difference = amount - oldMiles;
            transactionStmt.run(userId, difference, `Set from ${oldMiles} to ${amount}`, staffId, staffUsername);

            // Get updated user
            const userStmt = this.db.prepare('SELECT * FROM users WHERE user_id = ?');
            return userStmt.get(userId);
        });

        return transaction();
    }

    // Query Operations
    getUserMiles(userId) {
        const stmt = this.db.prepare('SELECT * FROM users WHERE user_id = ?');
        return stmt.get(userId);
    }

    getLeaderboard(limit = 10) {
        const stmt = this.db.prepare(`
            SELECT user_id, username, miles 
            FROM users 
            WHERE miles > 0
            ORDER BY miles DESC 
            LIMIT ?
        `);
        return stmt.all(limit);
    }

    getUserTransactions(userId, limit = 10) {
        const stmt = this.db.prepare(`
            SELECT * FROM transactions 
            WHERE user_id = ? 
            ORDER BY timestamp DESC 
            LIMIT ?
        `);
        return stmt.all(userId, limit);
    }

    getAllTransactions(limit = 50) {
        const stmt = this.db.prepare(`
            SELECT t.*, u.username 
            FROM transactions t
            JOIN users u ON t.user_id = u.user_id
            ORDER BY timestamp DESC 
            LIMIT ?
        `);
        return stmt.all(limit);
    }

    getStats() {
        const stmt = this.db.prepare(`
            SELECT 
                COUNT(*) as total_users,
                SUM(miles) as total_miles,
                AVG(miles) as avg_miles,
                MAX(miles) as max_miles
            FROM users
        `);
        return stmt.get();
    }

    close() {
        this.db.close();
    }
}

module.exports = MilesDatabase;
