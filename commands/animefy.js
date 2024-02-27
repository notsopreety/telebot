const axios = require('axios');
const fs = require('fs');

module.exports.config = {
    name: "animefy",
    description: "Convert any image to anime",
    aliases: ["drawever"],
    role: "user",
    usePrefix: true,
    author: "Samir Thakuri",
};

// Map to store user image data
const userImageMap = new Map();

// Function to process the image and upload
async function processImageAndUpload(buffer) {
    try {
        const base64String = Buffer.from(buffer, 'binary').toString('base64');

        const apiResponse = await axios.post('https://www.drawever.com/api/photo-to-anime', {
            data: `data:image/png;base64,${base64String}`,
        }, {
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
            },
        });

        const processedImageUrl = 'https://www.drawever.com' + (apiResponse.data.urls[1] || apiResponse.data.urls[0]);

        return processedImageUrl;
    } catch (error) {
        throw error;
    }
}

module.exports.run = async function ({ bot, args, chatId, userId }) {
    // Check if user has already provided an image
    if (!userImageMap.has(userId)) {
        userImageMap.set(userId, false);
    }

    if (userImageMap.get(userId)) {
        bot.sendMessage(chatId, "You have already provided an image. Please wait while it's being processed.");
        return;
    }

    // Send a message requesting image input
    const preMessage = await bot.sendMessage(chatId, "Send image to convert into anime");

    // Set up a listener for image messages
    bot.on('photo', async (msg) => {
        try {
            // Check if the message is from the same user and there's no previous image input
            if (msg.from.id !== userId || userImageMap.get(userId)) {
                return;
            }

            // Retrieve the photo file ID
            const photoId = msg.photo[0].file_id;

            // Fetch the photo file by ID and download its content
            const response = await bot.getFile(photoId);
            const photoBuffer = await axios.get(response.fileLink, {
                responseType: 'arraybuffer',
            }).then(res => Buffer.from(res.data));

            // Process the image and upload
            bot.deleteMessage(chatId, preMessage.message_id);
            const processingMessage = await bot.sendMessage(chatId, "Converting your image, please wait...");

            const processedImageUrl = await processImageAndUpload(photoBuffer);

            // Fetch anime image data with original size
            const imgResponse = await axios.get(processedImageUrl, { responseType: "arraybuffer" });

            // Send the animefied image as a reply
            bot.deleteMessage(chatId, processingMessage.message_id);
            await bot.sendDocument(chatId, imgResponse.data, { fileName: "anime_image.png" });

            // Set user image state to true
            userImageMap.set(userId, true);
        } catch (error) {
            console.error("Error processing image:", error);
            bot.sendMessage(chatId, "Failed to convert image. Please try again later.");
        }
    });
};
