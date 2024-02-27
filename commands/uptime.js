// commands/uptime.js

module.exports.config = {
    name: "uptime",
    description: "Display bot system uptime",
    usage: "/uptime",
    role: "user", // 0: All users
    usePrefix: true,
    aliases: ["upt", "alive"],
    author: "Samir Thakuri",
};

module.exports.run = function ({ bot, chatId }) {
    const uptimeInSeconds = process.uptime();
    const formattedUptime = formatUptime(uptimeInSeconds);

    bot.sendMessage(chatId, `🤖 Bot Uptime: ${formattedUptime}`);
};

// Function to format uptime in a user-friendly way
function formatUptime(uptimeInSeconds) {
    const hours = Math.floor(uptimeInSeconds / 3600);
    const minutes = Math.floor((uptimeInSeconds % 3600) / 60);
    const seconds = Math.floor(uptimeInSeconds % 60);

    return `${hours}h ${minutes}m ${seconds}s`;
}