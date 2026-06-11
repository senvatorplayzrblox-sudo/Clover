const fs = require("fs");
const {
  PermissionsBitField,
  EmbedBuilder
} = require("discord.js");

module.exports = {
  name: "msgchannels",

  execute(message) {

    if (
      !message.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    ) {
      return message.reply(`${emoji.error} Admin only.`);
    }

    const settings = JSON.parse(
      fs.readFileSync("./data/settings.json", "utf8")
    );

    const guildId = message.guild.id;

    if (!settings[guildId]) {
      settings[guildId] = {
        messageChannels: []
      };
    }

    const args = message.content
      .trim()
      .split(/ +/)
      .slice(1);

    const sub = args.shift()?.toLowerCase();

    if (sub === "view") {

      const channels =
        settings[guildId].messageChannels;

      const list =
        channels.length
          ? channels.map(id => `<#${id}>`).join("\n")
          : "No channels selected.";

      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle(`${emoji.clover} Message Channels`)
            .setDescription(list)
        ]
      });
    }

    if (
      sub === "add"
    ) {

      message.mentions.channels.forEach(ch => {

        if (
          !settings[guildId].messageChannels.includes(
            ch.id
          )
        ) {
          settings[guildId].messageChannels.push(
            ch.id
          );
        }

      });

      fs.writeFileSync(
        "./data/settings.json",
        JSON.stringify(settings, null, 2)
      );

      return message.reply(
        `${emoji.success} Channels added.`
      );
    }

    if (
      sub === "remove"
    ) {

      message.mentions.channels.forEach(ch => {

        settings[guildId].messageChannels =
          settings[guildId].messageChannels.filter(
            id => id !== ch.id
          );

      });

      fs.writeFileSync(
        "./data/settings.json",
        JSON.stringify(settings, null, 2)
      );

      return message.reply(
        `${emoji.success} Channels removed.`
      );
    }

    message.reply(
      "Usage: $msgchannels add/remove/view"
    );

  }
};
