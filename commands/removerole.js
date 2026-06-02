const fs = require("fs");
const { PermissionsBitField } = require("discord.js");

module.exports = {
  name: "removerole",

  execute(message) {

    if (
      !message.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    ) {
      return message.reply("❌ Admin only.");
    }

    const role = message.mentions.roles.first();

    if (!role) {
      return message.reply(
        "Usage: $removerole @role"
      );
    }

    const shop = JSON.parse(
      fs.readFileSync("./data/shop.json", "utf8")
    );

    shop.roles = shop.roles.filter(
      r => r.roleId !== role.id
    );

    fs.writeFileSync(
      "./data/shop.json",
      JSON.stringify(shop, null, 2)
    );

    message.reply(
      `✅ Removed ${role.name} from the store.`
    );
  }
};
