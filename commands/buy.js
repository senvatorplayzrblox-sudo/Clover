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

if (!role) {
  return message.reply({
    embeds: [
      new EmbedBuilder()
        .setTitle("❌ Invalid Usage")
        .setDescription("Usage: `$buy @role`")
    ]
  });
}

const shop = JSON.parse(
  fs.readFileSync("./data/shop.json", "utf8")
);

const item = shop.roles.find(
  r => r.roleId === role.id
);

if (!item) {
  return message.reply({
    embeds: [
      new EmbedBuilder()
        .setTitle("❌ Purchase Failed")
        .setDescription("That role is not in the store.")
    ]
  });
}

const user = users[message.author.id];

if (item.stock <= 0) {
  return message.reply({
    embeds: [
      new EmbedBuilder()
        .setTitle("❌ Out of Stock")
        .setDescription("This role is out of stock.")
    ]
  });
}

if (message.member.roles.cache.has(role.id)) {
  return message.reply({
    embeds: [
      new EmbedBuilder()
        .setTitle("❌ Purchase Failed")
        .setDescription("You already own this role.")
    ]
  });
}

if (user.points < item.price) {
  return message.reply({
    embeds: [
      new EmbedBuilder()
        .setTitle("❌ Not Enough Points")
        .setDescription(
          `You need ${item.price} points.`
        )
    ]
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

  await message.member.roles.add(role);

  const embed = new EmbedBuilder()
    .setTitle("✅ Purchase Successful")
    .setDescription(
      `🎭 Role: ${role.name}\n💰 Cost: ${item.price} points\n📦 Stock Left: ${item.stock}`
    )
    .setFooter({
      text: "Clover Store"
    })
    .setTimestamp();

  message.reply({
    embeds: [embed]
  });

} catch {

  message.reply({
    embeds: [
      new EmbedBuilder()
        .setTitle("❌ Error")
        .setDescription(
          "I couldn't give that role."
        )
    ]
  });

}

}
};
