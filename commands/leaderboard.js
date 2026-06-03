const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "leaderboard",

  execute(message, users) {

    const sorted = Object.entries(users)
      .sort((a, b) => b[1].points - a[1].points)
      .slice(0, 10);

    const embed = new EmbedBuilder()
      .setTitle("🏆 Clover Leaderboard");

    let description = "";

    sorted.forEach((user, index) => {
      description += `${index + 1}. <@${user[0]}> - ⭐ ${user[1].points} points\n`;
    });

    embed
      .setDescription(description || "No data yet.")
      .setFooter({
        text: "Clover Economy System"
      })
      .setTimestamp();

    message.reply({
      embeds: [embed]
    });
  }
};
