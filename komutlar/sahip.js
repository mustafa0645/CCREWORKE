const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
    let serverembed = new Discord.RichEmbed()
    .setDescription("**:chicken: Sahip komutları**")
    .setColor("RANDOM")
    .addField("cc!eval", "Kod dener")
    .addField("cc!load", "Yeni bir komut yükler")
    .addField("cc!reboot", "Botu yeniden başlatır")
    .addField("cc!reload", "Bir komutu yeniden başlatır")
    .addField("cc!unload", "Bir komutu devre dışı bırakır")

    message.channel.send(serverembed);
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['sahipler'],
  permLevel: 0
};

exports.help = {
  name: 'sahip',
  description: 'Bütün sahip komutlarını verir.',
  usage: 'sahip'
};
