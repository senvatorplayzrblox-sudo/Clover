const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "leaderboard",

  execute(message, users) {

    const sorted = Object.entries(users)
      .sort((a, b) => b[1].points - a[1].points);

    const top10 = sorted.slice(0, 10);

    let description = "";

    top10.forEach((user, index) => {

      let medal = `#${index + 1}`;

      if (index === 0) medal = "🥇";
      if (index === 1) medal = "🥈";
      if (index === 2) medal = "🥉";

      description += `${medal} <@${user[0]}> — ⭐ ${user[1].points}\n`;
    });

    const userRank =
      sorted.findIndex(
        u => u[0] === message.author.id
      ) + 1;

    const embed = new EmbedBuilder()
      .setTitle("🏆 Clover Leaderboard")
      .setDescription(
        description || "No data yet."
      )
      .addFields({
        name: "📍 Your Rank",
        value: `#${userRank || "N/A"}`,
        inline: false
      })
      .setFooter({
        text: "Clover Economy System"
      })
      .setTimestamp();

    message.reply({
      embeds: [embed]
    });

  }
};
