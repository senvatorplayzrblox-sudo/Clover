const emoji = require("../config/emojis");
const fs = require("fs");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "givepoints",

  execute(message, users, args) {

    const OWNER_ID = "1418875905085935637";

    if (message.author.id !== OWNER_ID) {
      return message.reply(`${emoji.error} Owner only.`);
    }

    const member =
      message.mentions.members.first();

    const amount = parseInt(args[1]);

    if (!member || isNaN(amount)) {
      return message.reply(
        "Usage: `$givepoints @user <amount>`"
      );
    }

    if (!users[member.id]) {
      users[member.id] = {
        points: 0,
        messages: 0,
        vcMinutes: 0
      };
    }

    users[member.id].points += amount;

    const allUsers = JSON.parse(
      fs.readFileSync("./data/users.json", "utf8")
    );

    allUsers[message.guild.id] = users;

    fs.writeFileSync(
      "./data/users.json",
      JSON.stringify(allUsers, null, 2)
    );

    message.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle(`${emoji.success} Points Added`)
          .setDescription(
            `${emoji.user} ${member.user.username}\n${emoji.point} Added: ${amount}`
          )
      ]
    });

  }
};
