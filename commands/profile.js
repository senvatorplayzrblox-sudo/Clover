module.exports = {
  name: "profile",
  execute(message, users) {
    const user = users[message.author.id];

    if (!user) {
      return message.reply("❌ No profile data found yet.");
    }

    const msgProgress = user.messages % 50;
const vcProgress = user.vcMinutes % 5;

message.reply(
  `🌿 ${message.author.username}'s Profile

⭐ Points: ${user.points}
💬 Messages: ${msgProgress}/50
🎙️ VC Minutes: ${vcProgress}/5`
);
    );
  }
};
