const fs = require("fs");
const {
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder
} = require("discord.js");

module.exports = {
  name: "store",

  execute(message) {

    const shop = JSON.parse(
      fs.readFileSync("./data/shop.json", "utf8")
    );
    const guildId = message.guild.id;

if (!shop[guildId]) {
  shop[guildId] = {
    roles: []
  };
}

    if (!shop.roles.length) {
      return message.reply("🛒 Store is empty.");
    }

    let description = "";

shop.roles.forEach((role, index) => {
  description +=
    `${index + 1}. 🎭 ${role.name}\n` +
    `💰 ${role.price} points\n` +
    `📦 Stock: ${role.stock}\n\n`;
});

const embed = new EmbedBuilder()
  .setTitle("🛒 Clover Store")
  .setDescription(description)
      .setFooter({
        text: "Clover Economy Store"
      })
      .setTimestamp();

    const menu = new StringSelectMenuBuilder()
      .setCustomId("store_select")
      .setPlaceholder("🌿 Select a role");

    shop.roles.forEach(role => {
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
