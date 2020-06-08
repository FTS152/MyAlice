const boss_sword = require("./boss_sword.js");

const execute = (msgInfo, args) => {
  const { username, sendMessage } = msgInfo;
  switch (args[1]) {
    case "絕劍":
      boss_sword.fight(username, sendMessage);
      break;
    default:
      sendMessage("現在可以挑戰的BOSS有：\n絕劍");
      break;
  }
};

module.exports = {
  name: "boss",
  describe: "挑戰boss",
  usage: "[想挑戰的boss]",
  coolDown: 3,
  aliases:[],
  execute,
};
