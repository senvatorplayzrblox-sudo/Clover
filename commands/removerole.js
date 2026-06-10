const emoji = require("../config/emojis");
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
        .setTitle(`${emoji.error} Permission Denied`)
        .setDescription("Admin only.")
    ]
  });
}

const role = message.mentions.roles.first();

if (!role) {
  return message.reply({
    embeds: [
      new EmbedBuilder()
        .setTitle(`${emoji.error} Invalid Usage`)
        .setDescription(
          "Usage: `$removerole @role`"
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

shop[guildId].roles =
shop[guildId].roles.filter(
  r => r.roleId !== role.id
);

fs.writeFileSync(
  "./data/shop.json",
  JSON.stringify(shop, null, 2)
);

const embed = new EmbedBuilder()
  .setTitle(`${emoji.success} Role Removed`)
  .setDescription(
    `${emoji.role} Role: ${role.name}\n🗑️ Removed from store`
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
