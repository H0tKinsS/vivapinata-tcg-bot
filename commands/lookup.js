const getCardFromName = require('../functions/utils/getCardFromName.js');
const getCardFromId = require('../functions/utils/getCardFromId.js');
const createImage = require('../functions/image/createImage.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, ComponentType, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder  } = require('discord.js');
const {Users, Cards, Guilds, Pinatas} = require('../utils/database.js');
const config = require('../config.json');
const getEmbedLookup = require('../functions/embed/getEmbedLookup.js');
module.exports = {
    cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('lookup')
		.setDescription('Przejrzyj informacje o piniacie')
		.addStringOption(option =>
			option.setName('nazwa')
				.setDescription('Wpisz nazwę do wyszukania')
				.setRequired(false)),
	async execute(interaction) {
		try {
			const cache = [];
			if (!interaction.options.getString('nazwa')) {
				const cardId = await require('../functions/user/getLastGrab.js')(interaction.user.id)?? null
				if (!cardId) return;
				const card = await getCardFromId(cardId);
				cache.push(await getCardFromName(card.card_name));
			} else {
				const pinatas = await Pinatas.findAll();
				pinatas.map((row) => row.dataValues);
				foundPinatas = [];
				for (const row of pinatas) {
					if (row.name.toLowerCase().includes(interaction.options.getString('nazwa').toLowerCase() ?? "")) {
						foundPinatas.push(`:black_medium_small_square: ${row.name} · \`Lv. ${row.lvl}\``);
						cache.push({...row.dataValues});
					}
				}
			}
			if (cache.length === 0) {
				return await interaction.reply({content: `Nie znaleziono piniaty`, ephemeral: true});
			}
			if (cache.length === 1) {
				const card = await getCardFromName(cache[0].name);
				const imageBuffer = await createImage(card);
				const embed = await getEmbedLookup(card)
				await interaction.reply({
					embeds: [embed],
					files: [{
						attachment: imageBuffer,
						name: 'image.png'
					}]});
			} else {
				const pageSize = config.collection.lines_per_page;
        const totalPages = Math.ceil(foundPinatas.length / pageSize);
        let currentPage = 1;
        const displayCollection = (pageIndex) => {
					const startIndex = (pageIndex - 1) * pageSize;
					const endIndex = Math.min(startIndex + pageSize, foundPinatas.length);

					const pageContent = foundPinatas.slice(startIndex, endIndex).join('\n');
					return pageContent;
				}
				const getPagePinatas = (pageIndex) => {
					const startIndex = (pageIndex - 1) * pageSize;
					const endIndex = Math.min(startIndex + pageSize, foundPinatas.length);

					const pageContent = cache.slice(startIndex, endIndex);
					return pageContent;
				}
        const initialPageContent = displayCollection(currentPage);

        const embed = new EmbedBuilder()
          .setColor('#0099FF')
          .setTitle(`Wyszukiwanie piniaty`)
          .setFooter({
            text: `Wyświetlanie ${((currentPage-1)*pageSize)+1} - ${((currentPage)*pageSize)} z ${foundPinatas.length} piniat`,
          })

          if (initialPageContent.trim().length > 0) {
            embed.setDescription(`Znalezione piniaty\n\n${initialPageContent}`)
          } else {
            embed.setDescription(`Nie znaleziono piniaty`);
          }

        let nextPage = new ButtonBuilder()
          .setCustomId('next')
          .setLabel('Następna')
          .setStyle(ButtonStyle.Secondary);
        let lastPage = new ButtonBuilder()
          .setCustomId('last')
          .setLabel('Ostatnia')
          .setStyle(ButtonStyle.Secondary);
    
        let prevPage = new ButtonBuilder()
          .setCustomId('prev')
          .setDisabled(true)
          .setLabel('Poprzednia')
          .setStyle(ButtonStyle.Secondary);

        let firstPage = new ButtonBuilder()
        .setDisabled(true)
        .setCustomId('first')
        .setLabel('Pierwsza')
        .setStyle(ButtonStyle.Secondary);

				const cardSelect = new StringSelectMenuBuilder()
				.setCustomId('piniata')
				.setPlaceholder('Wybierz piniatę')
	
				const options = []
				const currentPageCache = await getPagePinatas(currentPage);
				for (const card of currentPageCache) {
						const selection = new StringSelectMenuOptionBuilder()
              .setLabel(card.name)
              .setValue(card.name)
						options.push(selection);
				}
				cardSelect.addOptions(options);

        const isLastPage = currentPage === totalPages;
        const isFirstPage = currentPage === 1;
        const isSinglePage = totalPages === 1;
        
        lastPage.setDisabled(isLastPage || isSinglePage);
        nextPage.setDisabled(isLastPage || isSinglePage);
        firstPage.setDisabled(isFirstPage || isSinglePage);
        prevPage.setDisabled(isFirstPage || isSinglePage);
        const row = new ActionRowBuilder()
          .addComponents(firstPage, prevPage, nextPage, lastPage);
				const selectMenuRow = new ActionRowBuilder()
				.addComponents(cardSelect);

        const message = await interaction.reply({
          embeds: [embed],
          components: [row, selectMenuRow]
        })

        const menuCollector = message.createMessageComponentCollector({ componentType: ComponentType.StringSelect, time: 30_000 });

				menuCollector.on('collect',async i => {
					const newcard = await getCardFromName(i.values[0]);
					newcard.condition = 4;
					const imageBuffer = await createImage(newcard);
					const embed = await getEmbedLookup(newcard);
					await i.update({
						embeds: [embed],
						components: [],
						files: [{
							attachment: imageBuffer,
							name: 'image.png'
						}]});
				})
        const collector = message.createMessageComponentCollector({ componentType: ComponentType.Button, time: 30_000 });
        collector.on('collect', i => {
          if (i.user.id === interaction.user.id) {
            const clickedButton = i.customId;
						if (clickedButton === 'prev') {
							if (currentPage > 1) {
								currentPage--;
							}
						}
						if (clickedButton === 'next') {
							if (currentPage < totalPages) {
								currentPage++;
							}
						}
						if (clickedButton === 'last') currentPage = totalPages;
						if (clickedButton === 'first') currentPage = 1;
            const isLastPage = currentPage === totalPages;
            const isFirstPage = currentPage === 1;
            const isSinglePage = totalPages === 1;
            
            lastPage.setDisabled(isLastPage || isSinglePage);
            nextPage.setDisabled(isLastPage || isSinglePage);
            firstPage.setDisabled(isFirstPage || isSinglePage);
            prevPage.setDisabled(isFirstPage || isSinglePage);
            const updatedPageContent = displayCollection(currentPage);
            
						const updatedCurrentPageCache = getPagePinatas(currentPage);
						
						const updatedcardSelect = new StringSelectMenuBuilder()
						.setCustomId('piniata')
						.setPlaceholder('Wybierz piniatę')
			
						const updatedoptions = []
						const updatedcurrentPageCache = getPagePinatas(currentPage);
						for (const card of updatedcurrentPageCache) {
								const selection = new StringSelectMenuOptionBuilder()
									.setLabel(card.name)
									.setValue(card.name)
								updatedoptions.push(selection);
						}
						updatedcardSelect.addOptions(updatedoptions);
		

						const updatedselectMenuRow = new ActionRowBuilder()
						.addComponents(updatedcardSelect);
            let updatedRow = new ActionRowBuilder()
              .addComponents(firstPage, prevPage, nextPage, lastPage);

            if (updatedPageContent.trim().length > 0) {
              embed
							.setDescription(`Znalezione piniaty\n\n${updatedPageContent}`)
              .setFooter({ text: `Wyświetlanie ${((currentPage-1)*pageSize)+1} - ${((currentPage)*pageSize)} z ${foundPinatas.length} piniat`,});
            } else {
              embed.setDescription(`Brak piniat`);
            }
            
            i.update({
              embeds: [embed],
              components: [updatedRow, updatedselectMenuRow]
            });
          }
				});
			};
		} catch (error) {
			console.log(error);
		}
	}
};