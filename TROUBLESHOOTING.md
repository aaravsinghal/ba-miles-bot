# Troubleshooting Guide

## Common Issues & Solutions

### 🔴 Bot Shows Offline

#### Possible Causes:
1. Invalid Discord token
2. Render service crashed
3. Network issues
4. Bot not properly invited

#### Solutions:

**Check Render Status:**
1. Go to Render Dashboard
2. Check if service shows "Running" (green)
3. If not, click "Manual Deploy" → "Deploy latest commit"

**Verify Token:**
1. Go to Discord Developer Portal
2. Reset bot token
3. Update DISCORD_TOKEN in Render environment variables
4. Redeploy service

**Check Logs:**
1. Render Dashboard → Your Service → Logs
2. Look for error messages like:
   - "Invalid token"
   - "Connection refused"
   - "Cannot connect to Discord"

**Fix Steps:**
```
1. Render Dashboard → Environment → Edit DISCORD_TOKEN
2. Click "Save Changes"
3. Service will auto-redeploy
4. Check logs for "Logged in as..."
```

---

### ⚠️ Commands Not Responding

#### Possible Causes:
1. Bot lacks permissions
2. MESSAGE CONTENT INTENT not enabled
3. Bot can't see channel
4. Wrong command prefix

#### Solutions:

**Check Bot Permissions:**
1. Discord Server Settings → Roles
2. Find bot's role
3. Enable:
   - Read Messages
   - Send Messages
   - Embed Links
   - Read Message History

**Check Discord Intents:**
1. Discord Developer Portal → Your App → Bot
2. Enable "MESSAGE CONTENT INTENT"
3. Save changes
4. Restart bot (redeploy on Render)

**Test Channel Access:**
1. Try in different channel
2. Check channel permissions for bot role
3. Make sure bot isn't restricted

**Verify Command Prefix:**
```
Commands start with ! (exclamation mark)
Example: !help
NOT: help or /help
```

---

### 💾 Database Errors

#### Error: "database is locked"

**Cause:** Multiple processes accessing database

**Solution:**
1. Restart Render service
2. If persists, check for connection leaks in code

#### Error: "no such table"

**Cause:** Database not initialized

**Solution:**
1. Delete miles.db file (if exists locally)
2. Redeploy to Render
3. Database will auto-initialize

#### Error: "disk I/O error"

**Cause:** Insufficient disk space or permissions

**Solution:**
1. Check Render disk usage
2. May need to upgrade to paid plan
3. Clear old logs if possible

---

### 📊 Data Not Persisting

#### Symptoms:
- Miles reset after bot restart
- Transactions disappear
- Users lose their balances

#### Causes & Solutions:

**Free Tier Instance Restart:**
- Render free tier can restart instances
- Database file should persist but may not
- **Solution:** Upgrade to paid plan with persistent disk

**No Database Backup:**
- Always backup before major changes
- **Solution:** Run `node admin-utils.js backup` locally

**Wrong Database Path:**
- Check database.js uses correct path
- **Solution:** Should be `./miles.db` in same directory

---

### 🔄 Bot Keeps Going Offline (Free Tier)

#### Cause:
Render free tier puts inactive services to sleep after 15 minutes

#### Solutions:

**Verify UptimeRobot:**
1. Login to UptimeRobot
2. Check monitor is "Up" (green)
3. Verify URL is correct: `https://YOUR-APP.onrender.com/health`
4. Interval should be 5 minutes

**Check Health Endpoint:**
1. Open browser: `https://YOUR-APP.onrender.com/health`
2. Should show: `{"status":"healthy",...}`
3. If error, check Express server in index.js

**Upgrade to Paid Plan:**
- Render Starter ($7/month)
- No sleeping
- Better performance
- Persistent disk

---

### ❌ "Insufficient Miles" Error

#### This is Normal!

User doesn't have enough miles for the deduction.

**Check Balance:**
```
!miles @User
```

**Add Miles:**
```
!add @User 1000 Initial balance
```

---

### 🚫 Permission Denied for Staff Commands

#### Cause:
User is not in staff list

#### Solution:

**Add User as Staff (Admin only):**
```
!addstaff @Username
```

**Check Staff List:**
```
!staff
```

**Verify Admin Permissions:**
- Only Discord server administrators can add staff
- Check server role permissions

---

### 🔐 Environment Variable Issues

#### Error: "DISCORD_TOKEN is not set"

**Solution:**
1. Render Dashboard → Your Service → Environment
2. Add/Edit environment variable:
   - Key: `DISCORD_TOKEN`
   - Value: Your Discord bot token
3. Save changes
4. Service will redeploy

#### Wrong Token Format:

**Correct Format:**
```
MTIzNDU2Nzg5MDEyMzQ1Njc4OQ.AbCdEf.XyZ123-456_789ABC
```

**Not:**
```
"MTI..." (no quotes)
<token> (no brackets)
```

---

### 📡 Network/Connection Issues

#### Error: "ECONNREFUSED" or "ETIMEDOUT"

**Check:**
1. Internet connection
2. Discord API status: https://discordstatus.com/
3. Render service status

**Solution:**
- Usually temporary
- Wait 5-10 minutes
- If persists, redeploy service

#### Error: "Web server not responding"

**Check:**
1. Express server is running (index.js)
2. PORT environment variable
3. Health endpoint: `/health`

**Solution:**
```javascript
// Verify this code exists in index.js:
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

---

### 🐛 "Unknown Command" Message

#### Cause:
Command doesn't exist or typo

#### Solution:

**Check Available Commands:**
```
!help
```

**Common Typos:**
- `!mile` → `!miles` ✓
- `!leaderbord` → `!leaderboard` ✓
- `!ad` → `!add` ✓

**Case Sensitivity:**
- All commands are lowercase
- `!MILES` won't work
- `!miles` ✓

---

### 🔄 Bot Responding Slowly

#### Causes:
1. Free tier cold start (first request after sleep)
2. Database query slow
3. Network latency

#### Solutions:

**UptimeRobot Pinging:**
- Prevents cold starts
- Verify monitor is active

**Optimize Database:**
```bash
node admin-utils.js stats
```
- Check number of transactions
- Large history may slow queries

**Upgrade Plan:**
- Paid Render plan has better performance
- More RAM, faster CPU

---

### 📝 Logs Show Errors

#### Error: "Cannot find module"

**Solution:**
1. Missing dependency
2. Run: `npm install`
3. Redeploy to Render

#### Error: "Unexpected token"

**Cause:** Syntax error in code

**Solution:**
1. Check recent code changes
2. Validate JavaScript syntax
3. Revert to last working version

#### Error: "Memory limit exceeded"

**Cause:** Free tier has limited RAM (512MB)

**Solution:**
1. Upgrade to paid plan
2. Optimize code for memory usage

---

## Debugging Steps

### Step 1: Check Service Status
```
✅ Render Dashboard → Service shows "Running"
✅ Logs show "Logged in as [BotName]"
✅ No error messages in logs
```

### Step 2: Verify Configuration
```
✅ DISCORD_TOKEN is set correctly
✅ Bot has correct permissions in Discord
✅ MESSAGE CONTENT INTENT enabled
✅ Bot is in the server
```

### Step 3: Test Commands
```
✅ !help responds
✅ !miles responds
✅ Bot can send embeds
✅ Bot can mention users
```

### Step 4: Check Database
```
✅ miles.db file exists
✅ Tables created successfully
✅ Can query database
✅ Transactions recorded
```

### Step 5: Verify Keep-Alive
```
✅ UptimeRobot monitor active
✅ Health endpoint responds
✅ No sleep detected in logs
```

---

## Getting Additional Help

### Check Logs First
Always check logs before asking for help:
1. Render Dashboard → Logs
2. Last 100 lines usually show the issue

### Provide Information
When asking for help, include:
- Error message (exact text)
- What you were trying to do
- Recent changes made
- Logs (relevant parts)

### Useful Resources
- **Render Docs:** https://render.com/docs
- **Discord.js Guide:** https://discordjs.guide/
- **Discord Developer Portal:** https://discord.com/developers/docs

### Support Channels
- Render Support: https://render.com/docs/support
- Discord API Server: https://discord.gg/discord-api

---

## Prevention Tips

### Regular Maintenance
1. ✅ Check bot weekly
2. ✅ Review logs for warnings
3. ✅ Backup database monthly
4. ✅ Update dependencies quarterly

### Best Practices
1. ✅ Never share bot token
2. ✅ Keep code backed up
3. ✅ Test changes locally first
4. ✅ Document custom modifications

### Monitoring
1. ✅ UptimeRobot active
2. ✅ Check Discord notifications
3. ✅ Monitor Render dashboard
4. ✅ Review transaction logs

---

## Still Having Issues?

### Reset Everything (Last Resort)

1. **Delete and recreate bot:**
   - Discord Developer Portal
   - Create new application
   - Get new token

2. **Delete and recreate Render service:**
   - Delete current service
   - Create new one
   - Add environment variables
   - Deploy fresh

3. **Clear database:**
   ```bash
   node admin-utils.js clear
   ```
   ⚠️ This deletes ALL data!

### Contact Information

For persistent issues:
1. Check documentation again
2. Review code for errors
3. Try with fresh deployment
4. Seek help with error details

---

Remember: Most issues are configuration-related and easily fixed!
