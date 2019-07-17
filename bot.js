const Discord = require('discord.js');
const client = new Discord.Client();
const Enmap = require('enmap');
const EnmapLevel = require('enmap-level');
const token = require('./token.json');
const xp = require('./xp.json');
const fs = require("fs");

client.admins = [];
client.code = new Enmap({provider: 
new EnmapLevel({name: "codes"})});
client.premiumusers = new Enmap({provider: new EnmapLevel({name: "premusers"})});
client.db1 = new Enmap({provider: new EnmapLevel({name: "blacklisted"})});
client.group = new Enmap({provider: new EnmapLevel({name: "groupid"})});
client.redcodes = new Enmap({provider: new EnmapLevel({name: "redeemedcodes"})});
client.cookie = new Enmap({provider: new EnmapLevel({name: "cookie"})});
client.maxrank = new Enmap({provider: new EnmapLevel({name: "maximumrank"})});
client.minrnak = new Enmap({provider: new EnmapLevel({name: "minimumrank"})});
client.prefix = new Enmap({provider: new EnmapLevel({name: "prefix"})});
client.logs = new Enmap({provider: new EnmapLevel({name: "ranking"})});
client.warnings = new Enmap({provider: new EnmapLevel({name: "warning"})});
client.xp = new Enmap({provider: new EnmapLevel({name: "XP"})});
client.levelsystem = new Enmap({provider: new EnmapLevel({name: "levelsystem"})});
client.db = new Enmap({provider: new EnmapLevel({name: "users"})});
client.setupcmd = new Enmap({provider: new EnmapLevel({name: "setuplog"})});
client.nickname = new Enmap({provider: new EnmapLevel({name: "names"})});

// const enmap = client.levelsystem;

client.on("ready", () => {
  console.log(`[READY] ${client.user.tag}, ready to serve ${client.users.size} users in ${client.guilds.size} servers.`); 
  client.user.setActivity(`${client.guilds.size} servers and ${client.users.size} users!`, { type: 'WATCHING' })
}); 

client.on("guildCreate", (guild) => {

  if(client.redcodes.has(guild.ownerID)) {
    return;
  }
  if(!client.redcodes.has(guild.ownerID)) {
    guild.leave().then(g => console.log(`Left the guild ${g}`)).catch(console.error)
    return;
  }
})

client.on('message', async message => {
  if(message.author.bot) return;

  var count = client.redcodes.get(message.author.id);
  setInterval(() => {
      count -= 1;
      client.redcodes.set(message.author.id, count)
  }, 86400000);

        // if(enmap.has(message.guild.id)) {
        //   let xpAdd = Math.floor(Math.random() * 7) + 8;

        //   if(!xp[message.author.id]){
        //     xp[message.author.id] = {
        //       xp: 0,
        //       level: 1
        //     };
        //   }
        
        
        //   let curxp = xp[message.author.id].xp;
        //   let curlvl = xp[message.author.id].level;
        //   let nxtLvl = xp[message.author.id].level * 300;
        //   xp[message.author.id].xp =  curxp + xpAdd;
        //   if(nxtLvl <= xp[message.author.id].xp){
        //     xp[message.author.id].level = curlvl + 1;
  
        //     let lvlup = new Discord.MessageEmbed()
        //     .setTitle("Level up!")
        //     .setColor("GREEN")
        //     .addField("New Level", curlvl + 1)
        //     .addField("Old Level", curlvl);
  
        //     message.reply(lvlup)
        //   }
        //   fs.writeFile("./xp.json", JSON.stringify(xp), (err) => {
        //     if(err) console.log(err)
        //   });
        // }
        // if(!enmap.has(message.guild.id)) {
        //   console.log(message.guild.id + ' has there leveling system disabled!')
        // }

         let prefix = client.prefix.get(message.guild.id) || "!";

        let msg = message.content.toLowerCase();
        let args = message.content.slice(prefix.length).trim().split(" ");
        let cmd = args.shift().toLowerCase();




        if (!message.content.startsWith(prefix)) return;
    
             try {
                let cmdFile = require(`./commands/${cmd}.js`);
         
                cmdFile.run(Discord, client, message, args);   
                
             } catch(e) {
      console.log(e)
             }
    }
)

client.login(token.token);