const { getItemFromId, getEmojiFromId } = require('../functions/utils/getItemFromId.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, ComponentType, EmbedBuilder  } = require('discord.js');
const config = require('../config.json');
const {Users, AllItems} = require('../utils/database.js');

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName('inventory')
    .setDescription('Ekwipunek gracza')
    .addUserOption(option => option.setName('gracz').setDescription('Gracz'))
    .addStringOption(option =>
      option
        .setName('kierunek')
        .setDescription('Kierunek sortowania')
        .setRequired(false)
        .addChoices(
          {
            name: 'Rosnąco',
            value: 'ASC'
          },
          {
            name: 'Malejąco',
            value: 'DESC'
          }
        ))
    .addStringOption(option =>
      option.setName('sortowanie')
        .setDescription('Sortuj przedmioty po')
        .setRequired(false)
        .addChoices(
          {
            name: 'Nazwa',
            value:'item_id'
          },
          {
            name: 'Ilość',
            value:'item_amount'
          }))
    .addStringOption(option =>
      option.setName('wyszukaj')
        .setDescription('Wyszukaj przedmiot')
        .setRequired(false)),
  async execute(interaction) {
    if (interaction.options.getUser('gracz') && interaction.options.getUser('gracz').bot) return;
		let mentionedUserId; // Default to the author's ID
    if (interaction.options.getUser('gracz')) {
      mentionedUserId = interaction.options.getUser('gracz').id;
    } else {
      mentionedUserId = interaction.user.id;
    }
    const sortCriteria = interaction.options.getString('sortowanie') ?? 'item_amount';
    const sortOrder = interaction.options.getString('kierunek') ?? 'DESC';
    try {
      // const cards = await Cards.findAll({
      //   where: {
      //     card_owner: mentionedUserId
      //   },
      //   order: [[sortCriteria, sortOrder]]
      // });
      const [user, created] = await Users.findOrCreate({
        where: {
          user_id: mentionedUserId
        },
      })
      const userItems = await user.getItems(sortCriteria, sortOrder)

      userItems.map((row) => row.dataValues);
      
      userCollection = [];
      for (const row of userItems) {
        if (row.item_id.includes(interaction.options.getString('wyszukaj') || "")) {
          const item = await AllItems.findOne({where: {item_id: row.item_id}})
          userCollection.push(`${item.item_emoji} \*\*${row.item_amount}\*\* · \`${row.item_id}\` · ${item.item_name}`);
        }
      }
        const pageSize = config.collection.lines_per_page;
        const totalPages = Math.ceil(userCollection.length / pageSize);
        let currentPage = 1;
        const displayCollection = (pageIndex) => {
          const startIndex = (pageIndex - 1) * pageSize;
          const endIndex = Math.min(startIndex + pageSize, userCollection.length);

          const pageContent = userCollection.slice(startIndex, endIndex).join('\n');
          return pageContent;
        };
        const initialPageContent = displayCollection(currentPage);

        const embed = new EmbedBuilder()
          .setColor('#0099FF')
          .setTitle(`Wyświetlanie ekwipunku`)
          .setFooter({
            text: `Wyświetlanie ${((currentPage-1)*pageSize)+1} - ${((currentPage)*pageSize)} z ${userCollection.length}`,
          })

          if (initialPageContent.trim().length > 0) {
            embed.setDescription(`Ekwipunek gracza <@${mentionedUserId}>\n\n${initialPageContent}`)
          } else {
            embed.setDescription(`Brak przedmiotów w ekwipunku`);
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

        const isLastPage = currentPage === totalPages;
        const isFirstPage = currentPage === 1;
        const isSinglePage = totalPages === 1;
        
        lastPage.setDisabled(isLastPage || isSinglePage);
        nextPage.setDisabled(isLastPage || isSinglePage);
        firstPage.setDisabled(isFirstPage || isSinglePage);
        prevPage.setDisabled(isFirstPage || isSinglePage);
        const row = new ActionRowBuilder()
          .addComponents(firstPage, prevPage, nextPage, lastPage);

        const message = await interaction.reply({
          embeds: [embed],
          components: [row]
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
            
            let updatedRow = new ActionRowBuilder()
              .addComponents(firstPage, prevPage, nextPage, lastPage);
            
            if (updatedPageContent.trim().length > 0) {
              embed.setDescription(`Ekwipunek gracza <@${mentionedUserId}>\n\n${updatedPageContent}`)
              .setFooter({
                text: `Wyświetlanie ${((currentPage-1)*pageSize)+1} - ${((currentPage)*pageSize)} z ${userCollection.length}`,
              });
            } else {
              embed.setDescription(`Brak przedmiotów w ekwipunku`);
            }
            
            i.update({
              embeds: [embed],
              components: [updatedRow]
            });
          }
        });
      } catch (error) {
        console.log(error);
      }
  }
}