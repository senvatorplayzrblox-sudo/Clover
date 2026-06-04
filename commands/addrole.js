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
        .setTitle("❌ Permission Denied")
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
        .setTitle("❌ Invalid Usage")
        .setDescription(
          "Usage: `$addrole <price> <stock> @role`"
        )
    ]
  });
}

const shop = JSON.parse(
  fs.readFileSync("./data/shop.json", "utf8")
);

shop.roles.push({
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
  .setTitle("✅ Role Added")
  .setDescription(
    `🎭 Role: ${role.name}\n💰 Price: ${price}\n📦 Stock: ${stock}`
  )
  .setFooter({
    text: "Clover Store Setup"
  })
  .setTimestamp();

message.reply({
  embeds: [embed]
});

}
};      "./data/shop.json",
      JSON.stringify(shop, null, 2)
    );

    message.reply(
  `✅ Added ${role.name} for ${price} points.\n📦 Stock: ${stock}`
);
  }
};
