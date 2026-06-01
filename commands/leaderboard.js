module.exports = {
  name: "leaderboard",
  execute(message, users) {

    const sorted = Object.entries(users)
      .sort((a, b) => b[1].points - a[1].points)
      .slice(0, 10);

    let text = "🏆 Clover Leaderboard\n\n";

    sorted.forEach((user, index) => {
      text += `${index + 1}. <@${user[0]}> - ${user[1].points} points\n`;
    });

    message.reply(text);
  }
};
