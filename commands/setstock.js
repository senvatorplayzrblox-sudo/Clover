const fs = require("fs");
const {
  PermissionsBitField,
  EmbedBuilder
} = require("discord.js");

module.exports = {
  name: "setstock",

  execute(message, users, args) {

    if (
      !message.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    ) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("❌ Permission Denied")
            .setDescription("Admin only.")
        ]
      });
    }

    const role = message.mentions.roles.first();
    const stock = parseInt(args[1]);

    if (!role || isNaN(stock)) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("❌ Invalid Usage")
            .setDescription(
              "Usage: `$setstock @role <stock>`"
            )
        ]
      });
    }

    const shop = JSON.parse(
      fs.readFileSync("./data/shop.json", "utf8")
    );
    const guildId = message.guild.id;

if (!shop[guildId]) {
  shop[guildId] = {
    roles: []
  };
}

    const item = shop.roles.find(
      r => r.roleId === role.id
    );

    if (!item) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("❌ Error")
            .setDescription("Role not found in store.")
        ]
      });
    }

    item.stock = stock;

    fs.writeFileSync(
      "./data/shop.json",
      JSON.stringify(shop, null, 2)
    );

    message.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("✅ Stock Updated")
          .setDescription(
            `🎭 ${role.name}\n📦 New Stock: ${stock}`
          )
      ]
    });
  }
};
