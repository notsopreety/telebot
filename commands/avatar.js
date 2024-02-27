// commands/avatar.js
const axios = require('axios');
const jimp = require("jimp");
const fs = require("fs");

module.exports.config = {
    name: "avatar",
    description: "Create your own avatar image",
    usage: "/avatar charactername | name | signature",
    role: "user", // Allow all users to execute
    usePrefix: true,
    aliases: ["avt"],
    author: "Samir Thakuri",
};


module.exports.run = async function ({ bot, args, chatId }) {
    const info = args.join(" ");

    if (!info) {
        bot.sendMessage(chatId, `Please enter in the format:\n/avatar  charactername | name | signature`);
    } else {
        const msg = info.split("|");
        const id = msg[0];
        const name = msg[1];
        const juswa = msg[2];

        if (isNaN(id)) {
            // If input is not a number
            const id1 = await getIdFromApi(id);
            if (!id1) {
                bot.sendMessage(chatId, "Character not found, please check the name and try again...");
                return;
            }

            const img = `https://www.nguyenmanh.name.vn/api/avtWibu3?id=${id1}&tenchinh=${name}&tenphu=${juswa}&apikey=CF9unN3H`;
            const caption = `Here's your avatars✨`;
            await sendPhotoWithCaption(bot, chatId, img, caption);
        } else {
            const img = `https://www.nguyenmanh.name.vn/api/avtWibu3?id=${id}&tenchinh=${name}&tenphu=${juswa}&apikey=CF9unN3H`;
            const caption = `Here's Your avatar`;
            await sendPhotoWithCaption(bot, chatId, img, caption);
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