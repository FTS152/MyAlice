var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var battle = require('./battle.js');
var move = require('./move.js');
var info = require('./info.js');
var skill = require('./skill.js');

var boss_sword = require('./boss_sword.js')
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = "debug";
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});

bot.on("ready", function (evt) {
    logger.info("Connected");
    logger.info("Logged in as: ");
    logger.info(bot.username + " - (" + bot.id + ")");
});
bot.on("message", function (user, userID, channelID, message, evt) {
    if (message.substring(0, 1) == '$') {
        let args = message.substring(1).split(' ');
        let cmd = args[0];
        let username = bot.users[userID].username

        switch(cmd) {
            case 'battle':
                var opp
                if(args.length > 1){
                    if (args[1][0] == '<'){
                        opp = getUserFromMention(args[1])
                        if(!opp){
                            opp = args[1]
                        }
                    }else{
                        opp = args[1]
                    }                    
                }

                battle.fight(username, opp, args[2], args[3], function(msg){
                    bot.sendMessage({
                        to: channelID,
                        message: msg
                    });
                })
                break;
            case 'move':
                move.practice(username, args[1], function(msg){
                    bot.sendMessage({
                        to: channelID,
                        message: msg
                    });                    
                })
                break
            case 'info':
                var opp
                if(args.length > 1){
                    if (args[1][0] == '<'){
                        opp = getUserFromMention(args[1])
                        if(!opp){
                            opp = args[1]
                        }
                    }else{
                        opp = args[1]
                    }                    
                }
                info.record(username, opp, function(msg){
                    bot.sendMessage({
                        to: channelID,
                        message: msg
                    });                      
                })
                break
            case 'boss':
                switch(args[1]) {
                    case '絕劍':
                        boss_sword.fight(username, function(msg){
                            bot.sendMessage({
                                to: channelID,
                                message: msg
                            });                    
                        })
                        break
                    default:
                        bot.sendMessage({
                            to: channelID,
                            message: '現在可以挑戰的BOSS有：\n絕劍'
                        });
                        break                    
                }
                break
            case 'skill':
                skill.edit(username, args[1], args[2], function(msg){
                    bot.sendMessage({
                        to: channelID,
                        message: msg
                    });                    
                })
                break
            case 'help':
                msg = ''
                msg = msg.concat('```\n這是由 FTS152#0862 開發的決鬥用bot [MyAlice] ，可使用指令如下：\n')
                msg = msg.concat('\n戰鬥\n$battle [你想決鬥的人] [友好切磋/認真對決/決一死戰/我要殺死你] [想和對方說的話]\n\n行動\n$move [狩獵野兔/自主訓練/外出野餐/汁妹/做善事/坐下休息/釣魚/修行/哭啊]\n\n查看個人資訊\n$info [名字]\n\n挑戰boss\n$boss [想挑戰的boss]\n\n')
                msg = msg.concat('查看與挑選戰鬥技能\n$skill [check/edit]\n\n')
                msg = msg.concat('行動 CD 為 30 秒，戰鬥 CD 為 100 秒，行動有機會拿到特殊技能在戰鬥中使用\n')
                msg = msg.concat('查看個人資訊可得知勝敗場、持有技能，但需要至少行動一次或戰鬥一次才會登錄到資料庫裡\n')
                msg = msg.concat('若有任何建議請再聯繫我，此bot的所有程式碼在 https://github.com/FTS152/MyAlice ```\n')
                bot.sendMessage({
                    to: channelID,
                    message: msg
                });              

            break;
         }

     }
});

function getUserFromMention(mention) {
    const matches = mention.match(/^<@!?(\d+)>$/);
    if (!matches) return;
    const id = matches[1];
    return bot.users[id].username;
}