// commands/help.js

const { readdirSync } = require('fs');

module.exports.config = {
    name: "help",
    description: "Display help information",
    usage: "/help [command]",
    aliases: ["h", "start"],
    role: "user",
    usePrefix: true,
    author: "Samir Thakuri",
};

module.exports.run = async function ({ bot, args, chatId, userId }) {
    const commandList = readdirSync(__dirname).filter(file => file.endsWith('.js') && file !== 'help.js').map(file => file.slice(0, -3));

    if (args.length === 0) {
        const commandListText = commandList.map((command, index) => `${index + 1}. ${command}`).join('\n');
        const helpMessage = `━━━━━━━━━━━━━\n${commandListText}\n━━━━━━━━━━━━━\nPage [ 1/1 ]\nCurrently, the bot has ${commandList.length} commands that can be used\n» Type !help <page> to view the command list\n» Type !help <command> to view the details of that command\n━━━━━━━━━━━━━\n[ 🐉 | Yukai ]`;

        bot.sendMessage(chatId, helpMessage);
    } else {
        const commandName = args[0].toLowerCase();
        const commandFile = commandList.find(command => command.toLowerCase() === commandName);

        if (commandFile) {
            const command = require(`./${commandFile}.js`);
            const detailsMessage = `━━━━━━━━━━━━━\n${command.config.name}\n━━━━━━━━━━━━━\n» Description: ${command.config.description}\n» Other names: ${command.config.aliases.join(', ')}\n» Version: ${command.config.version || "Not specified"}\n» Permission: ${command.config.role === 0 ? "All users" : (command.config.role === 1 ? "Group admins" : "Bot admin")}\n» Time per command: ${command.config.cooldowns || "Not specified"} seconds\n» Author: ${command.config.author}\n━━━  ❖  ━━━\n» Usage guide:\n${command.config.usage}\n━━━  ❖  ━━━\n»
» Notes:
• The content inside <XXXXX> can be changed
• The content inside [a|b|c] is a or b or c`;

            bot.sendMessage(chatId, detailsMessage);
        } else {
            bot.sendMessage(chatId, 'Command not found. Use /help to see the list of available commands.');
        }
    }
};
