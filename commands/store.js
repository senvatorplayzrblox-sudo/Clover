const emoji = require("../config/emojis");
const fs = require("fs");
const {
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder
} = require("discord.js");

module.exports = {
  name: "store",

 async execute(message) {

    const shop = JSON.parse(
      fs.readFileSync("./data/shop.json", "utf8")
    );
    const guildId = message.guild.id;

if (!shop[guildId]) {
  shop[guildId] = {
    roles: []
  };
}

    if (!shop[guildId].roles.length) {

  const embed = new EmbedBuilder()
    .setTitle(`${emoji.store} Clover Store`) 
    .setDescription("Store is currently empty.")
    .setFooter({
      text: "Clover Economy Store"
    })
    .setTimestamp();

  const reply = await message.reply({
  embeds: [embed]
});

setTimeout(() => {
  reply.delete().catch(() => {});
}, 15000);

return;

}

    let description = "";

shop[guildId].roles.forEach((role, index) => {
  description +=
    `${index + 1}. ${emoji.role} ${role.name}\n` +
    `${emoji.point} ${role.price} points\n` +
    `${emoji.stock} Stock: ${role.stock}\n\n`;
});

const embed = new EmbedBuilder()
  .setTitle(`${emoji.store} Clover Store`)
  .setDescription(description)
      .setFooter({
        text: "Clover Economy Store"
      })
      .setTimestamp();

    const menu = new StringSelectMenuBuilder()
      .setCustomId("store_select")
      .setPlaceholder("🍀 Select a role");

    shop[guildId].roles.forEach(role => {
      menu.addOptions({
        label: role.name,
        description: `${role.price} points | Stock: ${role.stock}`,
        value: role.roleId
      });
    });

    const row = new ActionRowBuilder()
      .addComponents(menu);

    message.reply({
      embeds: [embed],
      components: [row]
    });
  }
};
