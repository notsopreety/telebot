module.exports.config = {
    name: "profilepic",
    description: "Get your own Telegram profile picture",
    usage: "/profilepic",
    aliases: ["mypic"],
    role: "user", // 0: All users
    usePrefix: true,
    author: "Your Name",
};

module.exports.run = async function ({ bot, args, chatId, message, userId }) {

    try {
        const userProfilePhotos = await bot.getUserProfilePhotos(userId, { limit: 1 });

        if (userProfilePhotos.total_count > 0) {
            const photoId = userProfilePhotos.photos[0][0].file_id;
            
            // Get file information
            const fileInfo = await bot.getFile(photoId);

            // Construct the file link manually
            const fileLink = `https://api.telegram.org/file/bot${bot.token}/${fileInfo.file_path}`;
            
            // Send the user's profile picture
            bot.sendPhoto(chatId, fileLink);
        } else {
            bot.sendMessage(chatId, "⚠️ Unable to retrieve your profile picture. Make sure you have set a profile picture in Telegram.");
        }
    } catch (error) {
        console.error(error.message);
        bot.sendMessage(chatId, "⚠️ An error occurred while fetching your profile picture.");
    }
};