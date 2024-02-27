// commands/gfx.js
const axios = require('axios');

module.exports.config = {
    name: "gfx4",
    description: "Generate a GFX image with two given texts",
    usage: "/gfx4 <text1>|<text2>",
    role: "user", // Allow all users to execute
    usePrefix: true,
    aliases: ["gfx4"],
    author: "Samir Thakuri",
};

module.exports.run = async function ({ bot, args, chatId }) {
    // Check if two texts are provided
    const texts = args.join(" ").split("|");
    if (texts.length !== 2) {
        bot.sendMessage(chatId, "Please provide two texts separated by '|'.");
        return;
    }

    const [text1, text2] = texts;

    // Send a pre-processing message
    const preMessage = await bot.sendMessage(chatId, "Generating GFX image...");

    try {
        // Fetch GFX image from the API
        const apiUrl = `https://tanjiro-api.onrender.com/gfx4?text=${encodeURIComponent(text1)}&text2=${encodeURIComponent(text2)}&api_key=tanjiro`;
        const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });

        // Convert the response to a Buffer
        const gfxBuffer = Buffer.from(response.data);

        // Send the GFX image as a photo along with a text message
        bot.sendPhoto(chatId, gfxBuffer, { caption: "Here's Your GFX IMG" });
    } catch (error) {
        console.error(error);
        bot.sendMessage(chatId, "An error occurred while generating the GFX image.");
    } finally {
        // Delete the pre-processing message
        bot.deleteMessage(chatId, preMessage.message_id);
    }
};