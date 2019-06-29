const Discord = require('discord.js');
exports.run = function(client, message, args) {
       if (!message.guild) {
    const ozelmesajuyari = new Discord.RichEmbed()
    .setColor("RANDOM")
    .setAuthor(message.author.username, message.author.avatarURL)
    .setTitle('Komutlarımızı Özelden Kullanamassın! | ImmorTaLTurK')
    return message.author.sendEmbed(ozelmesajuyari); }
     if (!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send(new Discord.RichEmbed().setColor('RANDOM').setTitle(":heavy_multiplication_x: Bu Komutu Kullanabilmek İçin BAN Yetkisine Sahip Olman Gerekiyor."));
    message.guild.createRole({
  name: 'Kurucu',
  color: 'BLUE',
})
      message.guild.createRole({
        name: 'Admin',
        color: 'RED',
      })
            message.guild.createRole({
        name: 'Moderatör',
        color: 'BLUE',
      })
            message.guild.createRole({
        name: 'VİP Üye',
        color: 'GREEN',
      })
message.guild.createRole({
        name: 'Üye',
        color: 'Yellow',
      })
  .then(role => message.channel.send(new Discord.RichEmbed().setColor('RANDOM').setTitle(":heavy_check_mark: Roller Başarıyla Oluşturuldu!")))
  .catch(console.error)
    }



exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'hazır-rol',
  description: 'Gerekli Rolleri Oluşturur',
  usage: 'hazırrol'
};
