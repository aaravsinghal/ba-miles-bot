# Complete Deployment Guide

## Step-by-Step Deployment to Render

### Part 1: Prepare Your Discord Bot

#### 1.1 Create Discord Application
1. Visit https://discord.com/developers/applications
2. Click "New Application"
3. Name it "British Airways Utilities"
4. Click "Create"

#### 1.2 Configure Bot Settings
1. Click "Bot" in the left sidebar
2. Click "Add Bot" → "Yes, do it!"
3. Under "Privileged Gateway Intents", enable:
   - ✅ PRESENCE INTENT
   - ✅ SERVER MEMBERS INTENT  
   - ✅ MESSAGE CONTENT INTENT
4. Click "Save Changes"

#### 1.3 Get Your Bot Token
1. Under "TOKEN", click "Reset Token"
2. Click "Yes, do it!"
3. **COPY THIS TOKEN** - you'll need it later
4. ⚠️ NEVER share this token publicly!

#### 1.4 Invite Bot to Server
1. Click "OAuth2" → "URL Generator" in left sidebar
2. Under "SCOPES", check:
   - ✅ bot
3. Under "BOT PERMISSIONS", check:
   - ✅ Send Messages
   - ✅ Embed Links
   - ✅ Read Message History
   - ✅ Use External Emojis
   - ✅ Add Reactions
4. Copy the generated URL at the bottom
5. Paste it in your browser
6. Select your server and authorize

### Part 2: Deploy to Render

#### 2.1 Prepare Code for Deployment

**Option A: Using GitHub (Recommended)**

1. Create a new repository on GitHub:
   - Go to https://github.com/new
   - Name it "ba-miles-bot"
   - Make it public or private
   - Don't initialize with README

2. Push your code to GitHub:
   ```bash
   # Navigate to your project folder
   cd ba-miles-bot
   
   # Initialize git
   git init
   
   # Add all files
   git add .
   
   # Commit
   git commit -m "Initial commit - BA Miles Bot"
   
   # Add remote
   git remote add origin https://github.com/YOUR_USERNAME/ba-miles-bot.git
   
   # Push to GitHub
   git branch -M main
   git push -u origin main
   ```

**Option B: Direct Upload**
- You can also upload files directly via GitHub's web interface

#### 2.2 Create Render Account
1. Go to https://render.com
2. Click "Get Started for Free"
3. Sign up with GitHub (recommended) or email
4. Verify your email

#### 2.3 Deploy to Render

1. **Go to Dashboard**
   - Visit https://dashboard.render.com/

2. **Create New Web Service**
   - Click "New +" button
   - Select "Web Service"

3. **Connect Repository**
   - If you used GitHub: Click "Connect account" → Authorize Render
   - Select your "ba-miles-bot" repository
   - Click "Connect"

4. **Configure Service**
   Fill in these settings:
   
   - **Name**: `ba-miles-bot` (or any name you prefer)
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: (leave blank)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Select "Free" (or paid for better performance)

5. **Add Environment Variable**
   - Scroll down to "Environment Variables"
   - Click "Add Environment Variable"
   - **Key**: `DISCORD_TOKEN`
   - **Value**: Paste your Discord bot token from Part 1.3
   - Click "Add"

6. **Create Web Service**
   - Scroll down and click "Create Web Service"
   - Wait for deployment (3-5 minutes)

7. **Copy Your App URL**
   - Once deployed, copy the URL (e.g., `https://ba-miles-bot.onrender.com`)
   - You'll need this for UptimeRobot

### Part 3: Keep Bot Alive with UptimeRobot

#### 3.1 Create UptimeRobot Account
1. Go to https://uptimerobot.com/
2. Click "Register for FREE"
3. Sign up and verify your email
4. Log in to dashboard

#### 3.2 Create Monitor
1. Click "Add New Monitor" (big plus button)

2. Configure Monitor:
   - **Monitor Type**: Select "HTTP(s)"
   - **Friendly Name**: `BA Miles Bot`
   - **URL (or IP)**: `https://YOUR-APP-NAME.onrender.com/health`
     (Replace YOUR-APP-NAME with your Render app name)
   - **Monitoring Interval**: `5 minutes`
   - **Monitor Timeout**: `30 seconds`

3. Click "Create Monitor"

4. ✅ Your bot will now be pinged every 5 minutes to stay awake!

### Part 4: Test Your Bot

#### 4.1 Verify Bot is Online
1. Go to your Discord server
2. Check if the bot shows as online (green dot)
3. If offline, check Render logs:
   - Go to Render dashboard
   - Click your service
   - Click "Logs" tab
   - Look for errors

#### 4.2 Test Commands

1. **Add yourself as staff** (as server administrator):
   ```
   !addstaff @YourUsername
   ```

2. **Test adding miles**:
   ```
   !add @SomeUser 1000 Welcome bonus
   ```

3. **Check miles**:
   ```
   !miles
   !miles @SomeUser
   ```

4. **View leaderboard**:
   ```
   !leaderboard
   ```

5. **Check history**:
   ```
   !history
   ```

6. **Get help**:
   ```
   !help
   ```

### Part 5: Managing Your Bot

#### 5.1 View Logs
1. Go to Render dashboard
2. Click your service
3. Click "Logs" tab
4. View real-time logs

#### 5.2 Update Bot
1. Make changes to your code locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update description"
   git push
   ```
3. Render will automatically redeploy (auto-deploy enabled by default)

#### 5.3 Manual Redeploy
1. Go to Render dashboard
2. Click your service
3. Click "Manual Deploy" dropdown
4. Select "Clear build cache & deploy"

#### 5.4 Add More Staff
As a server admin, use:
```
!addstaff @Username
```

To remove staff:
```
!removestaff @Username
```

### Part 6: Database Backup (Important!)

#### 6.1 Understanding Data Persistence

On Render Free tier:
- ⚠️ The database file (`miles.db`) persists BUT is not backed up
- If the instance restarts or crashes, data is usually retained
- However, for safety, back up regularly

#### 6.2 Manual Backup (Recommended)

**Option 1: Using Render Shell**
1. Go to Render dashboard
2. Click your service
3. Click "Shell" tab
4. Run: `cat miles.db | base64`
5. Copy output and save to a file locally
6. To restore: decode base64 and upload

**Option 2: Upgrade to Persistent Disk (Paid)**
1. Go to your service settings
2. Add a persistent disk
3. Mount it to your app
4. Store database there

#### 6.3 Automated Backups

For production use, consider:
- Setting up automated backups to cloud storage (S3, Google Drive)
- Upgrading to Render paid plan with persistent storage
- Using database backup services

## Troubleshooting

### Bot shows offline
**Check:**
1. Render service status (should show "Running")
2. Logs for errors
3. DISCORD_TOKEN environment variable is set correctly

**Fix:**
1. Go to Render dashboard → Service → Environment
2. Verify DISCORD_TOKEN is correct
3. Redeploy if needed

### Commands not responding
**Check:**
1. Bot has proper Discord permissions
2. MESSAGE CONTENT INTENT is enabled
3. Bot can see the channel you're typing in

**Fix:**
1. Re-invite bot with correct permissions
2. Check bot role in Discord server settings
3. Test with `!help` command

### "Insufficient miles" error
This is normal - user doesn't have enough miles to deduct.

### Database errors
**Check:**
1. Disk space on Render
2. File permissions

**Fix:**
1. Check Render logs for specific error
2. May need to upgrade to paid plan for more storage

### Bot keeps going offline (Free tier)
**Solution:**
- UptimeRobot should prevent this
- Verify UptimeRobot monitor is active
- Check monitor URL is correct: `https://YOUR-APP.onrender.com/health`
- Consider upgrading to paid Render plan ($7/month)

### Lost all data
**Prevention:**
- Set up regular backups (see Part 6)
- Render free tier can lose data on major crashes
- Consider paid plan with persistent disk

## Maintenance Checklist

### Weekly
- [ ] Check bot is online
- [ ] Review Render logs for errors
- [ ] Verify UptimeRobot is pinging successfully

### Monthly
- [ ] Backup database file
- [ ] Review disk space usage
- [ ] Check for Discord.js updates

### As Needed
- [ ] Add/remove staff members
- [ ] Update bot code for new features
- [ ] Respond to user issues

## Upgrading from Free Tier

When your bot grows, consider upgrading:

### Render Starter ($7/month)
- 512 MB RAM
- No sleeping
- Better performance
- Persistent disk option

### Benefits:
- 24/7 uptime without UptimeRobot
- Faster response times
- Database persistence guaranteed
- More reliable for production use

## Getting Help

If you encounter issues:

1. **Check Logs First**
   - Render dashboard → Logs tab
   - Look for error messages

2. **Common Issues**
   - Token invalid: Get new token from Discord
   - Permission errors: Check bot Discord permissions
   - Database locked: Restart the service

3. **Contact Support**
   - Render: https://render.com/docs/support
   - Discord: https://discord.com/developers/docs

## Success Checklist

✅ Discord bot created and configured
✅ Bot invited to server with correct permissions
✅ Code deployed to Render successfully
✅ DISCORD_TOKEN environment variable set
✅ Bot shows online in Discord
✅ UptimeRobot monitor created and active
✅ Tested all commands successfully
✅ Added yourself as staff
✅ Database persisting data correctly

## You're Done! 🎉

Your British Airways Utilities bot is now running 24/7 on Render!

### Quick Reference

**Bot Status**: https://YOUR-APP.onrender.com/health
**Render Dashboard**: https://dashboard.render.com/
**UptimeRobot**: https://uptimerobot.com/dashboard
**Discord Developers**: https://discord.com/developers/applications

Enjoy your miles tracking bot!
