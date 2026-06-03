const fs = require("fs");

module.exports = {
  name: "buy",

  async execute(message, users, args) {

    const role = message.mentions.roles.first();

    if (!role) {
      return message.reply(
        "Usage: $buy @role"
      );
    }

    const shop = JSON.parse(
      fs.readFileSync("./data/shop.json", "utf8")
    );

    const item = shop.roles.find(
      r => r.roleId === role.id
    );

    if (!item) {
      return message.reply(
        "❌ That role is not in the store."
      );
    }

    const user = users[message.author.id];
    if (item.stock <= 0) {
  return message.reply(
    "❌ This role is out of stock."
  );
    }
    if (message.member.roles.cache.has(role.id)) {
  return message.reply(
    "❌ You already own this role."
  );
    }

    if (user.points < item.price) {
      return message.reply(
        `❌ You need ${item.price} points.`
      );
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

      message.reply(
        `✅ Purchased ${role.name} for ${item.price} points.`
      );

    } catch {

      message.reply(
        "❌ I couldn't give that role."
      );

    }
  }
};
