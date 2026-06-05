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

  const shop = JSON.parse(
    fs.readFileSync("./data/shop.json", "utf8")
  );

  const users = JSON.parse(
    fs.readFileSync("./data/users.json", "utf8")
  );

  const item = shop.roles.find(
    r => r.roleId === roleId
  );

  const role = interaction.guild.roles.cache.get(roleId);

  if (!item || !role) {
    return interaction.reply({
      content: "❌ Role not found.",
      ephemeral: true
    });
  }

  if (!users[interaction.user.id]) {
    users[interaction.user.id] = {
      points: 0,
      messages: 0,
      vcMinutes: 0
    };
  }

  const user = users[interaction.user.id];

  if (item.stock <= 0) {
    return interaction.reply({
      content: "❌ Out of stock.",
      ephemeral: true
    });
  }

  if (interaction.member.roles.cache.has(roleId)) {
    return interaction.reply({
      content: "❌ You already own this role.",
      ephemeral: true
    });
  }

  if (user.points < item.price) {
    return interaction.reply({
      content: `❌ You need ${item.price} points.`,
      ephemeral: true
    });
  }

  user.points -= item.price;
  item.stock--;

  fs.writeFileSync(
    "./data/users.json",
    JSON.stringify(users, null, 2)
  );

  fs.writeFileSync(
    "./data/shop.json",
    JSON.stringify(shop, null, 2)
  );

  try {

    await interaction.member.roles.add(role);

    const embed = new EmbedBuilder()
      .setTitle("✅ Purchase Successful")
      .setDescription(
        `🎭 Role: ${role.name}\n💰 Cost: ${item.price}\n📦 Stock Left: ${item.stock}`
      )
      .setTimestamp();

    await interaction.reply({
      embeds: [embed],
      ephemeral: true
    });

  } catch {

    await interaction.reply({
      content: "❌ I couldn't give that role.",
      ephemeral: true
    });

  }
}
  });

};
