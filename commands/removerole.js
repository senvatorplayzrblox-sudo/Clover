const fs = require("fs");
const {
PermissionsBitField,
EmbedBuilder
} = require("discord.js");

module.exports = {
name: "removerole",

execute(message) {

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

if (!role) {
  return message.reply({
    embeds: [
      new EmbedBuilder()
        .setTitle("❌ Invalid Usage")
        .setDescription(
          "Usage: `$removerole @role`"
        )
    ]
  });
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

const embed = new EmbedBuilder()
  .setTitle("✅ Role Removed")
  .setDescription(
    `🎭 Role: ${role.name}\n🗑️ Removed from store`
  )
  .setFooter({
    text: "Clover Store Setup"
  })
  .setTimestamp();

message.reply({
  embeds: [embed]
});

}
};
