# Changelog

## Version 2.0.0 (2024-02-22) - SLASH COMMANDS UPDATE

### 🎉 Major Update: Slash Commands

**Breaking Changes:**
- ⚠️ Prefix commands (`!command`) removed
- ✅ Replaced with Discord slash commands (`/command`)
- ✅ All functionality preserved
- ✅ Database fully compatible

### New Features
- ✅ Full Discord slash command integration
- ✅ Auto-complete and parameter validation
- ✅ Built-in command discovery (type `/`)
- ✅ Better mobile experience
- ✅ Native Discord permission integration
- ✅ Commands auto-register on bot startup

### Updated Commands

**Public Commands:**
- `/miles [user]` - Check miles (was `!miles`)
- `/leaderboard [limit]` - View leaderboard (was `!leaderboard`)
- `/history [user]` - Transaction history (was `!history`)
- `/staff` - List staff (was `!staff`)
- `/help` - Show help (was `!help`)

**Staff Commands:**
- `/add user amount [reason]` - Add miles (was `!add`)
- `/deduct user amount [reason]` - Deduct miles (was `!deduct`)
- `/set user amount` - Set miles (was `!set`)
- `/stats` - Statistics (was `!stats`)

**Admin Commands:**
- `/addstaff user` - Add staff (was `!addstaff`)
- `/removestaff user` - Remove staff (was `!removestaff`)

### Technical Changes
- Updated Discord.js intents (removed MESSAGE_CONTENT)
- Added slash command registration system
- Improved error handling for interactions
- Added ephemeral responses for errors
- Better permission checking

### Migration Notes
- No database changes required
- Existing data fully compatible
- Bot needs `applications.commands` OAuth2 scope
- Commands take 1-5 minutes to sync globally
- See SLASH_COMMANDS_INFO.md for migration guide

### Documentation Updates
- Updated all documentation for slash commands
- Added SLASH_COMMANDS_INFO.md
- Updated QUICKSTART.md with new setup steps
- Revised COMMANDS.md with slash syntax
- Updated README.md for v2.0

---

## Version 1.0.0 (2024-02-22)

### Initial Release

#### Features
- ✅ Full Discord bot with prefix commands
- ✅ SQLite persistent database
- ✅ Staff permission system
- ✅ Transaction logging
- ✅ Miles management
- ✅ Leaderboard system
- ✅ Transaction history
- ✅ Express keep-alive server

#### Commands (Prefix-based)
**Public:** !miles, !leaderboard, !history, !help
**Staff:** !add, !deduct, !set, !stats, !staff
**Admin:** !addstaff, !removestaff

#### Technical
- Node.js 16+ compatible
- Discord.js 14.x
- better-sqlite3
- Express server
- Full error handling

---

## Migration from v1.0 to v2.0

### What Changed
- Command syntax only (prefix → slash)
- Database format unchanged
- All data preserved
- Feature parity maintained

### How to Migrate

1. **Update Bot Code**
   - Replace old files with v2.0 files
   - Keep existing `miles.db` database file
   - Update environment variables if needed

2. **Update Bot Invite**
   - Re-invite bot with new scopes
   - Add `applications.commands` scope
   - Keep existing permissions

3. **Wait for Sync**
   - Commands register automatically
   - Wait 1-5 minutes for global sync
   - Refresh Discord client

4. **Train Users**
   - Show them `/` command picker
   - Share updated documentation
   - Demo new command syntax

### Data Migration
**No action needed!** Database is fully compatible.

---

## Future Roadmap

### Planned Features

#### v2.1.0
- [ ] Command permissions customization
- [ ] Scheduled mile awards
- [ ] Mile expiration system
- [ ] Enhanced statistics

#### v2.2.0
- [ ] Web dashboard
- [ ] Automated backups
- [ ] CSV export
- [ ] Achievement system

#### v3.0.0
- [ ] Multi-server support
- [ ] Advanced analytics
- [ ] API integration
- [ ] Mobile app

---

## Version Support

### Current Version: 2.0.0
- ✅ Fully supported
- ✅ Security updates
- ✅ Bug fixes
- ✅ Feature updates

### Previous Version: 1.0.0
- ⚠️ Legacy (prefix commands)
- ⚠️ No new features
- ✅ Security updates only
- 📅 EOL: TBD

---

## Upgrade Benefits

### Why Upgrade to v2.0?

1. **Better UX**: Slash commands are easier to use
2. **Discoverability**: Built-in command list
3. **Validation**: Automatic parameter checking
4. **Mobile-Friendly**: Better mobile experience
5. **Future-Proof**: Discord's recommended approach
6. **Native Permissions**: Better permission control

### Upgrade Process
1. Download v2.0
2. Replace files (keep miles.db)
3. Re-invite bot with new scopes
4. Wait for command sync
5. Done!

---

## Known Issues

### v2.0.0
- Commands may take 1-5 minutes to appear after first deploy
- Solution: Wait or refresh Discord client

### v1.0.0 (Legacy)
- Prefix commands may conflict with other bots
- No built-in command discovery
- Less mobile-friendly

---

## Contributors

### v2.0.0 Development
- Slash command implementation
- Documentation overhaul
- Migration guide creation
- Testing and validation

### v1.0.0 Development
- Initial bot creation
- Database design
- Command system
- Documentation

---

## Acknowledgments

### v2.0 Special Thanks
- Discord.js team for slash command support
- Community feedback on UX improvements
- Beta testers for migration testing

### Technology Stack
- Discord.js v14.x (Slash Commands)
- better-sqlite3 (Database)
- Express (Keep-alive)
- Node.js (Runtime)

---

**Current Version:** 2.0.0
**Release Date:** February 22, 2026
**Status:** Stable Release
**Breaking Changes:** Yes (v1.0 → v2.0)
**Migration Guide:** See SLASH_COMMANDS_INFO.md
