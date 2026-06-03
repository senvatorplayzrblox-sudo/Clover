const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "profile",

  execute(message, users) {

    const user = users[message.author.id];

    if (!user) {
      return message.reply("❌ No profile data found yet.");
    }

    const msgProgress = user.messages % 50;
    const vcProgress = user.vcMinutes % 5;

    const embed = new EmbedBuilder()
      .setTitle("🌿 Clover Profile")
      .setDescription(
`👤 User: ${message.author.username}

⭐ Points: ${user.points}
💬 Messages: ${msgProgress}/50
🎙️ VC Minutes: ${vcProgress}/5`
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
