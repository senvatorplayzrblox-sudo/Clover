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
    if (afk[message.author.id]) {

  const data = afk[message.author.id];
  const mentions = data.mentions || [];
      const diff = Date.now() - data.since;

const minutes = Math.floor(diff / 60000);
const seconds = Math.floor((diff % 60000) / 1000);

  let mentionText = `📬 Missed Mentions: ${mentions.length}`;

  delete afk[message.author.id];

  fs.writeFileSync(
    "./data/afk.json",
    JSON.stringify(afk, null, 2)
  );

  message.reply(
    `👋 Welcome back!\n⏰ AFK removed\n📝 Reason: ${data.reason}\n${mentionText}`
  );
    }
    for (const user of message.mentions.users.values()) {

  if (!afk[user.id]) continue;

  const since = Math.floor(
  const diff = Date.now() - afk[user.id].since;

const minutes = Math.floor(diff / 60000);
const seconds = Math.floor((diff % 60000) / 1000);

message.reply(
  `💤 ${user.username} is AFK: ${afk[user.id].reason}\n⏰ Since: ${minutes}m ${seconds}s ago`
);

  afk[user.id].mentions.push({
  author: message.author.username,
  url: message.url,
  time: Date.now()
});

  fs.writeFileSync(
    "./data/afk.json",
    JSON.stringify(afk, null, 2)
  );
    }

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
};
