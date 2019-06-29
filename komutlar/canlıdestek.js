const Discord = require('discord.js');

exports.run = async (client, message, params) => {
  var channel = client.channels.find('id', 'kanal-id')
    const asdf = await client.channels.get(message.channel.id).createInvite()
  message.delete();
  const embed = new Discord.RichEmbed()
  .setTitle("» CCReworked BOT | Canlı Destek")
  .setDescription("**mesaj gönderilmiştir**")
  .setFooter("cevap verilmesi günler alabilir")
 message.channel.send(embed)
      const invite = new Discord.RichEmbed()
  .setAuthor("» Destek | Talep")
  .addField('**» Kullanıcı Adı: **', message.author.username + '#' + message.author.discriminator)
  .addField('**» Sunucu Adı: **', message.guild.name)
  .setDescription(asdf.url)
      channel.send(559007291622424576)
};

  exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'destek',
  description: 'Destek Tablebi Oluşturur.',
  usage: 'cc!destek'
};
