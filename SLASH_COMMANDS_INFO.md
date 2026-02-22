# Slash Commands - What's New

## 🎉 Major Update: Prefix Commands → Slash Commands

This bot now uses **Discord's modern slash command system** instead of prefix commands (`!command`).

### What Changed?

**Before (v1.0):**
```
!miles @user
!add @user 1000 reason
!leaderboard 10
```

**Now (v2.0):**
```
/miles user:@user
/add user:@user amount:1000 reason:text
/leaderboard limit:10
```

---

## ✨ Benefits of Slash Commands

### 1. Better User Experience
- **Auto-complete**: Discord shows options as you type
- **Validation**: Can't submit invalid values
- **Help text**: Each option has a description
- **Mobile-friendly**: Easier to use on mobile

### 2. Improved Discoverability
- Type `/` to see all available commands
- No need to remember command syntax
- Built-in documentation

### 3. Better Permissions
- Integrates with Discord's permission system
- Server admins can customize who sees what
- Per-channel command restrictions

### 4. Modern Standard
- Discord's recommended approach
- Better long-term support
- Consistent with other bots

---

## 🔄 Migration Guide

### If You Used Prefix Commands Before

**Old Command** → **New Command**

Public Commands:
- `!miles` → `/miles`
- `!miles @user` → `/miles user:@user`
- `!leaderboard` → `/leaderboard`
- `!leaderboard 5` → `/leaderboard limit:5`
- `!history` → `/history`
- `!help` → `/help`
- `!staff` → `/staff`

Staff Commands:
- `!add @user 500 reason` → `/add user:@user amount:500 reason:reason text`
- `!deduct @user 200 reason` → `/deduct user:@user amount:200 reason:reason text`
- `!set @user 1000` → `/set user:@user amount:1000`
- `!stats` → `/stats`

Admin Commands:
- `!addstaff @user` → `/addstaff user:@user`
- `!removestaff @user` → `/removestaff user:@user`

---

## 🎯 How to Use Slash Commands

### Step 1: Type `/`
Start any message with `/` to open the command picker

### Step 2: Select Command
- Type command name to filter
- Click or use arrow keys + enter
- Discord shows you available commands

### Step 3: Fill Parameters
- Discord guides you through each parameter
- Required parameters are marked
- Optional parameters can be skipped
- Autocomplete for users, numbers, etc.

### Step 4: Submit
- Press Enter or click "Send"
- Command executes immediately
- Response appears in channel

---

## 📱 Example Usage

### Check Miles (Simple)
1. Type `/miles`
2. Press Enter
3. See your miles!

### Check Someone Else's Miles
1. Type `/miles`
2. Tab to `user` parameter
3. Type `@` or click to select user
4. Press Enter

### Add Miles to User (Staff)
1. Type `/add`
2. Select user
3. Enter amount (number)
4. Optionally add reason
5. Press Enter

---

## ⚙️ Command Registration

### Automatic Registration
- Commands auto-register when bot starts
- Takes 1-5 minutes to sync globally
- Persists after bot restart
- No manual setup needed

### First-Time Setup
1. Invite bot with `applications.commands` scope
2. Bot registers commands on startup
3. Wait 1-5 minutes for sync
4. Refresh Discord if needed
5. Commands appear in `/` menu

### Troubleshooting Registration

**Commands not showing?**
1. Wait 5 minutes after bot startup
2. Refresh Discord (Ctrl+R)
3. Check bot has "Use Slash Commands" permission
4. Kick and re-invite bot (last resort)

**Commands showing but not working?**
1. Check bot is online
2. Verify permissions in channel
3. Check Render logs for errors

---

## 🔧 Technical Details

### Bot Configuration

**Intents Required:**
- `Guilds` (required for slash commands)
- `GuildMembers` (optional, for better UX)

**Permissions Required:**
- Send Messages
- Embed Links
- Use Slash Commands

**OAuth2 Scopes:**
- `bot` (required)
- `applications.commands` (required for slash commands)

### Command Definition

Commands are defined in `index.js`:
```javascript
const commands = [
    new SlashCommandBuilder()
        .setName('miles')
        .setDescription('Check flying miles')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User to check')
                .setRequired(false)
        ),
    // ... more commands
];
```

### Registration Process

1. Bot connects to Discord
2. Fetches application ID
3. Registers commands via REST API
4. Discord syncs globally (1-5 minutes)
5. Commands available in all servers

---

## 🆚 Comparison: Prefix vs Slash

| Feature | Prefix (!command) | Slash (/command) |
|---------|------------------|------------------|
| Discoverability | Must know syntax | Built-in list |
| Validation | Manual checking | Automatic |
| Mobile UX | Difficult | Easy |
| Autocomplete | No | Yes |
| Help text | External | Built-in |
| Permissions | Manual | Discord native |
| Modern | Legacy | Standard |

---

## 💡 Best Practices

### For Users
1. **Type `/` to explore** - See all available commands
2. **Use tab to navigate** - Between parameters
3. **Let Discord guide you** - Follow autocomplete suggestions
4. **Check descriptions** - Each parameter explains itself

### For Staff
1. **Always add reasons** - Good practice for audit trail
2. **Use autocomplete** - Select users from list
3. **Preview before send** - Check amounts carefully
4. **Review /history** - Check before making changes

### For Admins
1. **Configure permissions** - Discord Server Settings > Integrations
2. **Restrict channels** - Limit where commands work
3. **Monitor usage** - Check /stats regularly
4. **Train staff** - Show them how slash commands work

---

## 🎓 Learning Resources

### Discord Documentation
- [Slash Commands Guide](https://discord.com/developers/docs/interactions/slash-commands)
- [Application Commands](https://discord.com/developers/docs/interactions/application-commands)

### Bot Documentation
- **COMMANDS.md** - Full command reference
- **QUICKSTART.md** - Quick setup guide
- **README.md** - Feature overview

---

## ❓ FAQ

**Q: Can I still use prefix commands (!miles)?**
A: No, this version uses only slash commands for the best experience.

**Q: Why not support both?**
A: Slash commands are Discord's modern standard and provide a better UX.

**Q: What if I prefer prefix commands?**
A: Consider using an older version (v1.0), but slash commands are recommended.

**Q: Do slash commands work on mobile?**
A: Yes! They're actually easier on mobile than prefix commands.

**Q: How do I see available commands?**
A: Type `/` in any channel and Discord shows you all commands.

**Q: Commands not syncing?**
A: Wait 5 minutes, refresh Discord, or kick/re-invite bot.

**Q: Can I customize slash commands?**
A: Yes! Edit the command definitions in `index.js`.

**Q: Do old transactions still work?**
A: Yes! Database is fully compatible. Only the command interface changed.

---

## 🚀 Getting Started

1. **Deploy bot** using QUICKSTART.md
2. **Wait 5 minutes** for commands to sync
3. **Type `/`** in Discord to see commands
4. **Start using** modern slash commands!

---

**Version:** 2.0.0 (Slash Commands)
**Migration:** Automatic (no data loss)
**Status:** Production Ready

Welcome to modern Discord bot commands! ✨
