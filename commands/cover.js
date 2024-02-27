const axios = require('axios');
const jimp = require("jimp");
const fs = require("fs");

module.exports.config = {
    name: "cover",
    description: "Create your own cover image",
    usage: "/cover charactername | name | subname | fbusername",
    role: "user", // Allow all users to execute
    usePrefix: true,
    aliases: ["coverfb"],
    author: "Samir Thakuri",
};

module.exports.run = async function ({ bot, args, chatId }) {
    const info = args.join(" ");

    if (!info) {
        bot.sendMessage(chatId, `Please enter in the format:\n/cover charactername | name | subname | fbusername`);
    } else {
        const msg = info.split("|");
        const id = msg[0];
        const name = msg[1];
        const subname = msg[2];
        const username = msg[3];

        if (isNaN(id)) {
            // If input is not a number
            const id1 = await getIdFromApi(id);
            if (!id1) {
                bot.sendMessage(chatId, "Character not found, please check the name and try again...");
                return;
            }

            // Send a pre-processing message
            const preMessage = await bot.sendMessage(chatId, "Generating your cover...");

            const img = `https://www.nguyenmanh.name.vn/api/avtWibu2?id=${id1}&tenchinh=${name}&fb=${username}&tenphu=${subname}&apikey=CF9unN3H`;
            const caption = `Here's your cover✨`;
            await sendPhotoWithCaption(bot, chatId, img, caption);

            // Delete the pre-processing message
            bot.deleteMessage(chatId, preMessage.message_id);
        } else {
            // Send a pre-processing message
            const preMessage = await bot.sendMessage(chatId, "Generating your cover...");

            const img = `https://www.nguyenmanh.name.vn/api/avtWibu2?id=${id}&tenchinh=${name}&fb=${username}&tenphu=${subname}&apikey=CF9unN3H`;
            const caption = `Here's Your cover✨`;
            await sendPhotoWithCaption(bot, chatId, img, caption);

            // Delete the pre-processing message
            bot.deleteMessage(chatId, preMessage.message_id);
        }
    }
};

async function getIdFromApi(name) {
    try {
        const response = await axios.get(`https://www.nguyenmanh.name.vn/api/searchAvt?key=${name}`);
        return response.data.result.ID;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function sendPhotoWithCaption(bot, chatId, img, caption) {
    const response = await axios.get(img, { responseType: 'arraybuffer' });
    const photoBuffer = Buffer.from(response.data);
    await bot.sendPhoto(chatId, photoBuffer, { caption });
}