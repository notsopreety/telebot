// commands/github.js

const axios = require('axios');
const moment = require('moment');

module.exports.config = {
    name: "github",
    description: "Get information about a GitHub user",
    usage: "/github <username>",
    aliases: ["gitstalk"],
    role: "user", // 0: All users
    usePrefix: true,
    author: "Samir Thakuri",
};

module.exports.run = async function ({ bot, args, chatId }) {
    const username = args[0];

    if (!username) {
        bot.sendMessage(chatId, `⚠️ Please provide a GitHub username.\n💡 Usage: ${this.config.usage}`);
        return;
    }

    try {
        const response = await axios.get(`https://api.github.com/users/${username}`);
        const userInfo = response.data;

        const info = `=== [ 𝗜𝗡𝗙𝗢 𝗚𝗜𝗧𝗛𝗨𝗕 ] ===\n━━━━━━━━━━━━\n\n📛 𝗡𝗮𝗺𝗲: ${userInfo.name || "Not Available"}\n👤 𝗨𝘀𝗲𝗿𝗻𝗮𝗺𝗲: ${userInfo.login}\n🔰 𝗜𝗗: ${userInfo.id}\n💬 𝗕𝗶𝗼: ${userInfo.bio || "No Bio"}\n🔓 𝗣𝘂𝗯𝗹𝗶𝗰 𝗥𝗲𝗽𝗼𝘀𝗶𝘁𝗼𝗿𝗶𝗲𝘀: ${userInfo.public_repos || "None"}\n🎀 𝗙𝗼𝗹𝗹𝗼𝘄𝗲𝗿𝘀: ${userInfo.followers}\n🔖 𝗙𝗼𝗹𝗹𝗼𝘄𝗶𝗻𝗴: ${userInfo.following}\n🏢 𝗖𝗼𝗺𝗽𝗮𝗻𝘆: ${userInfo.company || "Not Found"}\n📧 𝗘𝗺𝗮𝗶𝗹: ${userInfo.email}\n🔗 𝗕𝗹𝗼𝗴: ${userInfo.blog || "Not Found!"}\n🕊 𝗧𝘄𝗶𝘁𝘁𝗲𝗿 𝗨𝘀𝗲𝗿𝗻𝗮𝗺𝗲: ${userInfo.twitter_username || "null"}\n🌎 𝗟𝗼𝗰𝗮𝘁𝗶𝗼𝗻: ${userInfo.location || "No Location"}\n📌 𝗔𝗰𝗰𝗼𝘂𝗻𝘁 𝗖𝗿𝗲𝗮𝘁𝗲𝗱: ${moment.utc(userInfo.created_at).format("dddd, MMMM, Do YYYY")}\n♻ 𝗔𝗰𝗰𝗼𝘂𝗻𝘁 𝗨𝗽𝗱𝗮𝘁𝗲𝗱: ${moment.utc(userInfo.updated_at).format("dddd, MMMM, Do YYYY")}`;

        // Send the avatar along with the text
        bot.sendPhoto(chatId, userInfo.avatar_url, { caption: info });
    } catch (error) {
        console.error(error);
        bot.sendMessage(chatId, "⚠️ An error occurred while fetching GitHub user information.");
    }
};
