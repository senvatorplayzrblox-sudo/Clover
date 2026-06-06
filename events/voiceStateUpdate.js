const fs = require("fs");

const joined = new Map();

module.exports.execute = (client) => {

  client.on("voiceStateUpdate", (oldState, newState) => {

    const userId = newState.id;
    const guildId = newState.guild.id;

    if (!oldState.channelId && newState.channelId) {

      joined.set(userId, Date.now());

    }

    if (oldState.channelId && !newState.channelId) {

      const joinTime = joined.get(userId);

      if (!joinTime) return;

      const minutes = Math.floor(
        (Date.now() - joinTime) / 60000
      );

      joined.delete(userId);

      const users = JSON.parse(
        fs.readFileSync("./data/users.json", "utf8")
      );

      if (!users[guildId]) return;

if (!users[guildId][userId]) return;

      users[userId].vcMinutes += minutes;

      users[userId].points += Math.floor(
        minutes / 5
      );

      fs.writeFileSync(
        "./data/users.json",
        JSON.stringify(users, null, 2)
      );

    }

  });

};
