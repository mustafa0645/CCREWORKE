const Discord = require('discord.js');
exports.run = function(client, message, args) {

  if (!message.guild) {
    return message.author.send('`temizle` komutu sadece sunucularda kullanılabilir.');
  }
  let mesajsayisi = parseInt(args.join(' '));
  if (mesajsayisi.length < 1) return message.channel.send('ya kardeş kaç mesaj silicem söylesene')
  if (mesajsayisi > 100) return message.channel.send('ya kardeş çok fazla mesaj silmemi istedin');
  message.channel.bulkDelete(mesajsayisi + 1);
  message.channel.send(mesajsayisi +' kadar mesajın anasını neyse sildim işte')
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['sil'],
  permLevel: 2
};

exports.help = {
  name: 'temizle',
  description: 'Belirlenen miktar mesajı siler.',
  usage: 'cc!temizle <temizlenecek mesaj sayısı>'
};
