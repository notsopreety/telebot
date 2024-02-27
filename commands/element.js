// commands/periodic.js

const axios = require('axios');

module.exports.config = {
    name: "periodic",
    description: "Get information about an element from the periodic table",
    usage: "/periodic <element>",
    aliases: ["element"],
    role: "user", // 0: All users
    usePrefix: true,
    author: "Samir Thakuri",
};

module.exports.run = async function ({ bot, args, chatId }) {
    const element = args[0];

    if (!element) {
        bot.sendMessage(chatId, `⚠️ Please provide the name or symbol of the element.\n💡 Usage: ${this.config.usage}`);
        return;
    }

    try {
        const response = await axios.get(`https://api.popcat.xyz/periodic-table?element=${element}`);
        const elementInfo = response.data;

        const messageBody = `🧪 Element Information\n\nName: ${elementInfo.name}\nSymbol: ${elementInfo.symbol}\nAtomic Number: ${elementInfo.atomic_number}\nAtomic Mass: ${elementInfo.atomic_mass}\nPeriod: ${elementInfo.period}\nPhase: ${elementInfo.phase}\nDiscovered By: ${elementInfo.discovered_by}\nSummary: ${elementInfo.summary}`;

        // Send the image along with the text
        bot.sendPhoto(chatId, elementInfo.image, { caption: messageBody });
    } catch (error) {
        console.error(error);
        bot.sendMessage(chatId, "⚠️ An error occurred while fetching element information.");
    }
};
