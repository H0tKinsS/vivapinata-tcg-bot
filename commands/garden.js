const getCardFromName = require('../functions/utils/getCardFromName.js');
const getItemFromId = require('../functions/utils/getItemFromId.js');
const createImageGarden = require('../functions/image/createImageGarden.js');
const {SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const {AllItems, Cards} = require('../utils/database.js');
const getEmbedView = require('../functions/embed/getEmbedView.js');
const getEmbedViewInfo = require('../functions/embed/getEmbedViewInfo.js');
const getUser = require('../functions/user/getUser.js');
module.exports = {
    cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('garden')
		.setDescription('Ogród piniat')
		.addSubcommand(subcommand =>
			subcommand
        .setName('background')
        .setDescription('Edytuj tło ogrodu (puste, aby usunąć)')
        .addStringOption(option =>
          option.setName('tło')
            .setDescription('Podaj tło')
            .setRequired(false)))
		.addSubcommand(subcommand =>
			subcommand
        .setName('view')
        .setDescription('Obejrzyj ogród swój lub kogoś')
        .addUserOption(option =>
          option.setName('użytkownik')
            .setDescription('Podaj użytkownika')
            .setRequired(false)))
		.addSubcommand(subcommand =>
			subcommand
			  .setName('edit')
				.setDescription('Edytuj swój ogród')
				.addStringOption(option => 
					option.setName('slot')
					.setDescription('Podaj slot karty')
					.setRequired(true)
					.addChoices(
						{
							name: '1',
							value:'slot_1',
						},
						{
							name: '2',
							value:'slot_2',
						},
						{
							name: '3',
							value:'slot_3',
						},
						{
							name: '4',
							value:'slot_4',
						},
						{
							name: '5',
							value:'slot_5',
						},
						{
							name: '6',
							value:'slot_6',
						},
						{
							name: '7',
							value:'slot_7',
						}, 
						{
							name: '8',
							value:'slot_8',
						},
						{
							name: '9',
							value:'slot_9',
						},
						{
							name: '10',
							value:'slot_10',
						}))
				.addStringOption(option => option.setName('card').setDescription('Podaj id karty').setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('remove')
				.setDescription('Usuń kartę z ogrodu')
				.addStringOption(option => 
					option.setName('slot')
					.setDescription('Podaj slot karty')
					.setRequired(true)
					.addChoices(
						{
							name: '1',
							value:'slot_1',
						},
						{
							name: '2',
							value:'slot_2',
						},
						{
							name: '3',
							value:'slot_3',
						},
						{
							name: '4',
							value:'slot_4',
						},
						{
							name: '5',
							value:'slot_5',
						},
						{
							name: '6',
							value:'slot_6',
						},
						{
							name: '7',
							value:'slot_7',
						}, 
						{
							name: '8',
							value:'slot_8',
						},
						{
							name: '9',
							value:'slot_9',
						},
						{
							name: '10',
							value:'slot_10',
						}))),
	async execute(interaction) {
		try {
			const userOption = interaction.options.getUser('użytkownik');
			const userId = userOption ? userOption.id : interaction.user.id;
			const user = await getUser(userId);
			const garden = await user.getGarden();
			
		if (interaction.options.getSubcommand() === 'edit') {
			const slot = interaction.options.getString('slot');
			const cardId = interaction.options.getString('card');
			const card = await Cards.findOne({
				where: {
					card_id: cardId
			}})
			if (!card || card.card_owner !== interaction.user.id) {
				return await interaction.reply({content: `Nie znaleziono piniaty`, ephemeral: true});
			}
			const slots = [];
			for (let i = 1; i <= 10; i++) {
        const slotField = `slot_${i}`;
        slots.push(garden[slotField]);
    	}
			for (const slot of slots) {
					if (slot === cardId) {
							console.log(`Duplicate found`);
							// Add the promise for the update operation to the array
							return await interaction.reply({content: `Najpierw usuń piniatę z innej pozycji`, ephemeral: true});
					}
			}
			// Now, outside of the loop, update the garden with the new cardId
			await garden.update({ [slot]: cardId });
			return await interaction.reply({content: `Pomyślnie ustawiono piniatę \`${cardId}\``, ephemeral: true});
		} else if (interaction.options.getSubcommand() === 'view') {
			const cards = await garden.getCards();
			const imageBuffer = await createImageGarden(cards, userId, await garden.getBackgroundId());
			const embed = await require('../functions/embed/getEmbedGarden')(garden);
			await interaction.reply({
				embeds: [embed], 
				files: [{
						attachment: imageBuffer, 
						name: 'image.png' 
				}], 
		});
		} else if (interaction.options.getSubcommand() === 'remove') {
			const slot = interaction.options.getString('slot');
			await garden.update({[slot]: null})
			return await interaction.reply(`Pomyslnie usunieto kartę z danego slotu`)
		} else if (interaction.options.getSubcommand() === 'background') {
			const background = interaction.options.getString('tło');
			const oldBackground = garden.background;
			if (!background) {
				if (oldBackground) {
					await user.addItem(oldBackground, 1);
				}
				await garden.update({background: null});
        return await interaction.reply(`Pomyslnie usunieto tło ogrodu`);
			}
			if (!user.hasItem(background)) {
				await garden.update({background});
				return await interaction.reply(`Nie posiadasz danego tła!`);
			}
			const item = await AllItems.findOne({where: {item_id: background}})
			if (!item || !item.item_category === 'garden_background') {
				return await interaction.reply(`Musisz podać prawidłowe tło!`);
			}
			if (oldBackground === background) {
				return await interaction.reply(`Posiadasz już to tło!`);
			}
			const removed = await user.removeItem(background, 1);
			if (!removed) {
        return await interaction.reply(`Nie udało się ustawić tła!`);
      }
			if (oldBackground) {
				await user.addItem(oldBackground, 1)
			}
			await garden.update({background});
			return await interaction.reply(`Pomyślnie ustawiono tło \`${background}\``);
		}
	  }  catch (error) {
      console.log(error);
    }
  }
};