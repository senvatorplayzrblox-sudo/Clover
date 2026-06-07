const fs = require("fs");
const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

module.exports.execute = (client) => {

  client.on("interactionCreate", async (interaction) => {

    // DROPDOWN
    if (interaction.isStringSelectMenu()) {

      if (interaction.customId !== "store_select") return;

      const roleId = interaction.values[0];

      const shop = JSON.parse(
        fs.readFileSync("./data/shop.json", "utf8")
      );
      const guildId = interaction.guild.id;

if (!shop[guildId]) {
  shop[guildId] = {
    roles: []
  };
}

      const item = shop[guildId].roles.find(
  r => r.roleId === roleId
);

      if (!item) return;

      const embed = new EmbedBuilder()
        .setTitle("🛒 Role Preview")
        .setDescription(
          `🎭 Role: ${item.name}\n💰 Price: ${item.price}\n📦 Stock: ${item.stock}`
        );

      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId(`buy_${roleId}`)
            .setLabel("Buy")
            .setStyle(ButtonStyle.Success)
        );

      return interaction.reply({
        embeds: [embed],
        components: [row],
        ephemeral: true
      });
    }
    // LEADERBOARD PAGINATION
if (
interaction.isButton() &&
(
interaction.customId.startsWith("lb_prev_") ||
interaction.customId.startsWith("lb_next_")
)
) {

const users = JSON.parse(
fs.readFileSync("./data/users.json", "utf8")
);
  const guildId = interaction.guild.id;

if (!users[guildId]) {
  users[guildId] = {};
}

const sorted = Object.entries(users[guildId])
.sort((a, b) => b[1].points - a[1].points);

const perPage = 10;

let page = parseInt(
interaction.customId.split("_")[2]
);

if (
interaction.customId.startsWith("lb_next_")
) {
page++;
} else {
page--;
}

const maxPage =
Math.ceil(sorted.length / perPage) - 1;

if (page < 0) page = 0;
if (page > maxPage) page = maxPage;

const pageUsers = sorted.slice(
page * perPage,
page * perPage + perPage
);

let description = "";

pageUsers.forEach((user, index) => {

const rank =
  page * perPage + index + 1;

let medal = `#${rank}`;

if (rank === 1) medal = "🥇";
if (rank === 2) medal = "🥈";
if (rank === 3) medal = "🥉";

description +=
  `${medal} <@${user[0]}> — ⭐ ${user[1].points}\n`;

});

const embed = new EmbedBuilder()
.setTitle("🏆 Clover Leaderboard")
.setDescription(
description || "No data yet."
)
.setFooter({
  text: `Page ${page + 1}/${Math.max(
    1,
    maxPage + 1
  )}`
});

const row = new ActionRowBuilder()
.addComponents(
new ButtonBuilder()
.setCustomId(`lb_prev_${page}`)
.setLabel("◀️")
.setStyle(ButtonStyle.Secondary)
.setDisabled(page === 0),

  new ButtonBuilder()
    .setCustomId(`lb_next_${page}`)
    .setLabel("▶️")
    .setStyle(ButtonStyle.Secondary)
    .setDisabled(page >= maxPage)
);

return interaction.update({
embeds: [embed],
components: [row]
});
}

    // BUY BUTTON
if (interaction.isButton()) {

  if (!interaction.customId.startsWith("buy_")) return;

  const roleId = interaction.customId.replace("buy_", "");

  const shop = JSON.parse(
    fs.readFileSync("./data/shop.json", "utf8")
  );

  const users = JSON.parse(
    fs.readFileSync("./data/users.json", "utf8")
  );

  const item = shop.roles.find(
    r => r.roleId === roleId
  );

  const role = interaction.guild.roles.cache.get(roleId);

  if (!item || !role) {
    return interaction.reply({
      content: "❌ Role not found.",
      ephemeral: true
    });
  }

  if (!users[interaction.user.id]) {
    users[interaction.user.id] = {
      points: 0,
      messages: 0,
      vcMinutes: 0
    };
  }

  const user = users[interaction.user.id];

  if (item.stock <= 0) {
    return interaction.reply({
      content: "❌ Out of stock.",
      ephemeral: true
    });
  }

  if (interaction.member.roles.cache.has(roleId)) {
    return interaction.reply({
      content: "❌ You already own this role.",
      ephemeral: true
    });
  }

  if (user.points < item.price) {
    return interaction.reply({
      content: `❌ You need ${item.price} points.`,
      ephemeral: true
    });
  }

  user.points -= item.price;
  item.stock--;

  fs.writeFileSync(
    "./data/users.json",
    JSON.stringify(users, null, 2)
  );

  fs.writeFileSync(
    "./data/shop.json",
    JSON.stringify(shop, null, 2)
  );

  try {

    await interaction.member.roles.add(role);

    const embed = new EmbedBuilder()
      .setTitle("✅ Purchase Successful")
      .setDescription(
        `🎭 Role: ${role.name}\n💰 Cost: ${item.price}\n📦 Stock Left: ${item.stock}`
      )
      .setTimestamp();

    await interaction.reply({
      embeds: [embed],
      ephemeral: true
    });

  } catch {

    await interaction.reply({
      content: "❌ I couldn't give that role.",
      ephemeral: true
    });

  }
}
  });

};
