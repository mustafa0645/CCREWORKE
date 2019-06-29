const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content === 'cc!oyun') {
    msg.reply('doğruluk için cc!d----cesaret için cc!c');
  }
});

client.login('NTkyODIyMDI5OTIxNTUwMzM5.XRE6sQ.cnndJAMzK8JKaA3QBlyhX7r1Seg');
exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'dc',
  description: 'İstediğiniz kişiyi  susturur.',
  usage: 'cc!oyun'
};
