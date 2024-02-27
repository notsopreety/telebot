const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports.config = {
    name: "say",
    aliases: ['tts'],
    author: "Samir Thakuri",
    role: "user",
    description: "Bot will make your text into voice.",
    usage: "{pn} your text (default will be -bn)| {pn} your text -[use two words ISO 639-1 code , ex : English-en, Nepali-ne, Bangla-bn, Hindi-hi or more, search Google for your language code]",
};

module.exports.run = async function ({ bot, args, chatId, userId, event }) {
    const p = "/";

    const langRegex = /^-[a-zA-Z]{2}$/;
    const lang = args && args.length > 0 && langRegex.test(args[args.length - 1]) ? args.pop().substring(1) : 'en';
    const text = args && args.length > 0 ? args.join(" ") : '';

    if (!text) {
        bot.sendMessage(chatId, `Please provide some text 🫵\n\nExample:\n${p}say hi there \nOr\n${p}say hi there -en \n\n(two-digit lang code to change the voice language model ex : en, ne, vi , ja etc)`, userId);
        return;
    }

    const filePath = path.join('ytmusic.mp3');
    const urlPrefix = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${lang}&client=tw-ob&q=`;

    try {
        if (text.length <= 150) {
            const response = await axios({
                method: "get",
                url: `${urlPrefix}${encodeURIComponent(text)}`,
                responseType: "stream"
            });

            const writer = fs.createWriteStream(filePath);
            response.data.pipe(writer);
            writer.on("finish", () => {
                bot.sendVoice(chatId, fs.createReadStream(filePath), {}, userId, () => fs.unlinkSync(filePath));
            });
        } else {
            bot.sendMessage(chatId, "The provided text is too long. Please provide text with fewer characters.", userId);
        }
    } catch (error) {
        console.error(error);
        bot.sendMessage(chatId, "An error occurred while processing the text to voice.", userId);
    }
};
