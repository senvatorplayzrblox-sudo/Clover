const emoji = require("../config/emojis");
const {
EmbedBuilder,
ActionRowBuilder,
ButtonBuilder,
ButtonStyle
} = require("discord.js");

module.exports = {
name: "leaderboard",

execute(message, users) {

const sorted = Object.entries(users)
  .sort((a, b) => b[1].points - a[1].points);

const perPage = 10;
const page = 0;

const pageUsers = sorted.slice(0, perPage);

let description = "";

pageUsers.forEach((user, index) => {

  const rank = index + 1;

  let medal = `#${rank}`;

if (rank === 1) medal = emoji.gold;
if (rank === 2) medal = emoji.silver;
if (rank === 3) medal = emoji.bronze;
  description +=
    `${medal} <@${user[0]}> — ⭐ ${user[1].points}\n`;
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
    value: `#${userRank || "N/A"}`
  })
  .setFooter({
    text: `Page 1/${Math.max(
      1,
      Math.ceil(sorted.length / perPage)
    )}`
  })
  .setTimestamp();

const row = new ActionRowBuilder()
  .addComponents(
    new ButtonBuilder()
      .setCustomId(`lb_prev_0`)
      .setLabel("◀️")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(true),

    new ButtonBuilder()
      .setCustomId(`lb_next_0`)
      .setLabel("▶️")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(
        sorted.length <= perPage
      )
  );

message.reply({
  embeds: [embed],
  components: [row]
});

}
};
