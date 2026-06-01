module.exports = {
  name: "profile",
  execute(message, users) {
    const user = users[message.author.id];

    if (!user) {
      return message.reply("❌ No profile data found yet.");
    }

    message.reply(
      `🌿 ${message.author.username}'s Profile

⭐ Points: ${user.points}
💬 Messages: ${user.messages}
🎙️ VC Minutes: ${user.vcMinutes}`
    );
  }
};
