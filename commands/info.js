// commands/info.js
const axios = require('axios');
const moment = require('moment-timezone');
const NepaliDate = require('nepali-date');
const fast = require('fast-speedtest-api');

module.exports.config = {
    name: "info",
    description: "Get Bot and Author info",
    usage: "/info",
    role: "user", // Allow all users to execute
    usePrefix: true,
    aliases: ["cinfo", "botinfo"],
    author: "Samir Thakuri",
};

module.exports.run = async function ({ bot, chatId }) {
    const speedTest = new fast({
        token: "YXNkZmFzZGxmbnNkYWZoYXNkZmhrYWxm",
        verbose: false,
        timeout: 10000,
        https: true,
        urlCount: 5,
        bufferSize: 8,
        unit: fast.UNITS.Mbps
    });
    const result = await speedTest.getSpeed();
    const botName = "Yukai Bot";
    const botPrefix = "/";
    const authorName = "Samir Thakuri";
    const authorID = "@samirxyz";
    const authorInsta = "https://instagram.com/@notsopreetyy";
    const facebook = "https://fb.me/dev.samir.xyz";
    const timeStart = Date.now();

    const urls = require('./../assets/info.json');
    const link = urls[Math.floor(Math.random() * urls.length)];

    // Get current date and time in Asia/Kathmandu timezone
    const now = moment().tz('Asia/Kathmandu');
    const date = now.format('MMMM Do YYYY');
    const time = now.format('h:mm:ss A');

    // Get Nepali date
    const nepaliDate = new NepaliDate(now.toDate());
    const bsDateStr = nepaliDate.format("dddd, DD MMMM");

    // Calculate bot uptime
    const uptime = process.uptime();
    const uptimeString = formatUptime(uptime);

    const ping = Date.now() - timeStart;

    const replyMessage = `===「 Bot & Author Info 」===
❏ Bot Name: ${botName}
❏ Bot Prefix: ${botPrefix}
❏ Author Name: ${authorName}
❏ Telegram: ${authorID}
❏ Instagram: ${authorInsta}
❏ Facebook: ${facebook}
❏ Date: ${date}
❏ BS Date: ${bsDateStr}
❏ Time: ${time}
❏ Bot Running: ${uptimeString}
❏ Bot's Speed: ${result} MBPS
=====================`;

    try {
        const response = await axios.get(link, { responseType: 'arraybuffer' });
        const photoBuffer = Buffer.from(response.data);
        bot.sendPhoto(chatId, photoBuffer, { caption: replyMessage });
    } catch (error) {
        console.error(error);
        bot.sendMessage(chatId, replyMessage);
    }
};

function formatUptime(uptime) {
    const seconds = Math.floor(uptime % 60);
    const minutes = Math.floor((uptime / 60) % 60);
    const hours = Math.floor((uptime / (60 * 60)) % 24);
    const days = Math.floor(uptime / (60 * 60 * 24));

    const uptimeString = [];
    if (days > 0) uptimeString.push(`${days}d`);
    if (hours > 0) uptimeString.push(`${hours}h`);
    if (minutes > 0) uptimeString.push(`${minutes}min`);
    if (seconds > 0) uptimeString.push(`${seconds}sec`);

    return uptimeString.join(" ");
}