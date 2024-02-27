// commands/wiki.js

const axios = require('axios');

module.exports.config = {
    name: "wiki",
    description: "Get information about a topic from Wikipedia",
    usage: "/wiki <word>",
    role: "user", // 0: All users
    usePrefix: true,
    aliases: ["wikipedia"],
    author: "Samir Thakuri",
};

module.exports.run = async function ({ bot, args, chatId }) {
    // Check if a word is provided
  if (!args[0]) {
      bot.sendMessage(chatId, `⚠️ Please provide a term.\n💡 Usage: ${this.config.usage}`);
      return;
  } else {
        try {
            const word = args.join(' ');

            // Get information from Wikipedia
            const res = await getWiki(word);

            if (res === undefined || res.title === undefined) {
                throw new Error(`API RETURNED THIS: ${res}`);
            }

            // Format and send the information
            const txtWiki = `
🔎 You searched for the word '${res.title}'\n\n Description: ${res.description}\n\n Info: ${res.extract}`;

            bot.sendMessage(chatId, txtWiki);
        } catch (err) {
            bot.sendMessage(chatId, err.message);
        }
    }
};

async function getWiki(q) {
    try {
        const response = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${q}`);
        return response.data;
    } catch (error) {
        return error;
    }
}
