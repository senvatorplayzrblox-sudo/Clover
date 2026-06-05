const fs = require("fs");
const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

module.exports.execute = (client) => {

  client.on("interactionCreate", async (interaction) => {

    // DROPDOWN
    if (interaction.isStringSelectMenu()) {

      if (interaction.customId !== "store_select") return;

      const roleId = interaction.values[0];

      const shop = JSON.parse(
        fs.readFileSync("./data/shop.json", "utf8")
      );

      const item = shop.roles.find(
        r => r.roleId === roleId
      );

      if (!item) return;

      const embed = new EmbedBuilder()
        .setTitle("🛒 Role Preview")
        .setDescription(
          `🎭 Role: ${item.name}\n💰 Price: ${item.price}\n📦 Stock: ${item.stock}`
        );

      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId(`buy_${roleId}`)
            .setLabel("Buy")
            .setStyle(ButtonStyle.Success)
        );

      return interaction.reply({
        embeds: [embed],
        components: [row],
        ephemeral: true
      });
    }

    // BUY BUTTON
    if (interaction.isButton()) {

      if (!interaction.customId.startsWith("buy_")) return;

      const roleId = interaction.customId.replace("buy_", "");

      await interaction.reply({
        content:
          `🌿 Use:\n\`$buy <@&${roleId}>\`\n\nto purchase this role.`,
        ephemeral: true
      });
    }

  });

};
