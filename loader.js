const fs = require('fs-extra');
const path = require('path');
const gradient = require('gradient-string');

const loadCommands = (bot, commandsPath, prefix, adminId, logger) => {
    try {
        const files = fs.readdirSync(commandsPath);
        files.forEach(file => {
            try {
                const command = require(path.join(commandsPath, file));

                const commandTriggers = [command.config.name.toLowerCase(), ...command.config.aliases.map(alias => alias.toLowerCase())];

                bot.on(commandTriggers.map(trigger => prefix + trigger), (msg) => {
                    const chatId = msg.chat.id;
                    const userId = msg.from.id;
                    const isAdmin = adminId.includes(userId.toString().toLowerCase());

                    // Log command information
                    const logMessage = `[ COMMAND ]: ${file}`;
                    logger(logMessage, 'green', false);

                    // Check if the command exists
                    if (typeof command.run !== 'function') {
                        bot.sendMessage(chatId, `Command "${prefix}${command.config.name}" does not exist.`);
                        return;
                    }

                    // Check command role and execute if allowed
                    if (command.config.role === 'user' || (command.config.role === 'admin' && isAdmin)) {
                        // Execute the command
                        command.run({ bot, args: msg.text.split(' ').slice(1), chatId, userId, isAdmin });
                    } else {
                        bot.sendMessage(chatId, 'You do not have permission to use this command.');
                    }
                });
                logger(`[ COMMAND ]: ${file}`, 'green', false);
            } catch (error) {
                logger(`[ COMMAND ]: ${file} - Error: ${error.message}`, 'red', false);
            }
        });
        logger(gradient("white", "green")("■".repeat(50), { interpolation: "hsv" }), '', false);
    } catch (error) {
        logger(`Error loading commands: ${error.message}`, 'red', true);
    }
};

const loadEvents = (bot, eventsPath, logger) => {
    try {
        const files = fs.readdirSync(eventsPath);
        files.forEach(file => {
            try {
                const event = require(path.join(eventsPath, file));
                // Call the event function with the bot instance
                event(bot);
                logger(`[ EVENT ]: Successfully loaded event: ${file}`, 'yellow', false);
            } catch (error) {
                logger(`[ EVENT ]: ${file} - Error: ${error.message}`, 'red', false);
            }
        });
        logger(gradient("white", "green")("■".repeat(50), { interpolation: "hsv" }), '', false);
    } catch (error) {
        logger(`Error loading events: ${error.message}`, 'red', true);
    }
};

module.exports = { loadCommands, loadEvents };
