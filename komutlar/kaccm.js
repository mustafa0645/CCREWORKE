const Discord = require("discord.js");

exports.run = async (client, message, args) => {

var uzunluk = ["1 cm \n Ɛ=> ne yapacaksın bunla?", "13 cm \nƐ========> hiç yoktan iyidir ", "0 cm \n Kardeş o ne ya ", "17 cm \n Ɛ===========> ehhh", "22 cm \n Ɛ=============> pantolondan aşağı sarkıyor mu? ", "21 cm \n Ɛ==============>baya iyi ya", "3 cm \n Ɛ===> hiç olmasaymış", "7 cm \n Ɛ=======> yok bea", "25 cm \n Ɛ======================> Hangi hapı kullandın"];
    var sonuc = uzunluk[Math.floor((Math.random() * uzunluk.length))];

      var sonuc = uzunluk[Math.floor((Math.random() * uzunluk.length))];

    const embed = new Discord.RichEmbed()
    .setColor('RANDOM')
    .setDescription(`**${message.author.tag}** \n\nSenin muzun tam olarak **${sonuc}** `)
    .setFooter('CCReworked Bot | 2019')
    return message.channel.sendEmbed(embed);
  };

   exports.conf = {
 enabled: true,
 guildOnly: false,
 aliases: ['kaccm'],
 permLevel: 0
};

exports.help = {
 name: 'kaçcm',
 description: '',
 usage: 'kaçcm '
};
