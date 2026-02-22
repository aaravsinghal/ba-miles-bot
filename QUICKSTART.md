# Quick Start Guide - British Airways Utilities Bot

## 🚀 5-Minute Setup

### 1. Get Your Discord Bot Token (2 minutes)

1. Go to: https://discord.com/developers/applications
2. Click "New Application" → Name it → "Create"
3. Go to "Bot" → "Add Bot"
4. Enable these intents:
   - ✅ SERVER MEMBERS INTENT (optional but recommended)
5. Click "Reset Token" → Copy it (save for step 3)
6. Go to "OAuth2" → "URL Generator"
7. Check scopes: `bot` and `applications.commands`
8. Check permissions: Send Messages, Embed Links, Use Slash Commands
9. Copy URL → Open in browser → Invite to your server

### 2. Deploy to Render (2 minutes)

1. Create GitHub account (if you don't have one)
2. Go to: https://github.com/new
3. Create repository named "ba-miles-bot"
4. Upload all files from this folder to the repository

5. Go to: https://render.com (sign up with GitHub)
6. Click "New +" → "Web Service"
7. Connect your "ba-miles-bot" repository
8. Settings:
   - Name: `ba-miles-bot`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Plan: Free

9. Add Environment Variable:
   - Key: `DISCORD_TOKEN`
   - Value: (paste your token from step 1)

10. Click "Create Web Service" → Wait 3-5 minutes

### 3. Keep Bot Alive (1 minute)

1. Copy your Render URL (e.g., https://ba-miles-bot.onrender.com)
2. Go to: https://uptimerobot.com (sign up free)
3. Add New Monitor:
   - Type: HTTP(s)
   - URL: `YOUR-RENDER-URL/health`
   - Interval: 5 minutes
4. Create Monitor

### 4. Test in Discord (30 seconds)

**Slash commands will auto-register when bot starts!**

```
/addstaff user:@YourName
/add user:@Someone amount:1000 reason:Welcome bonus
/miles
/leaderboard
/help
```

## ✅ You're Done!

Your bot is now running 24/7 with persistent data storage and slash commands!

## 📝 Common Commands

**For Everyone:**
- `/miles` - Check your miles
- `/leaderboard` - Top earners
- `/history` - Your transactions

**For Staff:**
- `/add user:@user amount:500 reason:text` - Give miles
- `/deduct user:@user amount:200 reason:text` - Take miles
- `/stats` - View statistics

**For Admins:**
- `/addstaff user:@user` - Make someone staff
- `/removestaff user:@user` - Remove staff

## 🆘 Problems?

**Bot offline?**
→ Check Render logs: Dashboard → Your Service → Logs

**Slash commands not showing?**
→ Wait 1-5 minutes for Discord to sync commands globally. You can also try kicking and re-inviting the bot.

**Commands not working?**
→ Make sure bot has "Use Slash Commands" permission

**Need help?**
→ Read DEPLOYMENT.md for detailed troubleshooting

## 🎯 Next Steps

1. Add more staff: `/addstaff user:@Username`
2. Customize commands in `index.js`
3. Set up database backups (see README.md)
4. Consider upgrading to paid Render plan for 24/7 uptime

## 📚 Full Documentation

- **README.md** - Complete feature list
- **DEPLOYMENT.md** - Detailed deployment guide
- **COMMANDS.md** - Full command reference
- **admin-utils.js** - Database management tools

Enjoy your miles tracking bot with modern slash commands! ✈️
