const axios = require('axios');

module.exports.config = {
    name: "llama",
    aliases: ["llamabot"],
    version: "1.0",
    author: "Samir Thakuri",
    role: "user",
    description: "Ask the llama bot a question",
    usage: "/llama [prompt]",
};

module.exports.run = async function ({ bot, args, chatId }) {
    const prompt = args.join(" ");

    if (!prompt) {
        bot.sendMessage(chatId, "Please provide a prompt.");
        return;
    }

    // Send a pre-processing message
    const preMessage = await bot.sendMessage(chatId, "Generating response...");

    try {
        const response = await axios.get(`https://replicateai.replit.app/llama70b?prompt=${encodeURIComponent(prompt)}`);
        const responseData = response.data;

        const botResponse = responseData.response;

        // Send the bot response
        bot.sendMessage(chatId, botResponse);
    } catch (error) {
        console.error(error);
        bot.sendMessage(chatId, "An error occurred while generating response.");
    } finally {
        // Delete the pre-processing message
        bot.deleteMessage(chatId, preMessage.message_id);
    }
};
