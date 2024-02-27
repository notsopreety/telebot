const axios = require('axios');

module.exports.config = {
    name: "tempmail",
    version: "1.0",
    role: "user",
    author: "Samir Thakuri",
    description: "Create temporary email and check inbox messages",
    aliases: ["temporarymail"],
};

module.exports.run = async ({ bot, args, chatId, userId }) => {
    try {
        if (!args[0]) {
            bot.sendMessage(chatId, "❌ Please specify 'inbox' or 'create' as the first argument.");
            return;
        }

        const command = args[0].toLowerCase();

        if (command === 'inbox') {
            const emailAddress = args[1];
            if (!emailAddress) {
                bot.sendMessage(chatId, "Please provide an email address for the inbox.", userId);
                return;
            }

            const inboxResponse = await axios.get(`https://api-turtle.onrender.com/api/premium/mail/${emailAddress}`);
            const messages = inboxResponse.data;

            if (!messages || messages.length === 0) {
                bot.sendMessage(chatId, `No messages found for ${emailAddress}.`, userId);
                return;
            }

            let messageText = '📬 Inbox Messages: 📬\n\n';
            for (const message of messages) {
                messageText += `📧 Sender: ${message.from}\n`;
                messageText += `📑 Subject: ${message.subject || 'Empty'}\n`;
                messageText += `📩 Message: ${message.body}\n`;
            }

            bot.sendMessage(chatId, messageText);
        } else if (command === 'create') {
            const tempMailResponse = await axios.get("https://api-turtle.onrender.com/api/premium/mail/create");
            const tempMailData = tempMailResponse.data;

            if (!tempMailData.email) {
                bot.sendMessage(chatId, " Failed to generate temporary email.", userId);
                return;
            }

            bot.sendMessage(chatId, `📩 Here's your generated temporary email: ${tempMailData.email}`);
        } else {
            bot.sendMessage(chatId, "Please specify 'inbox' or 'create'.", userId);
        }
    } catch (error) {
        console.error('Error:', error);
        bot.sendMessage(chatId, "An error occurred.", userId);
    }
};
