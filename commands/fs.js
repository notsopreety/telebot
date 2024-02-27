// commands/fs.js
const fs = require('fs');
const path = require('path');

module.exports.config = {
    name: "fs",
    description: "Send the source code of a command",
    usage: "/fs <command>",
    role: "admin", // Allow all users to execute
    usePrefix: true,
    aliases: ["filesend"],
    author: "Samir Thakuri",
};

module.exports.run = async function ({ bot, args, chatId }) {
    // Extract the command name from the arguments
    const input = args[0];

    // Get the path to the commands directory
    const commandsPath = path.join(__dirname, '.');

    // Try to find the command file based on name or aliases
    const commandFile = findCommandFile(commandsPath, input);

    if (commandFile) {
        // Read the source code of the specified command file
        try {
            const sourceCode = fs.readFileSync(commandFile, 'utf-8');

            // Send the source code as a text message
            bot.sendMessage(chatId, `\`\`\`javascript\n${sourceCode}\n\`\`\``, { parseMode: 'Markdown' });
        } catch (error) {
            console.error(error);
            bot.sendMessage(chatId, `Error retrieving the source code for "${input}".`);
        }
    } else {
        // Send a message indicating that the command does not exist
        bot.sendMessage(chatId, `Command "${input}" does not exist.`);
    }
};

// Function to find the command file based on name or aliases
function findCommandFile(commandsPath, input) {
    const files = fs.readdirSync(commandsPath);

    // Look for the command file based on name or aliases
    for (const file of files) {
        const command = require(path.join(commandsPath, file));

        if (
            file.replace(/\.[^/.]+$/, '') === input ||  // Check file name
            command.config.name === input ||            // Check command name
            (command.config.aliases && command.config.aliases.includes(input)) // Check aliases
        ) {
            return path.join(commandsPath, file);
        }
    }

    return null;
}