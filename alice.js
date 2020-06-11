const Discord = require("discord.io");
const logger = require("winston");
const auth = require("./auth.json");
const battle = require("./battle");
const move = require("./move");
const { info } = require("./info");
const skill = require("./skill");
const boss = require("./boss");
const help = require("./help");

const commands = { battle, move, info, skill, boss, help };

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console(), {
  colorize: true,
});
logger.level = "debug";
// Initialize Discord Bot
const bot = new Discord.Client({
  token: auth.token,
  autorun: true,
});

bot.on("ready", function (evt) {
  logger.info("Connected");
  logger.info("Logged in as: ");
  logger.info(bot.username + " - (" + bot.id + ")");
});

bot.on("message", function (user, userID, channelID, message, evt) {
  if (message.substring(0, 1) !== "$") return;

  const args = message
    .substring(1)
    .split(" ")
    .filter((s) => !!s.length); // filter 過濾多餘空格
  const cmd = args[0];
  if (!commands[cmd]) return;
  const username = bot.users[userID].username;
  const mention = args[1] && args[1][0] === "<" && getUserFromMention(args[1]);
  const sendMessage = (msg) => {
    // TODO: msg 超過一定長度(目測兩千)會被discord忽略
    bot.sendMessage({
      to: channelID,
      message: msg,
    });
  };

  const msgInfo = {
    user,
    userID,
    message,
    evt,
    username,
    mention,
    sendMessage,
  };

  commands[cmd].execute(msgInfo, args);
});

function getUserFromMention(mention) {
  const matches = mention.match(/^<@!?(\d+)>$/);
  if (!matches) return;
  const id = matches[1];
  return bot.users[id].username;
}
