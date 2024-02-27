// commands/gpt.js
const ChatGPT = require('./../lib/chatGPT'); // Adjust the path accordingly

module.exports.config = {
    name: "gpt",
    description: "Chat with GPT",
    usage: "/gpt <question>",
    aliases: ["chatgpt"],
    role: "user", // 0: All users
    usePrefix: true,
    author: "Samir Thakuri",
};

module.exports.run = async function ({ bot, args, chatId }) {
    const question = args.join(' ');

    if (!question) {
        bot.sendMessage(chatId, `⚠️ Please provide a question.\n💡 Usage: ${this.config.usage}`);
        return;
    }

    // Send a pre-processing message
    const preMessage = await bot.sendMessage(chatId, "Processing your question...");

    try {
        const response = await ChatGPT(question);

        // Format the response using Markdown
        const formattedResponse = `ChatGPT:\n\`\`\`\n${response}\n\`\`\``;

        bot.sendMessage(chatId, formattedResponse, { parseMode: 'Markdown' });
    } catch (error) {
        console.error(error.message);
        bot.sendMessage(chatId, "⚠️ An error occurred while interacting with GPT.");
    } finally {
        // Delete the pre-processing message
        bot.deleteMessage(chatId, preMessage.message_id);
    }
};
