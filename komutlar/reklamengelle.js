
const Discord = require('discord.js');
const fs = require('fs');
let reklamEngel = JSON.parse(fs.readFileSync("././jsonlar/reklamEngelle.json", "utf8"));

var ayarlar = require('../ayarlar.json');

exports.run = (client, message) => {
  if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply(`:fire: Yeterli yetki, bulunmamakta!`);

    let args = message.content.split(' ').slice(1);
    const secenekler = args.slice(0).join(' ');

    var errembed = new Discord.RichEmbed()
    .setColor("RANDOM")
    .setDescription(`Yanlış kullanım tespit edildi!`)
    if(secenekler.length < 1) return message.channel.send(errembed);
    //if(secenekler === "aç" || "kapat") return message.channel.send(errembed);
      if(secenekler.length < 1) return message.reply("Aktif hale getirmek için h!reklam-engelle aç & cc!reklam-engelle kapat").then(m => m.delete(10000));

    message.delete();

            if (secenekler === "aç") {
        message.channel.send(`reklam filtresi, aktif hale getirildi!`).then(m => m.delete(5000));
        reklamEngel[message.guild.id] = {
            reklamEngel: "acik"
          };

          fs.writeFile("././jsonlar/reklamEngelle.json", JSON.stringify(reklamEngel), (err) => {
            if (err) console.log(err)
          });
    };

    if (secenekler === "kapat") {
        message.channel.send(`reklam filtresi, deaktif hale getirildi!`).then(m => m.delete(5000));
        reklamEngel[message.guild.id] = {
            reklamEngel: "kapali"
          };

        fs.writeFile("././jsonlar/reklamEngelle.json", JSON.stringify(reklamEngel), (err) => {
            if (err) console.log(err)
          });
    };
}

    exports.conf = {
        enabled: true,
        guildOnly: false,
        aliases: ['reklam-engel'],
        permLevel: 3
      };
      
      exports.help = {
        name: 'reklam-engelle',
    category: 'yetkili',
        description: 'reklam engelleme sistemini, açıp kapatmanızı sağlar.',
        usage: 'reklam-engelle <aç> veya <kapat>'
      };