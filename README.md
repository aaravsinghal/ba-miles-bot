# British Airways Utilities - Flying Miles Discord Bot

A modern Discord bot for managing flying miles/points with **slash commands**, persistent SQLite database storage, leaderboards, transaction history, and staff management.

## ✨ Features

### Modern Slash Commands
- ✅ Full Discord slash command integration
- ✅ Auto-complete and validation
- ✅ Easy-to-use interface
- ✅ Mobile-friendly

### Public Features (All Users)
- ✈️ **Check Miles**: View your own or another user's flying miles
- 🏆 **Leaderboard**: See top miles earners
- 📜 **Transaction History**: View your miles transaction history
- 📊 **Real-time Updates**: All data persists across bot restarts

### Staff Features (Authorized Users Only)
- ➕ **Add Miles**: Award miles to users with reasons
- ➖ **Deduct Miles**: Remove miles from users with reasons
- 📝 **Set Miles**: Set exact mile amounts for users
- 📊 **Statistics**: View system-wide statistics
- 👥 **Staff List**: See all authorized staff members

### Admin Features (Server Administrators)
- 👤 **Staff Management**: Add or remove staff members
- 🔒 **Full Control**: Manage who can modify miles

## 🎮 Commands

### Public Commands
```
/miles [user]              - Check your miles or another user's miles
/leaderboard [limit]       - View top miles earners (default: 10, max: 25)
/history [user]            - View transaction history
/staff                     - List all staff members
/help                      - Show help message
```

### Staff Commands
```
/add user amount [reason]      - Add miles to a user
/deduct user amount [reason]   - Deduct miles from a user
/set user amount               - Set exact miles for a user
/stats                         - View system statistics
```

### Admin Commands
```
/addstaff user             - Grant staff permissions
/removestaff user          - Remove staff permissions
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16.x or higher
- A Discord Bot Token
- A Render account (for hosting)

### 5-Minute Setup

1. **Create Discord Bot**
   - Go to Discord Developer Portal
   - Create application and bot
   - Enable required intents
   - Copy bot token
   - Invite to server with `applications.commands` scope

2. **Deploy to Render**
   - Upload code to GitHub
   - Create web service on Render
   - Add `DISCORD_TOKEN` environment variable
   - Deploy!

3. **Set Up Keep-Alive**
   - Add UptimeRobot monitor
   - Point to `/health` endpoint
   - Set 5-minute interval

4. **Test in Discord**
   ```
   /addstaff user:@YourName
   /add user:@Someone amount:1000 reason:Welcome
   /miles
   /leaderboard
   ```

**See QUICKSTART.md for detailed instructions!**

## 📋 Requirements

- **Node.js**: 16.x or higher
- **Dependencies**:
  - discord.js (v14.x) - Discord API
  - better-sqlite3 (v9.x) - Database
  - express (v4.x) - Keep-alive server

## 💾 Database

The bot uses SQLite for persistent storage with:
- ✅ User profiles and balances
- ✅ Complete transaction history
- ✅ Staff permissions
- ✅ Automatic indexing
- ✅ Transaction safety
- ✅ Data integrity

**Database file:** `miles.db` (auto-created on first run)

## 🌐 Deployment

### Recommended: Render.com

**Pros:**
- Free tier available
- Auto-deploy from GitHub
- Easy environment variables
- Built-in SSL
- Simple setup

**Setup:**
1. Push code to GitHub
2. Connect to Render
3. Configure environment variables
4. Deploy!

### Free Tier Notes
- May sleep after 15 minutes inactivity
- Solution: UptimeRobot keep-alive pings
- 512MB RAM (sufficient for most uses)
- Automatic restarts

### Environment Variables
```
DISCORD_TOKEN=your_bot_token    # Required
CLIENT_ID=your_app_id          # Optional (auto-detected)
PORT=3000                       # Optional (Render provides)
```

## 🔧 Local Development

```bash
# Install dependencies
npm install

# Set environment variables
cp .env.example .env
# Edit .env with your bot token

# Run bot
npm start
```

## 📊 Database Management

Use the included admin utilities:

```bash
# View all users
node admin-utils.js users

# View staff members
node admin-utils.js staff

# View recent transactions
node admin-utils.js transactions

# System statistics
node admin-utils.js stats

# Backup database
node admin-utils.js backup

# Search users
node admin-utils.js search <username>
```

## 🔐 Security

- ✅ Permission-based access control
- ✅ Staff authorization system
- ✅ Input validation
- ✅ SQL injection protection
- ✅ Secure token storage
- ✅ Transaction audit logging

## 📈 Performance

### Free Tier Capabilities
- Handles 100+ users easily
- Sub-second response times
- Thousands of transactions
- 24/7 uptime with UptimeRobot

### Scaling
Consider upgrading when:
- 500+ active users
- >1000 commands per day
- Need guaranteed uptime
- Want automated backups

## 📚 Documentation

- **QUICKSTART.md** - 5-minute setup guide
- **DEPLOYMENT.md** - Complete deployment walkthrough
- **COMMANDS.md** - Full command reference
- **TROUBLESHOOTING.md** - Common issues and solutions
- **CHANGELOG.md** - Version history and roadmap
- **FILE_INDEX.md** - File navigation guide

## 🆘 Troubleshooting

### Bot Offline
- Check Render logs
- Verify token is correct
- Ensure bot is invited to server

### Commands Not Showing
- Wait 1-5 minutes for sync
- Refresh Discord
- Check bot permissions
- Verify `applications.commands` scope

### Data Not Persisting
- Check database file exists
- Verify Render disk space
- Consider paid plan for persistent disk

**See TROUBLESHOOTING.md for detailed solutions!**

## 🛠️ Customization

### Changing Bot Settings

Edit `index.js`:
```javascript
const EMBED_COLOR = 0x2B5BA6;  // Change embed color
```

### Adding New Commands

1. Define command in slash command array
2. Create handler function
3. Add to interaction handler switch
4. Commands auto-register on bot start

### Modifying Database

Edit `database.js`:
- Add new tables
- Create new queries
- Modify schema

## 📦 Project Structure

```
ba-miles-bot/
├── index.js           - Main bot application
├── database.js        - Database management
├── admin-utils.js     - CLI admin tools
├── package.json       - Dependencies
├── .env.example       - Environment template
├── render.yaml        - Render configuration
└── docs/              - Documentation files
```

## 🤝 Contributing

This is a complete, production-ready bot. Future enhancements welcome:
- Additional features
- Bug fixes
- Documentation improvements
- Performance optimizations

## 📄 License

MIT License - Free to use and modify for your needs!

## 🙏 Credits

Built with:
- [Discord.js](https://discord.js.org/) - Discord API library
- [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) - SQLite database
- [Express](https://expressjs.com/) - Web server

## 🎯 Version

**Current Version:** 2.0.0 (Slash Commands)
**Status:** Production Ready
**Last Updated:** February 22, 2026

---

## 🚀 Ready to Deploy?

1. Extract files
2. Read **QUICKSTART.md**
3. Follow setup steps
4. Start tracking miles!

**Need help?** See DEPLOYMENT.md and TROUBLESHOOTING.md

---

Built with ❤️ for British Airways and aviation enthusiasts ✈️
