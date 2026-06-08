const fs = require("fs");
const { EmbedBuilder } = require("discord.js");

module.exports.execute = (client) => {
client.on("messageCreate", async (message) => {

if (message.author.bot) return;
if (!message.guild) return;

const users = JSON.parse(
  fs.readFileSync("./data/users.json", "utf8")
);

const afk = JSON.parse(
  fs.readFileSync("./data/afk.json", "utf8")
);
  const guildId = message.guild.id;

if (!users[guildId]) users[guildId] = {};
if (!afk[guildId]) afk[guildId] = {};
  function formatDuration(ms) {

  let seconds = Math.floor(ms / 1000);

  const years = Math.floor(seconds / 31536000);
  seconds %= 31536000;

  const months = Math.floor(seconds / 2592000);
  seconds %= 2592000;

  const days = Math.floor(seconds / 86400);
  seconds %= 86400;

  const hours = Math.floor(seconds / 3600);
  seconds %= 3600;

  const minutes = Math.floor(seconds / 60);
  seconds %= 60;

  const parts = [];

  if (years) parts.push(`${years}y`);
  if (months) parts.push(`${months}mo`);
  if (days) parts.push(`${days}d`);
  if (hours) parts.push(`${hours}h`);
  if (minutes) parts.push(`${minutes}m`);
  if (seconds) parts.push(`${seconds}s`);

  return parts.join(" ") || "0s";
  }

// AFK REMOVE
if (afk[guildId][message.author.id]) {

  const data = afk[guildId][message.author.id];
  const mentions = data.mentions || [];

  const diff = Date.now() - data.since;

  const duration = formatDuration(diff);

  let mentionText = "";

  if (mentions.length > 0) {
    mentionText += "\n\n";

    mentions.forEach((m, i) => {
      mentionText += `**#${i + 1}** [Jump to Message](${m.url})\n`;
    });
  }

  delete afk[guildId][message.author.id];

  fs.writeFileSync(
    "./data/afk.json",
    JSON.stringify(afk, null, 2)
  );

  const embed = new EmbedBuilder()
  .setTitle("👋 Welcome Back")
  .setDescription(
    `⏰ AFK Duration: ${duration}\n📝 Reason: ${data.reason}\n\n${mentionText}`
  )
  .setFooter({
    text: "Clover AFK System"
  })
  .setTimestamp();

message.reply({
  embeds: [embed]
});
}

// AFK MENTIONS
for (const user of message.mentions.users.values()) {

  if (!afk[guildId][user.id]) continue;

  const diff = Date.now() - afk[guildId][user.id].since;

  const duration = formatDuration(diff);

  const embed = new EmbedBuilder()
  .setTitle("💤 User AFK")
  .setColor("Yellow")
  .setDescription(
    `💤 ${user.username} is AFK\n📝 Reason: ${afk[guildId][user.id].reason}\n⏰ Since: ${duration} ago`
  )
  .setFooter({
  text: `Mentions: ${mentions.length}`
})
  .setTimestamp();

const reply = await message.reply({
  embeds: [embed]
});

setTimeout(() => {
  reply.delete().catch(() => {});
}, 15000);
  afk[guildId][user.id].mentions.push({
    author: message.author.username,
    url: message.url,
    time: Date.now()
  });

  fs.writeFileSync(
    "./data/afk.json",
    JSON.stringify(afk, null, 2)
  );
}

// USER DATA
if (!users[guildId][message.author.id]) {
  users[guildId][message.author.id] = {
    points: 0,
    messages: 0,
    vcMinutes: 0
  };
}

// MESSAGE XP
users[guildId][message.author.id].messages++;

if (users[guildId][message.author.id].messages % 50 === 0) {
  users[guildId][message.author.id].points++;}

fs.writeFileSync(
  "./data/users.json",
  JSON.stringify(users, null, 2)
);

const prefix = "$";

if (!message.content.startsWith(prefix)) return;

const args = message.content
  .slice(prefix.length)
  .trim()
  .split(/ +/);

const commandName = args.shift().toLowerCase();

const command = client.commands.get(commandName);

if (!command) return;
try {

  if (command.execute) {
    command.execute(
  message,
  users[guildId],
  args
);
  }

} catch (err) {

  console.error(err);

  message.reply(
    "❌ Error while executing command."
  );

}

});
};
