const axios = require('axios');

module.exports.config = {
    name: "ss",
    description: "Take a real-time screenshot of a website",
    usage: "/screenshot <url>",
    aliases: ["webshot"],
    role: "user", // 0: All users
    usePrefix: true,
    author: "Your Name",
};

module.exports.run = async function ({ bot, args, chatId }) {
    const apiUrl = "http://api.screenshotlayer.com/api/capture";
    const accessKey = "JB9FIP8PjhQCwjdZbsnkZ22Bxh0CWJVm"; // Replace with your actual access key

    const url = args[0];

    if (!url) {
        bot.sendMessage(chatId, "⚠️ Please provide a URL.\n💡 Usage: /screenshot <url>");
        return;
    }

    try {
        const response = await axios.get(apiUrl, {
            params: {
                access_key: accessKey,
                url: url,
                viewport: "1440x900", // Adjust the viewport size as needed
                format: "PNG", // You can choose other formats like JPG, GIF, etc.
            },
            responseType: 'arraybuffer',
        });

        // Send the screenshot as a photo
        bot.sendPhoto(chatId, Buffer.from(response.data, 'binary'));
    } catch (error) {
        console.error(error.message);
        bot.sendMessage(chatId, "⚠️ An error occurred while taking the screenshot.");
    }
};
