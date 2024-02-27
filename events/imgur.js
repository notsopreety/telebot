const axios = require('axios');
const FormData = require('form-data');

async function uploadImageToImgur(url) {
    try {
        const clientId = "fc9369e9aea767c";
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        const formData = new FormData();
        formData.append('image', Buffer.from(response.data, 'binary'), { filename: 'image.png' });

        const imgurResponse = await axios.post('https://api.imgur.com/3/image', formData, {
            headers: {
                Authorization: `Client-ID ${clientId}`, // Make sure to set your own IMGUR_CLIENT_ID
                ...formData.getHeaders(),
            },
        });

        return imgurResponse.data.data.link;
    } catch (error) {
        throw error;
    }
}

module.exports = (bot) => {
    bot.on('photo', async (msg) => {
        const chatId = msg.chat.id;
        const photoIds = msg.photo.map((photo) => photo.file_id);
        const successLinks = [];
        let failedCount = 0;

        try {
            for (const photoId of photoIds) {
                try {
                    const fileInfo = await bot.getFile(photoId);
                    const fileUrl = `https://api.telegram.org/file/bot${bot.token}/${fileInfo.file_path}`;
                    const imgurUrl = await uploadImageToImgur(fileUrl);
                    successLinks.push(imgurUrl);
                } catch (error) {
                    console.error('Error uploading image to Imgur:', error);
                    failedCount++;
                }
            }

            const successCount = photoIds.length - failedCount;
            const message = `» Uploaded ${successCount} images successfully\nFailed: ${failedCount}\n» Image Links:\n${successLinks.join("\n")}`;
            bot.sendMessage(chatId, message);
        } catch (error) {
            console.error('Error processing images:', error);
            bot.sendMessage(chatId, 'An error occurred while processing the images.');
        }
    });
};
