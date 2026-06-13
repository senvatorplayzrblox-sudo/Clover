const fs = require("fs");

const joined = new Map();
const activeVC = new Map();

module.exports.execute = (client) => {

  client.on("voiceStateUpdate", (oldState, newState) => {

    const userId = newState.id;
    const guildId = newState.guild.id;

    if (!oldState.channelId && newState.channelId) {

      joined.set(userId, Date.now());
      const users = JSON.parse(
  fs.readFileSync("./data/users.json", "utf8")
);

if (!users[guildId]) users[guildId] = {};

if (!users[guildId][userId]) {
  users[guildId][userId] = {
    points: 0,
    messages: 0,
    vcMinutes: 0
  };
}

fs.writeFileSync(
  "./data/users.json",
  JSON.stringify(users, null, 2)
);
      const interval = setInterval(() => {

  const users = JSON.parse(
    fs.readFileSync("./data/users.json", "utf8")
  );

  if (!users[guildId]) return;
  if (!users[guildId][userId]) return;

  users[guildId][userId].vcMinutes++;

  if (
    users[guildId][userId].vcMinutes % 5 === 0
  ) {
    users[guildId][userId].points++;
  }

  fs.writeFileSync(
    "./data/users.json",
    JSON.stringify(users, null, 2)
  );

}, 60000);

activeVC.set(userId, interval);

    }

    if (oldState.channelId && !newState.channelId) {

      const joinTime = joined.get(userId);

      if (!joinTime) return;

      joined.delete(userId);
      clearInterval(activeVC.get(userId));
activeVC.delete(userId);

      const users = JSON.parse(
        fs.readFileSync("./data/users.json", "utf8")
      );

      if (!users[guildId]) return;

if (!users[guildId][userId]) return;

    
      fs.writeFileSync(
        "./data/users.json",
        JSON.stringify(users, null, 2)
      );

    }

  });

};
