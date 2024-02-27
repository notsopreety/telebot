// commands/ask.js

const { Hercai } = require('hercai');

const herc = new Hercai();

module.exports.config = {
    name: "ask",
    description: "Ask a question and get a response",
    usage: "/ask <your_question>",
    role: "user", // 0: All users
    usePrefix: true,
    aliases: ["herc"],
    author: "Samir Thakuri",
};

module.exports.run = async function ({ bot, args, chatId, msg }) {
    // Check if a question is provided
    if (!args[0]) {
        bot.sendMessage(chatId, `⚠️ Please provide a prompt.\n💡 Usage: ${this.config.usage}`, { asReply: true });
        return;
    }

    const question = args.join(" ");

    // Send a pre-processing message
    const preMessage = await bot.sendMessage(chatId, "💭 | Thinking...");

    try {
        // Ask a question using Hercai
        const response = await herc.question({ model: "v3", content: question });

        // Detect code format and include in a code block
        const formattedResponse = response.reply.match(/```(\w+)\n([\s\S]+)```/) ?
            response.reply : "Yukai says:\n```\n" + response.reply + "\n```";

        bot.sendMessage(chatId, formattedResponse, { parseMode: 'Markdown' });
    } catch (error) {
        console.error("Yukai Error:", error);
        bot.sendMessage(chatId, "Failed to process the question. Please try again later.");
    } finally {
        // Delete the pre-processing message
        bot.deleteMessage(chatId, preMessage.message_id);
    }
};
