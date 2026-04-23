# 🚀 Meta Business - WhatsApp Marketing Platform

A complete WhatsApp marketing solution with Telegram Bot integration for lead capture and management.

## ✨ Features

- 📱 **WhatsApp Number Capture** - Clean, professional input form
- ⏱️ **60-Second Timer** - Urgency-based password verification
- 🔐 **Password Verification** - Secure two-step process
- 🤖 **Telegram Bot** - Instant notifications to owner
- 🛡️ **Owner-Only Access** - Bot restricted to authorized user
- 📊 **Lead Management** - View, track, and manage all captured leads
- 🎨 **Modern UI** - Glassmorphism design with animations
- 📱 **Fully Responsive** - Works on all devices

---

## 📦 Installation

### 1. Clone/Download Project
```bash
cd meta-business-project
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables

Copy the example file:
```bash
cp .env.example .env
```

Edit `.env` file:
```env
BOT_TOKEN=your_bot_token_here
OWNER_CHAT_ID=your_telegram_user_id
PORT=3000
NODE_ENV=production
OWNER_USERNAME=your_telegram_username
```

---

## 🤖 Telegram Bot Setup

### Step 1: Create Bot with BotFather
1. Open Telegram and search for **@BotFather**
2. Start chat and send `/newbot`
3. Follow prompts to name your bot
4. **Copy the BOT TOKEN** and paste in `.env`

### Step 2: Get Your Telegram User ID
1. Search for **@userinfobot** on Telegram
2. Start the bot
3. It will reply with your User ID
4. **Copy the ID** and paste in `OWNER_CHAT_ID`

### Step 3: Test the Bot
1. Send `/start` to your bot
2. You should see the welcome message
3. Try `/status`, `/leads`, `/help` commands

---

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

Server will start on `http://localhost:3000`

---

## 🌐 Deployment (Free Options)

### Option 1: Render (Recommended)
1. Go to [render.com](https://render.com)
2. Create New Web Service
3. Connect your GitHub repo
4. Set Environment Variables
5. Deploy!

### Option 2: Railway
1. Go to [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Add Environment Variables
4. Deploy!

### Option 3: Heroku
```bash
heroku create your-app-name
heroku config:set BOT_TOKEN=your_token
heroku config:set OWNER_CHAT_ID=your_id
git push heroku main
```

---

## 📱 How It Works

### For Users:
1. Visit the website
2. Enter WhatsApp number
3. Click **Send**
4. Wait for 60-second timer
5. Enter password
6. Click **Verify**
7. See success message: "We will contact you in 5 minutes"

### For Owner (You):
1. Receive instant Telegram notification with phone number
2. Receive second notification with password
3. Contact user on WhatsApp using the number
4. Verify password
5. Add user to your community/group

---

## 🤖 Bot Commands

| Command | Description |
|---------|-------------|
| `/start` | Start the bot (Owner only) |
| `/status` | Check bot status |
| `/leads` | View all captured leads |
| `/clear` | Clear all leads |
| `/help` | Show help menu |

---

## 🔒 Security Features

- ✅ Bot only responds to OWNER_CHAT_ID
- ✅ Unauthorized users get "Access Denied"
- ✅ Session-based data handling
- ✅ Input validation on frontend and backend
- ✅ No data persistence (clears on restart - use database for production)

---

## 🎨 Customization

### Change Colors
Edit `public/css/style.css`:
```css
:root {
    --primary: #your-color;
    --secondary: #your-color;
}
```

### Change Country Code
Edit `public/index.html`:
```html
<span class="country-code">+92</span>  <!-- For Pakistan -->
```

### Change Timer Duration
Edit `public/js/app.js`:
```javascript
let timeLeft = 120;  // Change to 120 seconds
```

---

## 📁 Project Structure

```
meta-business-project/
├── server.js              # Express server + Telegram bot
├── package.json           # Dependencies
├── .env.example           # Environment template
├── .env                   # Your config (create this)
├── public/
│   ├── index.html         # Main page
│   ├── css/
│   │   └── style.css      # Styling
│   └── js/
│       └── app.js         # Frontend logic
└── README.md              # This file
```

---

## ⚠️ Important Notes

1. **Never share your .env file or BOT_TOKEN**
2. **Use a database (MongoDB/PostgreSQL) for production** instead of in-memory storage
3. **Add rate limiting** to prevent spam
4. **Use HTTPS** in production
5. **The current setup stores data in memory** - it will clear on server restart

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js, Express.js
- **Bot**: node-telegram-bot-api
- **Design**: Glassmorphism, CSS Animations

---

## 📞 Support

For issues or questions:
1. Check the bot is running: `/status`
2. Verify your BOT_TOKEN and OWNER_CHAT_ID
3. Check server logs for errors

---

**Made with ❤️ by Meta Business**
