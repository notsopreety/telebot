const axios = require('axios');

module.exports.config = {
    name: "gemini",
    description: "Interact with Gemini API",
    usage: "/gemini <your_query>",
    role: "user",
    usePrefix: true,
    aliases: ["bard"],
    author: "Samir Thakuri",
};

module.exports.run = async function ({ bot, args, chatId, userId }) {
    const query = args.join(" ");
    const apiKey = "samir";

    try {
        // Send pre-processing message
        const preMessage = await bot.sendMessage(chatId, "🔃 Responding...");

        // Make API request to Gemini
        const response = await axios.get(`https://samirapi.replit.app/gemini?query=${encodeURIComponent(query)}&chatid=${userId}&apikey=${apiKey}`);
        const geminiResponse = response.data;

        // Check if the response contains valid data
        if (geminiResponse && geminiResponse.response) {
            // Format the response
            const formattedResponse = geminiResponse.response.match(/```(\w+)\n([\s\S]+)```/) ?
                geminiResponse.response : "Gemini response:\n```\n" + geminiResponse.response + "\n```";

            // Send the formatted response
            bot.sendMessage(chatId, formattedResponse, { parseMode: 'Markdown' });
        } else {
            // Send a message if response data is not valid
            bot.sendMessage(chatId, "Failed to get a response from the Gemini service.");
        }

        // Delete pre-processing message
        bot.deleteMessage(chatId, preMessage.message_id);
    } catch (error) {
        console.error("Error:", error.message);
        bot.sendMessage(chatId, "An error occurred while processing your request. Please try again later.");
    }
};
