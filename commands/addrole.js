const fs = require("fs");
const { PermissionsBitField } = require("discord.js");

module.exports = {
  name: "addrole",

  execute(message, users, args) {

    if (
      !message.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    ) {
      return message.reply("❌ Admin only.");
    }

    const price = parseInt(args[0]);
const stock = parseInt(args[1]);
    const role = message.mentions.roles.first();

    if (!price || !role) {
      return message.reply(
        "Usage: $addrole <price> @role"
      );
    }

    const shop = JSON.parse(
      fs.readFileSync("./data/shop.json", "utf8")
    );

    shop.roles.push({
      name: role.name,
      price,
      roleId: role.id
    });

    fs.writeFileSync(
      "./data/shop.json",
      JSON.stringify(shop, null, 2)
    );

    message.reply(
      `✅ Added ${role.name} for ${price} points.`
    );
  }
};
