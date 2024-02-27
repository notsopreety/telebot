// commands/imagine.js

const { Hercai } = require('hercai');

const herc = new Hercai();

module.exports.config = {
    name: "imagine",
    description: "Generate an image based on a prompt",
    usage: "/imagine <prompt> [model]\nAvailable Models:\nv1, c2, v2-beta, v3, lexica, prodia, simurg, animefy, raava, shonin.",
    aliases: ["image"],
    role: "user", // 0: All users
    usePrefix: true,
    author: "Samir Thakuri",
};
/* "v1" , "v2" , "v2-beta" , "v3" (DALL-E) , "lexica" , "prodia", "simurg", "animefy", "raava", "shonin" */

module.exports.run = async function ({ bot, args, chatId }) {
    // Check if a prompt is provided
    if (!args[0]) {
        bot.sendMessage(chatId, `⚠️ Please provide a prompt.\n💡 Usage: ${this.config.usage}`);
        return;
    }

    // Extract the prompt and optional model from arguments
    const [prompt, model] = args.join(" ").split("|").map(item => item.trim());

    // Send a pre-processing message
    const preMessage = await bot.sendMessage(chatId, "Generating image...");

    try {
        // Generate an image using Hercai
        const response = await herc.drawImage({ model: model || "v3", prompt });

        // Send the generated image along with the response
        await bot.sendPhoto(chatId, response.url, { caption: `Here's Your Image!` });

        // Delete the pre-processing message
        await bot.deleteMessage(chatId, preMessage.message_id);
    } catch (error) {
        console.error("AI Error:", error);
        bot.sendMessage(chatId, "Failed to generate the image. Please try again later.");
        // Delete the pre-processing message if an error occurs
        await bot.deleteMessage(chatId, preMessage.message_id);
    }
};
