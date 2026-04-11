import Database from 'better-sqlite3';

// For Vercel, use in-memory database (data will reset on each function call)
// In production, you might want to use Vercel Postgres or another persistent solution
const db = new Database(':memory:'/*, { verbose: console.log }*/);

// Initialize tables
db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT,
        xp INTEGER DEFAULT 0,
        level INTEGER DEFAULT 1,
        coins INTEGER DEFAULT 0,
        last_daily INTEGER DEFAULT 0,
        last_weekly INTEGER DEFAULT 0,
        is_afk INTEGER DEFAULT 0,
        afk_reason TEXT DEFAULT NULL,
        afk_timestamp INTEGER DEFAULT 0,
        job TEXT DEFAULT 'Pengangguran',
        daily_spins INTEGER DEFAULT 0,
        last_spin_time INTEGER DEFAULT 0,
        seasonal_xp INTEGER DEFAULT 0,
        reputation INTEGER DEFAULT 0,
        trust_score INTEGER DEFAULT 50,
        created_at INTEGER DEFAULT (strftime('%s', 'now')),
        updated_at INTEGER DEFAULT (strftime('%s', 'now'))
    );

    CREATE TABLE IF NOT EXISTS guilds (
        id TEXT PRIMARY KEY,
        name TEXT,
        settings TEXT DEFAULT '{}',
        created_at INTEGER DEFAULT (strftime('%s', 'now'))
    );

    CREATE TABLE IF NOT EXISTS inventory (
        user_id TEXT,
        item_name TEXT,
        quantity INTEGER DEFAULT 1,
        acquired_at INTEGER DEFAULT (strftime('%s', 'now')),
        PRIMARY KEY (user_id, item_name),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS game_cache (
        guild_id TEXT,
        channel_id TEXT,
        game_data TEXT,
        last_updated INTEGER DEFAULT (strftime('%s', 'now')),
        PRIMARY KEY (guild_id, channel_id)
    );

    CREATE TABLE IF NOT EXISTS moderation_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        guild_id TEXT,
        moderator_id TEXT,
        target_id TEXT,
        action TEXT,
        reason TEXT,
        timestamp INTEGER DEFAULT (strftime('%s', 'now'))
    );

    CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT,
        type TEXT,
        message TEXT,
        read INTEGER DEFAULT 0,
        created_at INTEGER DEFAULT (strftime('%s', 'now'))
    );
`);

// Prepared statements
export const statements = {
    // User operations
    getUser: db.prepare('SELECT * FROM users WHERE id = ?'),
    createUser: db.prepare(`
        INSERT OR IGNORE INTO users (id, username, created_at, updated_at)
        VALUES (?, ?, strftime('%s', 'now'), strftime('%s', 'now'))
    `),
    updateUser: db.prepare(`
        UPDATE users SET
            username = ?,
            xp = ?,
            level = ?,
            coins = ?,
            last_daily = ?,
            last_weekly = ?,
            is_afk = ?,
            afk_reason = ?,
            afk_timestamp = ?,
            job = ?,
            daily_spins = ?,
            last_spin_time = ?,
            seasonal_xp = ?,
            reputation = ?,
            trust_score = ?,
            updated_at = strftime('%s', 'now')
        WHERE id = ?
    `),

    // Guild operations
    getGuild: db.prepare('SELECT * FROM guilds WHERE id = ?'),
    createGuild: db.prepare('INSERT OR IGNORE INTO guilds (id, name) VALUES (?, ?)'),
    updateGuildSettings: db.prepare('UPDATE guilds SET settings = ?, updated_at = strftime(\'%s\', \'now\') WHERE id = ?'),

    // Inventory operations
    getInventory: db.prepare('SELECT * FROM inventory WHERE user_id = ?'),
    addItem: db.prepare('INSERT OR REPLACE INTO inventory (user_id, item_name, quantity, acquired_at) VALUES (?, ?, COALESCE((SELECT quantity FROM inventory WHERE user_id = ? AND item_name = ?), 0) + ?, strftime(\'%s\', \'now\'))'),
    removeItem: db.prepare('UPDATE inventory SET quantity = quantity - ? WHERE user_id = ? AND item_name = ? AND quantity >= ?'),
    deleteItem: db.prepare('DELETE FROM inventory WHERE user_id = ? AND item_name = ?'),

    // Game cache
    getGameCache: db.prepare('SELECT * FROM game_cache WHERE guild_id = ? AND channel_id = ?'),
    setGameCache: db.prepare('INSERT OR REPLACE INTO game_cache (guild_id, channel_id, game_data, last_updated) VALUES (?, ?, ?, strftime(\'%s\', \'now\'))'),

    // Moderation logs
    addModLog: db.prepare('INSERT INTO moderation_logs (guild_id, moderator_id, target_id, action, reason) VALUES (?, ?, ?, ?, ?)'),

    // Notifications
    addNotification: db.prepare('INSERT INTO notifications (user_id, type, message) VALUES (?, ?, ?)'),
    getNotifications: db.prepare('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC'),
    markNotificationRead: db.prepare('UPDATE notifications SET read = 1 WHERE id = ?'),

    // Statistics
    getTopUsers: db.prepare('SELECT * FROM users ORDER BY xp DESC LIMIT ?'),
    getTotalCoins: db.prepare('SELECT SUM(coins) as total FROM users'),
    getUserCount: db.prepare('SELECT COUNT(*) as count FROM users')
};

export default db;