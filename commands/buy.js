const emoji = require("../config/emojis");
const fs = require("fs");
const { EmbedBuilder } = require("discord.js");

module.exports = {
name: "buy",

async execute(message, users, args) {

const role =
  message.mentions.roles.first() ||
  message.guild.roles.cache.get(
    args[0]?.replace(/[<@&>]/g, "")
  );
  console.log("ARGS:", args);
console.log("ROLE:", role?.name);

if (!role) {
  return message.reply({
    embeds: [
      new EmbedBuilder()
        .setTitle("${emoji.error} Invalid Usage")
        .setDescription("Usage: `$buy @role`")
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

const item = shop[guildId].roles.find(
  r => r.roleId === role.id
);

if (!item) {
  return message.reply({
    embeds: [
      new EmbedBuilder()
        .setTitle("${emoji.error} Purchase Failed")
        .setDescription("That role is not in the store.")
    ]
  });
}

const user = users[message.author.id];

console.log("ROLE EXISTS:", !!role);
console.log("ITEM EXISTS:", !!item);
console.log("USER:", user);

if (item.stock <= 0) {
  return message.reply({
    embeds: [
      new EmbedBuilder()
        .setTitle("${emoji.error} Out of Stock")
        .setDescription("This role is out of stock.")
    ]
  });
}

if (message.member.roles.cache.has(role.id)) {
  return message.reply({
    embeds: [
      new EmbedBuilder()
        .setTitle("${emoji.error} Purchase Failed")
        .setDescription("You already own this role.")
    ]
  });
}

if (user.points < item.price) {
  return message.reply({
    embeds: [
      new EmbedBuilder()
        .setTitle("${emoji.error} Not Enough Points")
        .setDescription(
          `You need ${item.price} points.`
        )
    ]
  });
}

try {

  try {
  await message.member.roles.add(role);
  console.log("ROLE GIVEN:", role.name);
} catch (err) {
  console.log("ROLE ERROR:", err);
  throw err;
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

  const embed = new EmbedBuilder()
    .setTitle(`${emoji.success} Purchase Successful`)
    .setDescription(
      `${emoji.role} Role: ${role.name}\n${emoji.point} Cost: ${item.price} points\n📦 Stock Left: ${item.stock}`
    )
    .setFooter({
      text: "Clover Store"
    })
    .setTimestamp();

  message.reply({
    embeds: [embed]
  });

} catch (err) {

  console.log(err);

  message.reply({
    embeds: [
      new EmbedBuilder()
        .setTitle("${emoji.error} Error")
        .setDescription(
          "I couldn't give that role."
        )
    ]
  });

}

}
};
