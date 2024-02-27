const fs = require("fs");
const axios = require("axios");

module.exports.config = {
    name: "anipic",
    aliases: ["animepic"],
    author: "Samir Thakuri",
    role: "user",
    description: "get a random anime picture",
    usage: "/anipic",
};

module.exports.run = async function ({ bot, chatId, userId }) {
    const path = "pixart.png";

    // Send a pre-processing message
    const preMessage = await bot.sendMessage(chatId, "Fetching a random anime picture...");

    try {
        const response = await axios.get("https://pic.re/image", { responseType: "stream" });

        if (response.data) {
            const imageResponse = response.data;
            imageResponse.pipe(fs.createWriteStream(path));

            imageResponse.on("end", () => {
                // Send the photo after fetching
                bot.sendPhoto(chatId, fs.createReadStream(path), {}, userId, () => {
                    // Once sent, remove the temporary file
                    fs.unlinkSync(path);
                    // Delete the pre-processing message
                    bot.deleteMessage(chatId, preMessage.message_id);
                });
            });
        } else {
            // If failed to fetch, send a message and delete the pre-processing message
            bot.sendMessage(chatId, "Failed to fetch random anime picture. Please try again.", userId);
            bot.deleteMessage(chatId, preMessage.message_id);
        }
    } catch (error) {
        // If an error occurs, send the error message and delete the pre-processing message
        bot.sendMessage(chatId, error.message, userId);
        bot.deleteMessage(chatId, preMessage.message_id);
    }
};
