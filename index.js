
const { Client, MessageEmbed } = require("discord.js");
const { parse } = require("node-html-parser");
const { Users } = require('./dbObjects');
const { Op } = require('sequelize');

const fetch = require("node-fetch");
const client = new Client();
const prefix = "c!";
const jardimCategory = "Jardins Privados";
const endCategory = "Fim do Mundo";
const token = "NzIzMTgwNDY1NzI4NTIwMzc0.Xut4Sw.q2KFc7toR77ncz-1ZrH0lSLhvR4";

client.once("ready", () => {
  console.log("Ready!");
});

async function create_user(id, channel) {
  const newUser = await Users.create({ user_id: id, user_channel: channel });
}
client.on("guildMemberAdd",  (member) => {
  Users.findOne({ where: { user_id: member.id } }).then(user => {
    if (user == null) {
      // Create a new text channel
      member.guild.channels.create("jardim-do-"+member.displayName, {
        reason: 'Membro novo'
      }).then((channel) => {
          channel.send(`${member} olá seja bem vindo ao seu novo jardim, cuide dele com amor e carinho :blush:`);
          let category = member.guild.channels.cache.find(c => c.name == jardimCategory && c.type == "category");
          channel.setParent(category.id);
          channel.overwritePermissions([
            {
                id: member.id,
                allow: ['MANAGE_ROLES','VIEW_CHANNEL', 'MANAGE_MESSAGES', 'ATTACH_FILES', 'EMBED_LINKS', 'SEND_TTS_MESSAGES', 'USE_EXTERNAL_EMOJIS', 'MANAGE_CHANNELS'],
            },
            {
              id: member.guild.roles.everyone,
              deny: ['MANAGE_MESSAGES', 'ATTACH_FILES', 'EMBED_LINKS', 'SEND_TTS_MESSAGES', 'MANAGE_CHANNELS']
            },
            {
              id: '869273588623101983',
              deny: ['SEND_MESSAGES','VIEW_CHANNEL']
            }
          ]);
          create_user(member.id, channel.id);
        }
      )
      .catch(console.error);
    }else {
      const channel = member.guild.channels.cache.find(ch => ch.id === user.user_channel);
      if (channel) {
        channel.send(`${member} bem vindo de volta`);
        channel.overwritePermissions([
          {
              id: member.id,
              allow: ['MANAGE_ROLES','VIEW_CHANNEL', 'MANAGE_MESSAGES', 'ATTACH_FILES', 'EMBED_LINKS', 'SEND_TTS_MESSAGES', 'USE_EXTERNAL_EMOJIS', 'MANAGE_CHANNELS'],
          },
          {
            id: member.guild.roles.everyone,
            allow: ['SEND_MESSAGES'],
            deny: ['MANAGE_MESSAGES', 'ATTACH_FILES', 'EMBED_LINKS', 'SEND_TTS_MESSAGES', 'MANAGE_CHANNELS']
          },
          {
            id: '869273588623101983',
            deny: ['SEND_MESSAGES','VIEW_CHANNEL']
          }
        ]);
        let category = member.guild.channels.cache.find(c => c.name == jardimCategory && c.type == "category");
        channel.setParent(category.id);
      }
    }
  });
});
client.on("guildMemberRemove",  (member) => {
  Users.findOne({ where: { user_id: member.id } }).then(user => {
    if (user == null) {

    }else {
      const channel = member.guild.channels.cache.find(ch => ch.id === user.user_channel);
      if (channel) {
        channel.send(`${member} abandonou seu jardim, meu deus que tristeza`);
        let category = member.guild.channels.cache.find(c => c.name == endCategory && c.type == "category");
        channel.setParent(category.id);
        channel.overwritePermissions([
          {
            id: member.guild.roles.everyone,
            deny: ['SEND_MESSAGES']
          }
        ]);
      }
    }
  });
});
client.on("message", async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split("/ +/");
  const command = args.shift().toLowerCase();
  switch (command) {
    case "temas":
      var response = await fetch('https://random-word-api.herokuapp.com/word?number=10');
      var commits = await response.json();

      if (response.ok) {
        message.channel.send(commits);
      }
    break;
    //case "suicidio":
    //  const User = Users.findOne({where: { user_id: message.author.id} }).then(user => {
    //    if (user != null) {
    //      Users.destroy({
    //        where: { user_id: message.author.id }
    //      });
    //      message.channel.send(`${message.author} você foi suicidado`);
    //    }else {
    //      message.channel.send(`${message.author} você não pode ser suicidado`);
    //    }
    //  });
    //break;
    //case "user":
    //  const userr = Users.findOne({where: { user_id: message.author.id} }).then(user => {
    //    if (user != null) message.channel.send(`${user}\n${user.user_id}\n${user.user_channel}`);
    //  });
    //break;
  }
});

client.login(token);
