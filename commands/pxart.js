const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
    name: "pxart",
    aliases: ["pxart"],
    author: "Samir Thakuri",
    role: "user",
    description: "Generate a image",
    usage: "/pxart [prompt] | [style]",
};

module.exports.run = async function ({ bot, args, chatId }) {
    const url = "https://ai-tools.replit.app";
    const f = path.join('pixart.png');

    // Send a pre-processing message
    const preMessage = await bot.sendMessage(chatId, "Generating image...");

    function sendMessage(message) {
        bot.sendMessage(chatId, message);
    }

    const styleList = `•——[Style list]——•\n\n1. Cinematic\n2. Photographic\n3. Anime\n4. Manga\n5. Digital Art\n6. Pixel art\n7. Fantasy art\n8. Neonpunk\n9. 3D Model`;

    if (!args[0]) {
        sendMessage('Missing prompt and style\n\n' + styleList);
        return;
    }

    let [prompt, style] = args.join(" ").split("|").map(item => item.trim());

    if (!prompt) {
        sendMessage('Missing prompt!');
        return;
    }

    // Set default style to "2" (Photographic) if no style is provided
    if (!style) {
        style = "2";
    }

    try {
        const response = await axios.get(`${url}/pixart?prompt=${encodeURIComponent(prompt)}&styles=${encodeURIComponent(style)}`, { responseType: 'arraybuffer' });
        const imageData = response.data;
        fs.writeFileSync(f, Buffer.from(imageData, "utf8"));
        // Send the image as an attachment
        bot.sendPhoto(chatId, fs.createReadStream(f, () => fs.unlinkSync(f)));
    } catch (error) {
        console.error(error);
        sendMessage("An error occurred while generating the image.");
    } finally {
        // Delete the pre-processing message
        bot.deleteMessage(chatId, preMessage.message_id);
    }
};
