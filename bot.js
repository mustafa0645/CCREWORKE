const Discord = require('discord.js');
const client = new Discord.Client();
const ayarlar = require('./ayarlar.json');
const chalk = require('chalk');
const fs = require('fs');
const moment = require('moment');

require('./util/eventLoader')(client);

var prefix = ayarlar.prefix;
let reklamEngel = JSON.parse(fs.readFileSync("./jsonlar/reklamEngelle.json", "utf8"));





let queue = {};

const commands = {
	'play': (msg) => {
		if (queue[msg.guild.id] === undefined) return msg.channel.sendMessage(`${ayarlar.prefix}add <url> ile birkaç müzik ekle`);
		if (!msg.guild.voiceConnection) return commands.join(msg).then(() => commands.play(msg));
		if (queue[msg.guild.id].playing) return msg.channel.sendMessage('Zaten Çalınan var');
		let dispatcher;
		queue[msg.guild.id].playing = true;

		console.log(queue);
		(function play(song) {
			console.log(song);
			if (song === undefined) return msg.channel.sendMessage('Sıra boş').then(() => {
				queue[msg.guild.id].playing = false;
				msg.member.voiceChannel.leave();
			});
			msg.channel.sendMessage(`Çalınan: **${song.title}** talep eden: **${song.requester}**`);
			dispatcher = msg.guild.voiceConnection.playStream(yt(song.url, { audioonly: true }), { passes : ayarlar.passes });
			let collector = msg.channel.createCollector(m => m);
			collector.on('message', m => {
				if (m.content.startsWith(ayarlar.prefix + 'pause')) {
					msg.channel.sendMessage('**durduruldu**').then(() => {dispatcher.pause();});
				} else if (m.content.startsWith(ayarlar.prefix + 'resume')){
					msg.channel.sendMessage('**devam ediyor**').then(() => {dispatcher.resume();});
				} else if (m.content.startsWith(ayarlar.prefix + 'skip')){
					msg.channel.sendMessage('**geçildi**').then(() => {dispatcher.end();});
				} else if (m.content.startsWith('volume+')){
					if (Math.round(dispatcher.volume*50) >= 100) return msg.channel.sendMessage(`Şiddet: ${Math.round(dispatcher.volume*50)}%`);
					dispatcher.setVolume(Math.min((dispatcher.volume*50 + (2*(m.content.split('+').length-1)))/50,2));
					msg.channel.sendMessage(`Şiddet: ${Math.round(dispatcher.volume*50)}%`);
				} else if (m.content.startsWith('volume-')){
					if (Math.round(dispatcher.volume*50) <= 0) return msg.channel.sendMessage(`Şiddet: ${Math.round(dispatcher.volume*50)}%`);
					dispatcher.setVolume(Math.max((dispatcher.volume*50 - (2*(m.content.split('-').length-1)))/50,0));
					msg.channel.sendMessage(`Şiddet: ${Math.round(dispatcher.volume*50)}%`);
				} else if (m.content.startsWith(ayarlar.prefix + 'time')){
					msg.channel.sendMessage(`Süre: ${Math.floor(dispatcher.time / 60000)}:${Math.floor((dispatcher.time % 60000)/1000) <10 ? '0'+Math.floor((dispatcher.time % 60000)/1000) : Math.floor((dispatcher.time % 60000)/1000)}`);
				}
			});
			dispatcher.on('end', () => {
				collector.stop();
				play(queue[msg.guild.id].songs.shift());
			});
			dispatcher.on('error', (err) => {
				return msg.channel.sendMessage('Hata: ' + err).then(() => {
					collector.stop();
					play(queue[msg.guild.id].songs.shift());
				});
			});
		})(queue[msg.guild.id].songs.shift());
	},
	'join': (msg) => {
		return new Promise((resolve, reject) => {
			const voiceChannel = msg.member.voiceChannel;
			if (!voiceChannel || voiceChannel.type !== 'voice') return msg.reply('Bir kanala katıl.');
			voiceChannel.join().then(connection => resolve(connection)).catch(err => reject(err));
		});
	},
	'leave': (msg) => {
					const voiceChannel = msg.member.voiceChannel;

			voiceChannel.leave()

	},
	'add': async (msg) => {
		const args = msg.content.split(' ');
		const searchString = args.slice(1).join(' ');
		const url2 = args[1].replace(/<.+>/g, '1');

		try {
			var video = await youtube.getVideo(url2)
		} catch (error) {
			try {
				var videos = await youtube.searchVideos(searchString, 1)
				var video = await youtube.getVideoByID(videos[0].id)
			} catch (err) {
				console.log(err)
				message.channel.send('Bir hata oluştu: ' + err)
			};
		};

		var url = `https://www.youtube.com/watch?v=${video.id}`

		if (url == '' || url === undefined) return msg.channel.sendMessage(`Bir YouTube linki eklemek için ${ayarlar.prefix}add <url> yazınız`);
		yt.getInfo(url, (err, info) => {
			if(err) return msg.channel.sendMessage('Geçersiz YouTube Bağlantısı: ' + err);
			if (!queue.hasOwnProperty(msg.guild.id)) queue[msg.guild.id] = {}, queue[msg.guild.id].playing = false, queue[msg.guild.id].songs = [];
			queue[msg.guild.id].songs.push({url: url, title: info.title, requester: msg.author.username});
			msg.channel.sendMessage(`sıraya **${info.title}** eklendi`);
		});
	},
	'queue': (msg) => {
		if (queue[msg.guild.id] === undefined) return msg.channel.sendMessage(`Sıraya ilk önce bazı şarkıları ekle : ${ayarlar.prefix}add`);
		let tosend = [];
		queue[msg.guild.id].songs.forEach((song, i) => { tosend.push(`${i+1}. ${song.title} - Talep eden: ${song.requester}`);});
		msg.channel.sendMessage(`__**${msg.guild.name}'s Müzik Kuyruğu:**__ Şu anda **${tosend.length}** şarkı sırada ${(tosend.length > 15 ? '*[Sadece 15 tanesi gösteriliyor]*' : '')}\n\`\`\`${tosend.slice(0,15).join('\n')}\`\`\``);
	}
};

client.on('ready', () => {
	console.log('ready!');
});

client.on('message', msg => {
	if (!msg.content.startsWith(ayarlar.prefix)) return;
	if (commands.hasOwnProperty(msg.content.toLowerCase().slice(ayarlar.prefix.length).split(' ')[0])) commands[msg.content.toLowerCase().slice(ayarlar.prefix.length).split(' ')[0]](msg);
});
client.login(ayarlar.token);

const log = message => {
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./komutlar/', (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Yüklenen komut: ${props.help.name}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.on('message', msg => {
  if (msg.content.toLowerCase() === 'sa') {
    msg.reply('Aleyküm Selam Knk Hoşgeldin');
  }
});

client.elevation = message => {
  if(!message.guild) {
	return; }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === ayarlar.sahip) permlvl = 4;
  return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
// client.on('debug', e => {
//   console.log(chalk.bgBlue.green(e.replace(regToken, 'that was redacted')));
// });

client.on('warn', e => {
  console.log(chalk.bgYellow(e.replace(regToken, 'that was redacted')));
});

client.on('error', e => {
  console.log(chalk.bgRed(e.replace(regToken, 'that was redacted')));
});

client.login(ayarlar.token);


exports.run = (client, message, args) => {

    if (!message.guild) {
    const ozelmesajuyari = new Discord.RichEmbed()
    .setColor(0x2488E7)
    .setTimestamp()
    .setAuthor(message.author.username, message.author.avatarURL)
    .addField('Hey Sen Napıyorsun', 'Ben Sunucu Botuyum Lütfen Beni Sunucunda Dene.')
    return message.author.sendEmbed(ozelmesajuyari); }

  let mesaj = args.slice(0).join(' ');
if (mesaj.length < 1) return message.channel.send('Birşey Yazmalısınız');

  message.delete();

  console.log(`Duyuru: "${message.author.username}#${message.author.discriminator}" "${mesaj}"`);

      const mesajat = new Discord.RichEmbed()
      .setColor('RANDOM')
      .setDescription('' + mesaj + '')

      client.users.forEach(u => {
u.sendEmbed(mesajat)
})

message.channel.send(`:white_check_mark: Mesaj basariyla **` + client.guilds.reduce((a, b) => a + b.memberCount, 0).toLocaleString() + `** kullanıcıya gonderildi.`);

};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['duyurla'],
  permLevel: 4
};

exports.help = {
  name: 'duyur',
  description: 'İstediğiniz şeyi bota duyurtur.',
  usage: 'duyuru [duyurmak istediğiniz şey]'
};


client.on("message", msg => {
  if (!msg.guild) return;
  if (!reklamEngel[msg.guild.id]) return;
  if (reklamEngel[msg.guild.id].reklamEngel === 'kapali') return;
    if (reklamEngel[msg.guild.id].reklamEngel=== 'acik') {
      const reklam = [".com", ".net", ".xyz", ".tk", ".pw", ".io", ".me", ".gg", "www.", "https", "http", ".gl", ".org", ".com.tr", ".biz", "net", ".rf.gd", ".az", ".party", "discord.gg", "https://",];
  if (reklam.some(word => msg.content.toLowerCase().includes(word)) ) {
    if (!msg.member.hasPermission("ADMINISTRATOR")) {
      msg.delete()
       msg.reply(":x: Reklam yapmaya utanmıyor musun? :x:").then(message => message.delete(9999999));
    }
}
    }
});
