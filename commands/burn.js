const getCardFromName = require('../functions/utils/getCardFromName.js');
const createImage = require('../functions/image/createImage.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, ComponentType, EmbedBuilder  } = require('discord.js');
const cards = require('../pinatas');
const config = require('../config.json');
const { Users, Cards, AllItems, Items} = require('../utils/database.js');
const getEmbedDestroy = require('../functions/embed/getEmbedDestroy.js');
const getEmbedDestroyed = require('../functions/embed/getEmbedDestroyed.js');

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName('destroy')
    .setDescription('Zniszcz piniatę')
    .addStringOption(option =>
      option.setName('id')
        .setDescription('ID piniaty')
        .setRequired(false)),
  async execute(interaction) {
    try {
      let cardId = interaction.options.getString('id') ?? await require('../functions/user/getLastGrab.js')(interaction.user.id) ?? null;
      if (cardId) {
        const [user, created] = await Users.findOrCreate({
          where: {
            user_id: interaction.user.id
          }});
        const card = await Cards.findOne({
          where: {
            card_id: cardId,
            card_owner: interaction.user.id
          }
        })
        if (!card || !card.card_owner || !card.card_grabber) {
          return await interaction.reply({content: `Nie znaleziono piniaty`, ephemeral: true});
        }
        if (user && card) {
          let tempcard = await getCardFromName(card.card_name)
          tempcard.condition = card.card_condition;
          const imageBuffer = await createImage(tempcard);

          const base = 10;
          const levelPrice = ((base/3) * (tempcard.lvl +1));
          const conditionPrice = (base/2) * card.card_condition; 

          const coins = Math.floor((base*card.card_condition) + levelPrice + conditionPrice);

          const embed = await getEmbedDestroy(card, coins);

          const row = new ActionRowBuilder()
          const yesButton = new ButtonBuilder().setCustomId('yes').setLabel('Tak').setStyle(ButtonStyle.Danger).setDisabled(false)
          row.addComponents(yesButton);
          const message = await interaction.reply({
              content: `Czy chcesz zniszczyć piniatę?`,
              embeds: [embed],
              files: [{
                  attachment: imageBuffer,
                  name: 'image.png'
              }],
              components: [row]
          });
          const collectorFilter = i => i.user.id === interaction.user.id;
          try {
            await message.awaitMessageComponent({ filter: collectorFilter, max: 1, time: 20000 })
            .then(async (i) => {
              if (i.customId == 'yes') {
                await card.setOwner(null);
                await user.addItem('coins', coins);
                const newEmbed = await getEmbedDestroyed(card, coins);
                await i.update({
                  content: `Zniszczono piniatę za \`${coins}🏵️\``,
                  embeds: [newEmbed],
                  components: [],
                });
              }
            })
          } catch (err) {
            console.log(err);
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
}