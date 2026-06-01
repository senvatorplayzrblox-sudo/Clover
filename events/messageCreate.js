const fs = require("fs");

module.exports.execute = (client) => {
  client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    if (!message.guild) return;

    const users = JSON.parse(
      fs.readFileSync("./data/users.json", "utf8")
    );
    const afk = JSON.parse(
  fs.readFileSync("./data/afk.json", "utf8")
);

    if (!users[message.author.id]) {
      users[message.author.id] = {
        points: 0,
        messages: 0,
        vcMinutes: 0
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

    const prefix = "$";

    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);

    if (!command) return;

    try {
      if (command.execute) {
        command.execute(message, users, args);
      }
    } catch (err) {
      console.error(err);
      message.reply("❌ Error while executing command.");
    }
  });
};      );
    }
  });
};
