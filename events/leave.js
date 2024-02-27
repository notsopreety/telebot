const path = require("path");

module.exports = (bot) => {
    bot.on('leftChatMember', async (msg) => {
        const leftMember = msg.left_chat_member;
        const chatId = msg.chat.id;

        // Check if the member left voluntarily or was kicked
        if (msg.from.id === leftMember.id) {
            // Member left voluntarily
            const leaveMessages = [
                `Oh no! ${leftMember.username ? `@${leftMember.username}` : leftMember.first_name} slipped on a banana peel and fell out of the group. 🍌👋`,
                `Farewell, ${leftMember.username ? `@${leftMember.username}` : leftMember.first_name}! Remember, you'll always be a part of our group in spirit. 👻`,
                `Goodbye, ${leftMember.username ? `@${leftMember.username}` : leftMember.first_name}! We hope your departure isn't permanent. 💔`,
                `Looks like ${leftMember.username ? `@${leftMember.username}` : leftMember.first_name} decided to take the scenic route out of the group. 🌅👋`,
                `Sayonara, ${leftMember.username ? `@${leftMember.username}` : leftMember.first_name}! Remember, life is a journey, not a destination. 🚶‍♂️👋`,
                `Adios, ${leftMember.username ? `@${leftMember.username}` : leftMember.first_name}! We'll miss your delightful presence in the group. 🥲👋`,
                `And then there was silence... Farewell, ${leftMember.username ? `@${leftMember.username}` : leftMember.first_name}. 👋😢`,
                `Goodbye, ${leftMember.username ? `@${leftMember.username}` : leftMember.first_name}! Don't forget to leave a trail of breadcrumbs so you can find your way back. 🍞👋`,
                `Until we meet again, ${leftMember.username ? `@${leftMember.username}` : leftMember.first_name}. May your journey be filled with laughter and joy! 😊👋`,
                `Oh dear, ${leftMember.username ? `@${leftMember.username}` : leftMember.first_name} has left the building! Farewell, and may the odds be ever in your favor. 🏃‍♂️👋`
            ];
            const randomLeaveMessage = leaveMessages[Math.floor(Math.random() * leaveMessages.length)];
            bot.sendAnimation(chatId, path.join(__dirname, '..', 'assets', 'leave.gif'), { caption: randomLeaveMessage, reply_markup: { remove_keyboard: true } });
        } else {
            // Member was kicked by admin
            const kickedBy = msg.from;
            const kickMessages = [
                `Looks like ${kickedBy.username ? `@${kickedBy.username}` : kickedBy.first_name} gave ${leftMember.username ? `@${leftMember.username}` : leftMember.first_name} the boot! 😡👢`,
                `Adios, ${leftMember.username ? `@${leftMember.username}` : leftMember.first_name}! Looks like ${kickedBy.username ? `@${kickedBy.username}` : kickedBy.first_name} wasn't messing around. 🤨👢`,
                `Bye bye, ${leftMember.username ? `@${leftMember.username}` : leftMember.first_name}! Bet you didn't see that kick coming! 🦵😜`,
                `And ${kickedBy.username ? `@${kickedBy.username}` : kickedBy.first_name} said, "You're outta here!" 👋👢`,
                `Looks like ${kickedBy.username ? `@${kickedBy.username}` : kickedBy.first_name} decided it was time for ${leftMember.username ? `@${leftMember.username}` : leftMember.first_name} to hit the road. 🚪👢`,
                `So long, ${leftMember.username ? `@${leftMember.username}` : leftMember.first_name}! Looks like ${kickedBy.username ? `@${kickedBy.username}` : kickedBy.first_name} had other plans. 🎯👢`,
                `Goodbye, ${leftMember.username ? `@${leftMember.username}` : leftMember.first_name}! ${kickedBy.username ? `@${kickedBy.username}` : kickedBy.first_name} just hit you with the ejector seat. 💺👢`,
                `Aww, ${leftMember.username ? `@${leftMember.username}` : leftMember.first_name} got kicked out by ${kickedBy.username ? `@${kickedBy.username}` : kickedBy.first_name}. Better luck next time! 🍀👢`,
                `And then there was one less... Goodbye, ${leftMember.username ? `@${leftMember.username}` : leftMember.first_name}. Hope you enjoyed your flying lessons! ✈️👋`,
                `So long, farewell, auf wiedersehen, goodbye! That's what ${kickedBy.username ? `@${kickedBy.username}` : kickedBy.first_name} said to ${leftMember.username ? `@${leftMember.username}` : leftMember.first_name}. 🎶👢`
            ];
            const randomKickMessage = kickMessages[Math.floor(Math.random() * kickMessages.length)];
            bot.sendAnimation(chatId, path.join(__dirname, '..', 'assets', 'leave.gif'), { caption: randomKickMessage, reply_markup: { remove_keyboard: true } });
        }
    });
};
