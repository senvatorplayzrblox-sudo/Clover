const fs = require("fs");

module.exports = {
  name: "afk",

  execute(message, users, args) {
    const reason = args.join(" ") || "AFK";

    const afk = JSON.parse(
      fs.readFileSync("./data/afk.json", "utf8")
    );

    afk[message.author.id] = {
      reason,
      since: Date.now(),
      mentions: []
    };

    fs.writeFileSync(
      "./data/afk.json",
      JSON.stringify(afk, null, 2)
    );

    message.reply(`💤 You are now AFK: ${reason}`);
  }
};
