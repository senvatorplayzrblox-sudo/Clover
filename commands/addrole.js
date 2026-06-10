const emoji = require("../config/emojis");
const fs = require("fs");
const {
PermissionsBitField,
EmbedBuilder
} = require("discord.js");

module.exports = {
name: "addrole",

execute(message, users, args) {

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

const price = parseInt(args[0]);
const stock = parseInt(args[1]);

const role = message.mentions.roles.first();

if (!price || !stock || !role) {
  return message.reply({
    embeds: [
      new EmbedBuilder()
        .setTitle(`${emoji.error} Invalid Usage`)
        .setDescription(
          "Usage: `$addrole <price> <stock> @role`"
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
  const existingRole =
shop[guildId].roles.find(
  r => r.roleId === role.id
);

if (existingRole) {
  return message.reply({
    embeds: [
      new EmbedBuilder()
        .setTitle(`${emoji.error} Already Added`)
        .setDescription(
          "That role is already in the store."
        )
    ]
  });
}

shop[guildId].roles.push({
  name: role.name,
  price,
  stock,
  roleId: role.id
});

fs.writeFileSync(
  "./data/shop.json",
  JSON.stringify(shop, null, 2)
);

const embed = new EmbedBuilder()
  .setTitle(`${emoji.success} Role Added`)
  .setDescription(
    `${emoji.role} Role: ${role.name}\n💰 Price: ${price}\n${emoji.stock} Stock: ${stock}`
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
