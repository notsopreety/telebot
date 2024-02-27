const axios = require('axios');

module.exports.config = {
    name: "dictionary",
    aliases: ["dic"],
    version: "1.0",
    author: "Samir / Walex",
    role: "user",
    description: "Get definitions of words",
    usage: "meaning of words e.g /dic word",
};

module.exports.run = async function ({ bot, args, chatId }) {
    if (args[0]) {
        try {
            const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(args.join(" ").trim().toLowerCase())}`);
            const data = response.data[0];
            const meanings = data.meanings;
            let msg_meanings = "";
            meanings.forEach(items => {
                const partOfSpeech = items.partOfSpeech;
                const definition = items.definitions[0].definition.charAt(0).toUpperCase() + items.definitions[0].definition.slice(1);
                const example = items.definitions[0].example ? `\n*Example:* "${items.definitions[0].example[0].toUpperCase() + items.definitions[0].example.slice(1)}"` : '';
                msg_meanings += `\n• ${partOfSpeech}\n ${definition}${example}`;
            });
            const phonetics = data.phonetics;
            let msg_phonetics = '';
            phonetics.forEach(items => {
                const text = items.text ? `\n    /${items.text}/` : '';
                msg_phonetics += text;
            });
            const msg = `❰ ❝ ${data.word} ❞ ❱` +
                        `${msg_phonetics}` +
                        `${msg_meanings}`;
            bot.sendMessage(chatId, msg);
        } catch (error) {
            if (error.response && error.response.status === 404) {
                bot.sendMessage(chatId, 'No Definitions Found');
            } else {
                console.error(error);
                bot.sendMessage(chatId, 'An error occurred while fetching definitions.');
            }
        }
    } else {
        bot.sendMessage(chatId, 'Missing input!');
    }
};