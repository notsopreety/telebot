const { exec } = require('child_process');

module.exports.config = {
    name: "shell",
    aliases: ["shellcmd"],
    author: "Samir",
    role: "admin",
    description: "Execute shell commands",
    usePrefix: true,
    usage: "/shell [command]",
};

module.exports.run = async function ({ bot, args, chatId }) {
    const command = args.join(" ");

    if (!command) {
        bot.sendMessage(chatId, "Please provide a command to execute.");
        return;
    }

    // Send a pre-processing message
    const preMessage = await bot.sendMessage(chatId, "⏰| Executing command...");

    exec(command, (error, stdout, stderr) => {
        // Delete the pre-processing message
        bot.deleteMessage(chatId, preMessage.message_id);

        if (error) {
            console.error(`Error executing command: ${error}`);
            bot.sendMessage(chatId, `An error occurred while executing the command: ${error.message}`);
            return;
        }

        if (stderr) {
            console.error(`Command execution resulted in an error: ${stderr}`);
            bot.sendMessage(chatId, `Command execution resulted in an error: ${stderr}`);
            return;
        }

        console.log(`✅| Command executed successfully:\n${stdout}`);
        bot.sendMessage(chatId, `Command executed successfully:\n${stdout}`);
    });
};
