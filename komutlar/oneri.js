
const Discord = require('discord.js');

exports.run = function(client, message, args) {

    var öneri = args.slice(0).join(' ');
    var guildID = "534653503151538187";
    var channelID = "559007291622424576";

    if (!öneri){
        return message.reply("Bir mesaj belirtin! Doğru kullanım: cc!öneri <mesaj>");
    } else {

        var embed = new Discord.RichEmbed()
            .setTimestamp()
            .addField("Eylem:", "Öneri")
            .addField("Kullanıcı:", message.author.tag)
            .addField("ID", message.author.id)
            .addField("Öneri", öneri)

        client.guilds.get(guildID).channels.get(channelID).send(embed);
        message.channel.send("Öneriniz alınmıştır! Teşekkür ederiz.");
    };

};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["öner"], 
  permLevel: 0 
};

exports.help = {
  name: 'öneri', 
  description: "bot hakkındaki önerilerinizi bot sahiplerine ulaştırır", 
  usage: 'öneri <mesaj>' 
};