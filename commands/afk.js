const emoji = require("../config/emojis");
const fs = require("fs");
const { EmbedBuilder } = require("discord.js");

module.exports = {
name: "afk",

async execute(message, users, args) {

const reason = args.join(" ") || "AFK";

const afk = JSON.parse(
  fs.readFileSync("./data/afk.json", "utf8")
);
  const guildId = message.guild.id;

if (!afk[guildId]) {
  afk[guildId] = {};
}

afk[guildId][message.author.id] = {
  reason,
  since: Date.now(),
  mentions: []
};

fs.writeFileSync(
  "./data/afk.json",
  JSON.stringify(afk, null, 2)
);

const embed = new EmbedBuilder()
  .setTitle(`${emoji.afk} AFK Enabled`)
  .setDescription(
    `${emoji.note} Reason: ${reason}`
  )
  .setFooter({
    text: "Clover AFK System"
  })
  .setTimestamp();

const reply = await message.reply({
  embeds: [embed]
});

setTimeout(() => {
  reply.delete().catch(() => {});
}, 20000);
}
};
