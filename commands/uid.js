// commands/uid.js

module.exports.config = {
    name: "uid",
    description: "Get your Telegram user ID",
    usage: "/uid",
    aliases: ["myid"],
    role: "user", // 0: All users
    usePrefix: true,
    author: "Samir Thakuri",
};

module.exports.run = async function ({ bot, chatId, userId }) {
    // Send the user's ID as a message
    bot.sendMessage(chatId, `Your Telegram user ID is: ${userId}`);
};
