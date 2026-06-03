const fs = require("fs");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "store",

  execute(message) {

    const shop = JSON.parse(
      fs.readFileSync("./data/shop.json", "utf8")
    );

    if (!shop.roles.length) {
      return message.reply(
        "🛒 Store is empty."
      );
    }

    const embed = new EmbedBuilder()
      .setTitle("🛒 Clover Store");

    shop.roles.forEach((role, index) => {
      embed.addFields({
        name: `${index + 1}. ${role.name}`,
        value:
          `💰 Price: ${role.price} points\n📦 Stock: ${role.stock}`,
        inline: false
      });
    });

    embed
      .setFooter({
        text: "Clover Economy Store"
      })
      .setTimestamp();

    message.reply({
      embeds: [embed]
    });
  }
};
