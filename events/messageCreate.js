const fs = require("fs");

module.exports.execute = (client) => {
  client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    if (!message.guild) return;

    const users = JSON.parse(
      fs.readFileSync("./data/users.json", "utf8")
    );

    if (!users[message.author.id]) {
      users[message.author.id] = {
        points: 0,
        messages: 0,
        vcMinutes: 0,
        inventory: []
      };
    }

    users[message.author.id].messages++;

    if (users[message.author.id].messages % 50 === 0) {
      users[message.author.id].points++;
    }

    fs.writeFileSync(
      "./data/users.json",
      JSON.stringify(users, null, 2)
    );

    if (message.content === "$profile") {
      const user = users[message.author.id];

      message.reply(
        `🌿 Profile\n\nPoints: ${user.points}\nMessages: ${user.messages}\nVC Minutes: ${user.vcMinutes}`
      );
    }
  });
};
