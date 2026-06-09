const emoji = require("../config/emojis");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "profile",

  execute(message, users) {

    const user = users[message.author.id];

    if (!user) {
      return message.reply("${emoji.error} No profile data found yet.");
    }

    const msgProgress = user.messages % 50;
    const vcProgress = user.vcMinutes % 5;

    const embed = new EmbedBuilder()
      .setTitle("${emoji.clover} Clover Profile")
      .setDescription(
`${emoji.user} User: ${message.author.username}

${emoji.point} Points: ${user.points}
${emoji.messages} Messages: ${msgProgress}/50
${emoji.vc} VC Minutes: ${vcProgress}/5`
      )
      .setFooter({
        text: "Clover Economy System"
      })
      .setTimestamp();

    message.reply({
      embeds: [embed]
    });
  }
};
