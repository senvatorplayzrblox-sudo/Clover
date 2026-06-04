const fs = require("fs");
const { EmbedBuilder } = require("discord.js");

module.exports = {
name: "afk",

execute(message, users, args) {

const reason = args.join(" ") || "AFK";

const afk = JSON.parse(
  fs.readFileSync("./data/afk.json", "utf8")
);

afk[message.author.id] = {
  reason,
  since: Date.now(),
  mentions: []
};

fs.writeFileSync(
  "./data/afk.json",
  JSON.stringify(afk, null, 2)
);

const embed = new EmbedBuilder()
  .setTitle("💤 AFK Enabled")
  .setDescription(
    `📝 Reason: ${reason}`
  )
  .setFooter({
    text: "Clover AFK System"
  })
  .setTimestamp();

message.reply({
  embeds: [embed]
});

}
};
