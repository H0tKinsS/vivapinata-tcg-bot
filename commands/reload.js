const { SlashCommandBuilder } = require('discord.js');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reload')
        .setDescription('Reloads a command.')
        .addStringOption(option =>
            option.setName('command')
                .setDescription('The command to reload.')
                .setRequired(true)),
    async execute(interaction) {
        const commandName = interaction.options.getString('command', true).toLowerCase();

        // Get the path to the command file
        const commandPath = path.join(__dirname, `./${commandName}.js`);

        // Check if the command exists
        if (!interaction.client.commands.has(commandName)) {
            return interaction.reply(`There is no command with name \`${commandName}\`!`);
        }

        try {
            // Delete the cache for the command file
            delete require.cache[require.resolve(commandPath)];

            // Reload the command
            const newCommand = require(commandPath);
            interaction.client.commands.set(newCommand.data.name, newCommand);

            await interaction.reply(`Command \`${newCommand.data.name}\` was reloaded!`);
        } catch (error) {
            console.error(error);
            await interaction.reply(`There was an error while reloading a command \`${commandName}\`:\n\`${error.message}\``);
        }
    },
};
