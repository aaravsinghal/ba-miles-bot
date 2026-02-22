const { Client, GatewayIntentBits, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder, REST, Routes } = require('discord.js');
const MilesDatabase = require('./database');
const express = require('express');

// Initialize Express for keep-alive
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('British Airways Utilities Bot is running!');
});

app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

const server = app.listen(PORT, () => {
    console.log(`Keep-alive server running on port ${PORT}`);
});

// Initialize Discord Bot
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
    ],
});

// Initialize Database
const db = new MilesDatabase();

// Bot Configuration
const EMBED_COLOR = 0x2B5BA6; // British Airways Blue

// Helper Functions
function createEmbed(title, description, color = EMBED_COLOR) {
    return new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setColor(color)
        .setTimestamp()
        .setFooter({ text: 'British Airways Utilities' });
}

function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Define Slash Commands
const commands = [
    new SlashCommandBuilder()
        .setName('miles')
        .setDescription('Check flying miles balance')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User to check (leave empty for yourself)')
                .setRequired(false)),
    
    new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('View top miles earners')
        .addIntegerOption(option =>
            option.setName('limit')
                .setDescription('Number of users to show (max 25)')
                .setMinValue(1)
                .setMaxValue(25)
                .setRequired(false)),
    
    new SlashCommandBuilder()
        .setName('history')
        .setDescription('View transaction history')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User to check (staff only, leave empty for yourself)')
                .setRequired(false)),
    
    new SlashCommandBuilder()
        .setName('add')
        .setDescription('Add miles to a user (Staff only)')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User to add miles to')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Amount of miles to add')
                .setMinValue(1)
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for adding miles')
                .setRequired(false)),
    
    new SlashCommandBuilder()
        .setName('deduct')
        .setDescription('Deduct miles from a user (Staff only)')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User to deduct miles from')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Amount of miles to deduct')
                .setMinValue(1)
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for deducting miles')
                .setRequired(false)),
    
    new SlashCommandBuilder()
        .setName('set')
        .setDescription('Set exact miles for a user (Staff only)')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User to set miles for')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Exact amount of miles to set')
                .setMinValue(0)
                .setRequired(true)),
    
    new SlashCommandBuilder()
        .setName('addstaff')
        .setDescription('Grant staff permissions (Admin only)')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User to make staff')
                .setRequired(true)),
    
    new SlashCommandBuilder()
        .setName('removestaff')
        .setDescription('Remove staff permissions (Admin only)')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User to remove from staff')
                .setRequired(true)),
    
    new SlashCommandBuilder()
        .setName('staff')
        .setDescription('List all staff members'),
    
    new SlashCommandBuilder()
        .setName('stats')
        .setDescription('View system statistics (Staff only)'),
    
    new SlashCommandBuilder()
        .setName('help')
        .setDescription('Show help and available commands'),
].map(command => command.toJSON());

// Register Slash Commands
async function registerCommands() {
    const TOKEN = process.env.DISCORD_TOKEN;
    const CLIENT_ID = process.env.CLIENT_ID;
    
    if (!CLIENT_ID) {
        console.log('⚠️  CLIENT_ID not set. Commands will be registered when bot is ready.');
        return;
    }

    const rest = new REST({ version: '10' }).setToken(TOKEN);

    try {
        console.log('🔄 Registering slash commands globally...');
        await rest.put(
            Routes.applicationCommands(CLIENT_ID),
            { body: commands },
        );
        console.log('✅ Successfully registered slash commands globally!');
    } catch (error) {
        console.error('❌ Error registering commands:', error);
    }
}

// Slash Command Handlers
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;

    try {
        switch (commandName) {
            case 'miles':
                await handleMiles(interaction);
                break;
            case 'leaderboard':
                await handleLeaderboard(interaction);
                break;
            case 'history':
                await handleHistory(interaction);
                break;
            case 'add':
                await handleAdd(interaction);
                break;
            case 'deduct':
                await handleDeduct(interaction);
                break;
            case 'set':
                await handleSet(interaction);
                break;
            case 'addstaff':
                await handleAddStaff(interaction);
                break;
            case 'removestaff':
                await handleRemoveStaff(interaction);
                break;
            case 'staff':
                await handleStaff(interaction);
                break;
            case 'stats':
                await handleStats(interaction);
                break;
            case 'help':
                await handleHelp(interaction);
                break;
        }
    } catch (error) {
        console.error(`Error executing ${commandName}:`, error);
        const errorMessage = '❌ An error occurred while executing that command.';
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: errorMessage, ephemeral: true });
        } else {
            await interaction.reply({ content: errorMessage, ephemeral: true });
        }
    }
});

// Command Handler Functions
async function handleMiles(interaction) {
    const targetUser = interaction.options.getUser('user') || interaction.user;
    const userId = targetUser.id;
    const username = targetUser.username;

    const user = db.getUserMiles(userId);
    const miles = user ? user.miles : 0;

    const embed = createEmbed(
        '✈️ Flying Miles',
        `**${username}** has **${formatNumber(miles)}** miles!`
    );

    await interaction.reply({ embeds: [embed] });
}

async function handleLeaderboard(interaction) {
    const limit = interaction.options.getInteger('limit') || 10;
    const leaderboard = db.getLeaderboard(limit);

    if (leaderboard.length === 0) {
        return await interaction.reply('📊 No users with miles yet!');
    }

    let description = '';
    for (let i = 0; i < leaderboard.length; i++) {
        const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`;
        description += `${medal} **${leaderboard[i].username}** - ${formatNumber(leaderboard[i].miles)} miles\n`;
    }

    const embed = createEmbed('🏆 Flying Miles Leaderboard', description);
    await interaction.reply({ embeds: [embed] });
}

async function handleHistory(interaction) {
    const targetUser = interaction.options.getUser('user');
    let userId, username;

    if (targetUser) {
        // Staff checking another user's history
        if (!db.isStaff(interaction.user.id)) {
            return await interaction.reply({ 
                content: '❌ You need staff permissions to view other users\' history.', 
                ephemeral: true 
            });
        }
        userId = targetUser.id;
        username = targetUser.username;
    } else {
        // User checking their own history
        userId = interaction.user.id;
        username = interaction.user.username;
    }

    const transactions = db.getUserTransactions(userId, 10);

    if (transactions.length === 0) {
        return await interaction.reply(`📜 No transaction history for ${username}.`);
    }

    let description = '';
    for (const tx of transactions) {
        const emoji = tx.type === 'add' ? '➕' : tx.type === 'deduct' ? '➖' : '📝';
        const sign = tx.type === 'add' ? '+' : tx.type === 'deduct' ? '-' : '';
        description += `${emoji} ${sign}${formatNumber(Math.abs(tx.amount))} miles\n`;
        if (tx.reason) description += `   *${tx.reason}*\n`;
        description += `   By: ${tx.staff_username} | ${new Date(tx.timestamp).toLocaleString()}\n\n`;
    }

    const embed = createEmbed(`📜 Transaction History - ${username}`, description);
    await interaction.reply({ embeds: [embed] });
}

async function handleAdd(interaction) {
    if (!db.isStaff(interaction.user.id)) {
        return await interaction.reply({ 
            content: '❌ You do not have permission to use this command.', 
            ephemeral: true 
        });
    }

    const targetUser = interaction.options.getUser('user');
    const amount = interaction.options.getInteger('amount');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    try {
        const updatedUser = db.addMiles(
            targetUser.id,
            targetUser.username,
            amount,
            reason,
            interaction.user.id,
            interaction.user.username
        );

        const embed = createEmbed(
            '✅ Miles Added',
            `Added **${formatNumber(amount)}** miles to **${targetUser.username}**\n\n` +
            `**New Balance:** ${formatNumber(updatedUser.miles)} miles\n` +
            `**Reason:** ${reason}`,
            0x00FF00
        );

        await interaction.reply({ embeds: [embed] });
    } catch (error) {
        await interaction.reply({ content: `❌ Error: ${error.message}`, ephemeral: true });
    }
}

async function handleDeduct(interaction) {
    if (!db.isStaff(interaction.user.id)) {
        return await interaction.reply({ 
            content: '❌ You do not have permission to use this command.', 
            ephemeral: true 
        });
    }

    const targetUser = interaction.options.getUser('user');
    const amount = interaction.options.getInteger('amount');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    try {
        const updatedUser = db.deductMiles(
            targetUser.id,
            targetUser.username,
            amount,
            reason,
            interaction.user.id,
            interaction.user.username
        );

        const embed = createEmbed(
            '✅ Miles Deducted',
            `Deducted **${formatNumber(amount)}** miles from **${targetUser.username}**\n\n` +
            `**New Balance:** ${formatNumber(updatedUser.miles)} miles\n` +
            `**Reason:** ${reason}`,
            0xFFA500
        );

        await interaction.reply({ embeds: [embed] });
    } catch (error) {
        await interaction.reply({ content: `❌ Error: ${error.message}`, ephemeral: true });
    }
}

async function handleSet(interaction) {
    if (!db.isStaff(interaction.user.id)) {
        return await interaction.reply({ 
            content: '❌ You do not have permission to use this command.', 
            ephemeral: true 
        });
    }

    const targetUser = interaction.options.getUser('user');
    const amount = interaction.options.getInteger('amount');

    try {
        const updatedUser = db.setMiles(
            targetUser.id,
            targetUser.username,
            amount,
            interaction.user.id,
            interaction.user.username
        );

        const embed = createEmbed(
            '✅ Miles Set',
            `Set **${targetUser.username}**'s miles to **${formatNumber(amount)}**`,
            0x0099FF
        );

        await interaction.reply({ embeds: [embed] });
    } catch (error) {
        await interaction.reply({ content: `❌ Error: ${error.message}`, ephemeral: true });
    }
}

async function handleAddStaff(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
        return await interaction.reply({ 
            content: '❌ Only administrators can manage staff.', 
            ephemeral: true 
        });
    }

    const targetUser = interaction.options.getUser('user');

    try {
        db.addStaff(targetUser.id, targetUser.username);

        const embed = createEmbed(
            '✅ Staff Added',
            `**${targetUser.username}** has been added to the staff team.`,
            0x00FF00
        );

        await interaction.reply({ embeds: [embed] });
    } catch (error) {
        await interaction.reply({ content: `❌ Error: ${error.message}`, ephemeral: true });
    }
}

async function handleRemoveStaff(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
        return await interaction.reply({ 
            content: '❌ Only administrators can manage staff.', 
            ephemeral: true 
        });
    }

    const targetUser = interaction.options.getUser('user');

    try {
        db.removeStaff(targetUser.id);

        const embed = createEmbed(
            '✅ Staff Removed',
            `**${targetUser.username}** has been removed from the staff team.`,
            0xFF0000
        );

        await interaction.reply({ embeds: [embed] });
    } catch (error) {
        await interaction.reply({ content: `❌ Error: ${error.message}`, ephemeral: true });
    }
}

async function handleStaff(interaction) {
    const staffList = db.getAllStaff();

    if (staffList.length === 0) {
        return await interaction.reply('📋 No staff members registered yet.');
    }

    let description = '';
    for (const staff of staffList) {
        description += `• **${staff.username}** (ID: ${staff.user_id})\n`;
    }

    const embed = createEmbed('👥 Staff Members', description);
    await interaction.reply({ embeds: [embed] });
}

async function handleStats(interaction) {
    if (!db.isStaff(interaction.user.id)) {
        return await interaction.reply({ 
            content: '❌ You do not have permission to use this command.', 
            ephemeral: true 
        });
    }

    const stats = db.getStats();

    const embed = createEmbed(
        '📊 System Statistics',
        `**Total Users:** ${stats.total_users || 0}\n` +
        `**Total Miles:** ${formatNumber(stats.total_miles || 0)}\n` +
        `**Average Miles:** ${formatNumber(Math.round(stats.avg_miles || 0))}\n` +
        `**Highest Miles:** ${formatNumber(stats.max_miles || 0)}`
    );

    await interaction.reply({ embeds: [embed] });
}

async function handleHelp(interaction) {
    const isStaff = db.isStaff(interaction.user.id);
    const isAdmin = interaction.member.permissions.has(PermissionFlagsBits.Administrator);

    let description = '**Public Commands:**\n';
    description += '`/miles [user]` - Check your miles or another user\'s miles\n';
    description += '`/leaderboard [limit]` - View the top miles earners\n';
    description += '`/history [user]` - View your transaction history\n';
    description += '`/staff` - List all staff members\n';
    description += '`/help` - Show this help message\n\n';

    if (isStaff) {
        description += '**Staff Commands:**\n';
        description += '`/add <user> <amount> [reason]` - Add miles to a user\n';
        description += '`/deduct <user> <amount> [reason]` - Deduct miles from a user\n';
        description += '`/set <user> <amount>` - Set a user\'s miles to a specific amount\n';
        description += '`/stats` - View system statistics\n\n';
    }

    if (isAdmin) {
        description += '**Admin Commands:**\n';
        description += '`/addstaff <user>` - Add a staff member\n';
        description += '`/removestaff <user>` - Remove a staff member\n';
    }

    const embed = createEmbed('📖 British Airways Utilities - Help', description);
    await interaction.reply({ embeds: [embed], ephemeral: true });
}

// Bot Ready Event
client.once('ready', async () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
    console.log(`📊 Serving ${client.guilds.cache.size} servers`);
    
    // Set bot status
    client.user.setActivity('/help for commands', { type: 3 }); // Type 3 = Watching
    
    // Register commands if CLIENT_ID is not set in env
    if (!process.env.CLIENT_ID) {
        try {
            const TOKEN = process.env.DISCORD_TOKEN;
            const rest = new REST({ version: '10' }).setToken(TOKEN);
            
            console.log('🔄 Registering slash commands globally...');
            await rest.put(
                Routes.applicationCommands(client.user.id),
                { body: commands },
            );
            console.log('✅ Successfully registered slash commands globally!');
        } catch (error) {
            console.error('❌ Error registering commands:', error);
        }
    }
});

// Error Handling
client.on('error', (error) => {
    console.error('Discord client error:', error);
});

process.on('unhandledRejection', (error) => {
    console.error('Unhandled promise rejection:', error);
});

process.on('SIGINT', () => {
    console.log('Shutting down gracefully...');
    db.close();
    server.close();
    client.destroy();
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('Shutting down gracefully...');
    db.close();
    server.close();
    client.destroy();
    process.exit(0);
});

// Register commands and login
const TOKEN = process.env.DISCORD_TOKEN;
if (!TOKEN) {
    console.error('❌ DISCORD_TOKEN environment variable is not set!');
    process.exit(1);
}

// Register commands if CLIENT_ID is provided
if (process.env.CLIENT_ID) {
    registerCommands();
}

client.login(TOKEN);
