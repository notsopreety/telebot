const fetch = require('node-fetch');

// Function to fetch image as buffer
async function fetchImageBuffer(url) {
    const response = await fetch(url);
    const buffer = await response.buffer();
    return buffer;
}

module.exports.config = {
    name: "lyrics",
    version: "1.0",
    author: "SiAM/WALEX",
    aliases: ["ly"],
    description: "Get lyrics for a song",
    role: "user",
    usuage: "/lyrics [song name]",
};

module.exports.run = async function ({ bot, args, chatId }) {
    const songName = args.join(" ");
    if (!songName) {
        bot.sendMessage(chatId, 'Please specify the name of the song you want to find lyrics for.');
        return;
    }

    try {
        const res = await fetch(`https://lyrist.vercel.app/api/${encodeURIComponent(songName)}`);
        const data = await res.json();

        if (data.lyrics) {
            const title = data.title;
            const artist = data.artist;
            const lyrics = data.lyrics;
            const imageUrl = data.image;

            // Fetch image buffer
            const imageBuffer = await fetchImageBuffer(imageUrl);

            const reply = `
❏ Title: ${title}
❏ Artist: ${artist}
❏ Lyrics:
${lyrics}
            `;

            // Send message with image buffer
            bot.sendPhoto(chatId, imageBuffer, { caption: reply });
        } else {
            bot.sendMessage(chatId, "Lyrics not found for that song.");
        }
    } catch (error) {
        console.error(error);
        bot.sendMessage(chatId, "An error occurred while fetching lyrics.");
    }
};
