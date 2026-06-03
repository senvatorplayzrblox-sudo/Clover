const fs = require("fs");

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

    let text = "🛒 Clover Store\n\n";

    shop.roles.forEach((role, index) => {
  text += `${index + 1}. ${role.name}\n`;
  text += `💰 Price: ${role.price} points\n`;
  text += `📦 Stock: ${role.stock}\n\n`;
});

    message.reply(text);
  }
};
