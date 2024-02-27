const axios = require("axios");
const fs = require("fs-extra");
const ytdl = require("ytdl-core");
const yts = require("yt-search");
const path = require("path");

module.exports.config = {
    name: "sing",
    aliases: ['music', 'sing', 'play'],
    role: "user",
    author: "Samir Thakuri",
    description: "Download music from YouTube",
    usage: "/sing <MusicName>",
};

module.exports.run = async function ({ bot, chatId, userId, args }) {
    const musicName = args.join(" ");
    
    if (!musicName) {
        return bot.sendMessage(chatId, "Please specify a music name.");
    }

    try {
        const searchMessage = await bot.sendMessage(chatId, `✅ | Searching music for "${musicName}".\⏳ | Please wait...`);

        const searchResults = await yts(musicName);
        if (!searchResults.videos.length) {
            await bot.deleteMessage(searchMessage.message_id); // Unsend the searching message
            return bot.sendMessage(chatId, "No music found.");
        }

        const music = searchResults.videos[0];
        const musicUrl = music.url;

        const stream = ytdl(musicUrl, { filter: "audioonly" });

        const fileName = `ytmusic.mp3`;
        const filePath = path.join(fileName);

        stream.pipe(fs.createWriteStream(filePath));

        stream.on('response', () => {
            console.info('[DOWNLOADER]', 'Starting download now!');
        });

        stream.on('info', (info) => {
            console.info('[DOWNLOADER]', `Downloading music: ${info.videoDetails.title}`);
        });

        stream.on('end', async () => {
            console.info('[DOWNLOADER] Downloaded');

            if (fs.statSync(filePath).size > 104857600) {
                fs.unlinkSync(filePath);
                return bot.sendMessage('❌ | The file could not be sent because it is larger than 100MB.', chatId);
            }

            const caption = `💁‍♀️ | Here's your music\n\n🔮 | Title: ${music.title}\n⏰ | Duration: ${music.duration.timestamp}`;

            await bot.sendAudio(chatId, filePath, { caption }); // Sending the voice message with filepath
            await bot.deleteMessage(searchMessage.message_id); // Unsend the searching message
        });
    } catch (error) {
        console.error('[ERROR]', error);
        bot.sendMessage(chatId, '🥺 | An error occurred while processing the command.');
    }
};
