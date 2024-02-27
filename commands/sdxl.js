const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
    name: "sdxl",
    aliases: ["stabledefussion"],
    author: "Samir Thakuri",
    role: "user",
    description: "Generate an image with SDXL API.",
    usage: "/sdxl [prompt]",
};

module.exports.run = async function ({ bot, args, chatId }) {
    const url = "https://sdxl.replit.app";
    const f = path.join('pixart.png');

    const prompt = args.join(" ");
    if (!prompt) {
        bot.sendMessage(chatId, "Please provide a prompt for the SDXL image generation.");
        return;
    }

    // Send a pre-processing message
    const preMessage = await bot.sendMessage(chatId, "Generating SDXL image...");

    try {
        const response = await axios.get(`${url}/samir?prompt=${encodeURIComponent(prompt)}`, { responseType: 'arraybuffer' });
        const imageData = response.data;
        fs.writeFileSync(f, Buffer.from(imageData, "utf8"));
        // Send the image as an attachment
        bot.sendPhoto(chatId, fs.createReadStream(f, () => fs.unlinkSync(f)), { caption: `SDXL image generated based on: ${prompt}` });
    } catch (error) {
        console.error(error);
        sendMessage("An error occurred while generating the image.");
    } finally {
        // Delete the pre-processing message
        bot.deleteMessage(chatId, preMessage.message_id);
    }
};
