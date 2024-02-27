const TeleBot = require("telebot");
const fs = require("fs-extra");
const path = require("path");
const http = require("http");
const axios = require("axios");
const gradient = require('gradient-string');

const logger = require("./logger");
const loader = require("./loader");

const config = require("./config.json");
const { botToken, adminId, prefix } = config;

const bot = new TeleBot(botToken);

// Load commands and events dynamically
loader.loadCommands(bot, path.join(__dirname, "commands"), prefix, adminId, logger);
loader.loadEvents(bot, path.join(__dirname, "events"), logger);

// Log received messages
bot.on("text", (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  const logMessage = `[${new Date().toLocaleString()}] Received message | User ID: ${userId} | Group ID: ${chatId} | Message: ${msg.text}`;
  logger(logMessage);
});

// Log user join event
bot.on("newChatMembers", (msg) => {
  const chatId = msg.chat.id;
  const newMembers = msg.new_chat_members.map((member) => member.id);
  const logMessage = `[${new Date().toLocaleString()}] New user(s) joined group ${chatId}: ${newMembers.join(", ")}`;
  logger(logMessage);
});

// Log user leave event
bot.on("leftChatMember", (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.left_chat_member.id;
  const logMessage = `[${new Date().toLocaleString()}] User ${userId} left group ${chatId}`;
  logger(logMessage);
});

// Function to send "Hello, I'm alive!" message
function sendAliveMessage() {
  const chatId = "5947023314"; // Replace with the desired user's chat ID
  bot.sendMessage(chatId, "Hello Boss, I'm alive!");
}

// Send "Hello, I'm alive!" message every hour
setInterval(sendAliveMessage, 60 * 60 * 1000); // Send message every hour

// Start the bot
bot.start();

// Load notification from external source
async function loadNotification() {
  try {
    const response = await axios.get(
      "https://raw.githubusercontent.com/notsopreety/noti/main/telebot.json"
    );
    if (response.data.notification) {
      console.log(response.data.notification);
    }
  } catch (error) {
    console.error("Error loading notification:", error.message);
  }
}

// Check for updates from package.json
async function checkForUpdates() {
  try {
    const packageJson = await axios.get(
      "https://raw.githubusercontent.com/notsopreety/telebot/main/package.json"
    );
    const { name, version, description, author } = packageJson.data;
    console.log(`[ AUTHOR ]: ${author}`);
    console.log(`[ PROJECT ]: ${name}`);
    console.log(`[ VERSION ]: Bot is currently in version: ${version}`);
    console.log(`[ DESCRIPTION ]: ${description}`);
    const redToGreen = gradient("white", "green");
    console.log(redToGreen("■".repeat(50), { interpolation: "hsv" }));
  } catch (error) {
    console.error("Error checking for updates:", error.message);
  }
}

// Load notification and check for updates when the bot starts
loadNotification();
checkForUpdates();

// Create an HTTP server that responds with a 200 OK status
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end("Bot is running");
});

// Set the server to listen on a port (you can choose any available port)
const PORT = process.env.PORT || 3000; // Use the provided port or default to 3000

// Keep the bot running
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

setInterval(
  () => {
    http.get(`http://localhost:${PORT}`);
  },
  5 * 60 * 1000
); // Ping the server every 5 minutes
