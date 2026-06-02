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
      text += `${index + 1}. ${role.name} - ${role.price} points\n`;
    });

    message.reply(text);
  }
};
