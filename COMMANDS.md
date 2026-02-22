# Commands Reference Guide

## Overview
All commands use Discord's modern **slash command** system. Simply type `/` in any channel and Discord will show you available commands with auto-complete!

---

## 👥 Public Commands
*Available to all server members*

### /miles [user]
**Description:** Check flying miles balance

**Parameters:**
- `user` (optional): Select a user to check their miles

**Usage:**
```
/miles                    - Check your own miles
/miles user:@JohnDoe     - Check JohnDoe's miles
```

**Output:**
- Embedded message showing username and mile balance
- Formatted with thousands separator (e.g., 1,000)

**Permissions Required:** None

**Examples:**
```
/miles
→ ✈️ Flying Miles
  JohnDoe has 5,000 miles!

/miles user:@SarahSmith
→ ✈️ Flying Miles
  SarahSmith has 12,500 miles!
```

---

### /leaderboard [limit]
**Description:** View top miles earners

**Parameters:**
- `limit` (optional): Number of users to display (1-25, default: 10)

**Usage:**
```
/leaderboard              - Show top 10 users (default)
/leaderboard limit:5      - Show top 5 users
/leaderboard limit:25     - Show top 25 users (maximum)
```

**Output:**
- Embedded message with ranked list
- Top 3 get medal emojis (🥇🥈🥉)
- Formatted mile counts

**Permissions Required:** None

**Example:**
```
/leaderboard limit:5
→ 🏆 Flying Miles Leaderboard
  🥇 SarahSmith - 25,000 miles
  🥈 JohnDoe - 15,000 miles
  🥉 MikeJones - 10,000 miles
  4. EmilyBrown - 8,500 miles
  5. DavidLee - 7,200 miles
```

---

### /history [user]
**Description:** View transaction history

**Parameters:**
- `user` (optional): Select a user (staff only for other users)

**Usage:**
```
/history                  - View your transaction history
/history user:@JohnDoe   - (Staff only) View JohnDoe's history
```

**Output:**
- Last 10 transactions
- Shows type (add/deduct/set), amount, reason, staff member, and date
- Chronological order (newest first)

**Permissions Required:** 
- None for own history
- Staff required for viewing others

**Example:**
```
/history
→ 📜 Transaction History - JohnDoe
  ➕ +1,000 miles
     Completed training
     By: AdminUser | 2/22/2026, 2:30:00 PM
  
  ➕ +500 miles
     Welcome bonus
     By: StaffUser | 2/20/2026, 10:15:00 AM
```

---

### /staff
**Description:** List all staff members

**Usage:**
```
/staff
```

**Output:**
- List of all users with staff permissions
- Shows username and user ID

**Permissions Required:** None (public command)

**Example:**
```
/staff
→ 👥 Staff Members
  • AdminUser (ID: 123456789)
  • ModUser (ID: 987654321)
  • StaffUser (ID: 456789123)
```

---

### /help
**Description:** Display available commands and usage

**Usage:**
```
/help
```

**Output:**
- Customized based on user permissions
- Shows public commands for everyone
- Shows staff commands if user is staff
- Shows admin commands if user is administrator
- Sent as ephemeral (only you can see it)

**Permissions Required:** None

---

## 🛠️ Staff Commands
*Require staff permissions (added via /addstaff)*

### /add user amount [reason]
**Description:** Add miles to a user's account

**Parameters:**
- `user` (required): Select the user
- `amount` (required): Positive integer
- `reason` (optional): Text explaining why

**Usage:**
```
/add user:@JohnDoe amount:1000
/add user:@SarahSmith amount:5000 reason:Excellent customer service
```

**Output:**
- Confirmation message with new balance
- Transaction recorded in database

**Permissions Required:** Staff

**Examples:**
```
/add user:@JohnDoe amount:1000
→ ✅ Miles Added
  Added 1,000 miles to JohnDoe
  New Balance: 6,000 miles
  Reason: No reason provided

/add user:@SarahSmith amount:5000 reason:Excellent customer service
→ ✅ Miles Added
  Added 5,000 miles to SarahSmith
  New Balance: 30,000 miles
  Reason: Excellent customer service
```

**Error Messages:**
- "You do not have permission" - Not staff
- "Insufficient miles" - User doesn't have enough to deduct
- Discord validation errors for invalid parameters

---

### /deduct user amount [reason]
**Description:** Deduct miles from a user's account

**Parameters:**
- `user` (required): Select the user
- `amount` (required): Positive integer
- `reason` (optional): Text explaining why

**Usage:**
```
/deduct user:@JohnDoe amount:500 reason:Redeemed reward
/deduct user:@SarahSmith amount:2000
```

**Output:**
- Confirmation message with new balance
- Transaction recorded in database

**Permissions Required:** Staff

**Examples:**
```
/deduct user:@JohnDoe amount:500 reason:Redeemed reward
→ ✅ Miles Deducted
  Deducted 500 miles from JohnDoe
  New Balance: 5,500 miles
  Reason: Redeemed reward

/deduct user:@SarahSmith amount:2000
→ ✅ Miles Deducted
  Deducted 2,000 miles from SarahSmith
  New Balance: 28,000 miles
  Reason: No reason provided
```

**Error Messages:**
- "Insufficient miles" - User doesn't have enough miles

**Important:** Cannot deduct more miles than user has

---

### /set user amount
**Description:** Set a user's miles to an exact amount

**Parameters:**
- `user` (required): Select the user
- `amount` (required): Non-negative integer

**Usage:**
```
/set user:@JohnDoe amount:10000
/set user:@SarahSmith amount:0
```

**Output:**
- Confirmation message
- Transaction recorded showing change

**Permissions Required:** Staff

**Examples:**
```
/set user:@JohnDoe amount:10000
→ ✅ Miles Set
  Set JohnDoe's miles to 10,000

/set user:@SarahSmith amount:0
→ ✅ Miles Set
  Set SarahSmith's miles to 0
```

**Use Cases:**
- Correcting errors
- Resetting accounts
- Setting initial balances
- Manual adjustments

---

### /stats
**Description:** View system-wide statistics

**Usage:**
```
/stats
```

**Output:**
- Total users in system
- Total miles across all users
- Average miles per user
- Highest mile count

**Permissions Required:** Staff

**Example:**
```
/stats
→ 📊 System Statistics
  Total Users: 47
  Total Miles: 234,500
  Average Miles: 4,989
  Highest Miles: 30,000
```

---

## 👑 Admin Commands
*Require Discord server Administrator permission*

### /addstaff user
**Description:** Grant staff permissions to a user

**Parameters:**
- `user` (required): Select the user to promote

**Usage:**
```
/addstaff user:@NewStaff
```

**Output:**
- Confirmation message
- User added to staff database

**Permissions Required:** Discord Administrator

**Example:**
```
/addstaff user:@NewStaff
→ ✅ Staff Added
  NewStaff has been added to the staff team.
```

**Effects:**
- User can now use all staff commands
- Shows up in /staff list
- Can manage miles for all users

---

### /removestaff user
**Description:** Remove staff permissions from a user

**Parameters:**
- `user` (required): Select the user to demote

**Usage:**
```
/removestaff user:@OldStaff
```

**Output:**
- Confirmation message
- User removed from staff database

**Permissions Required:** Discord Administrator

**Example:**
```
/removestaff user:@OldStaff
→ ✅ Staff Removed
  OldStaff has been removed from the staff team.
```

**Effects:**
- User loses access to staff commands
- Removed from /staff list
- Can still use public commands

---

## 💡 Tips & Best Practices

### Slash Command Features
1. **Auto-complete**: Discord shows you valid options as you type
2. **Validation**: Can't submit invalid values (negative numbers, etc.)
3. **User selection**: Click or mention users easily
4. **No prefix needed**: Just type `/` to start

### For Staff
1. **Always provide reasons** when adding/deducting miles
2. **Use /history** before making adjustments
3. **Double-check amounts** in the preview before submitting
4. **Document unusual transactions** with detailed reasons

### For Admins
1. **Carefully select staff** - they have power to modify miles
2. **Regular audits** using /stats
3. **Review transaction logs** periodically
4. **Backup database** regularly (see admin-utils.js)

### For Everyone
1. **Type `/` to see all available commands**
2. **Use tab/enter to auto-complete**
3. **Commands work in any channel bot can see**
4. **Report issues** to staff immediately

---

## Command Permissions Matrix

| Command | Everyone | Staff | Admin |
|---------|----------|-------|-------|
| /miles | ✅ | ✅ | ✅ |
| /leaderboard | ✅ | ✅ | ✅ |
| /history (self) | ✅ | ✅ | ✅ |
| /history (others) | ❌ | ✅ | ✅ |
| /help | ✅ | ✅ | ✅ |
| /staff | ✅ | ✅ | ✅ |
| /add | ❌ | ✅ | ✅ |
| /deduct | ❌ | ✅ | ✅ |
| /set | ❌ | ✅ | ✅ |
| /stats | ❌ | ✅ | ✅ |
| /addstaff | ❌ | ❌ | ✅ |
| /removestaff | ❌ | ❌ | ✅ |

---

## Response Times

**Typical response times:**
- Public commands: < 1 second
- Staff commands: < 2 seconds
- First request after sleep (free tier): 5-30 seconds

**If bot doesn't respond:**
1. Check bot is online (green dot)
2. Verify command appears in slash command list
3. Check bot permissions in channel
4. Wait for commands to sync (up to 5 minutes after bot start)

---

## Slash Command Registration

**Commands auto-register when bot starts!**

- Global commands: Available in all servers (may take 1-5 minutes to sync)
- Commands persist even after bot restart
- To refresh: Kick and re-invite bot, or wait for Discord sync

**Troubleshooting command visibility:**
1. Wait 5 minutes after bot startup
2. Refresh Discord (Ctrl+R or Cmd+R)
3. Check bot has "Use Slash Commands" permission
4. Kick and re-invite bot if needed

---

## Frequently Asked Questions

**Q: Why slash commands instead of prefix commands (!miles)?**
A: Slash commands are Discord's modern standard with:
- Better UX with auto-complete
- Built-in validation
- Easier discoverability
- Better mobile support

**Q: Can I use both slash and prefix commands?**
A: This version uses only slash commands for the best experience

**Q: Commands not showing up?**
A: Wait 1-5 minutes after bot startup for Discord to sync globally

**Q: Can users give miles to each other?**
A: No, only staff can modify miles

**Q: Is there a limit to miles?**
A: No practical limit (billions supported)

**Q: Can I export data?**
A: Yes, use admin-utils.js CLI tool

**Q: How do I change command permissions?**
A: Use Discord's Server Settings > Integrations > Bot Name

---

## Data Persistence

**All slash command actions are stored permanently:**
- ✅ User miles balances
- ✅ Complete transaction history
- ✅ Staff assignments
- ✅ Timestamps and reasons

**Data survives:**
- ✅ Bot restarts
- ✅ Server restarts
- ✅ Code updates
- ✅ Discord outages

---

For more information, see README.md and DEPLOYMENT.md
