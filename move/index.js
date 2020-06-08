const move = require("./move.js");

const execute = (msgInfo, args) => {
  const { username, sendMessage } = msgInfo;
  move.practice(username, args[1], sendMessage);
};

module.exports = {
  name: "move",
  describe: "行動",
  usage: "[狩獵野兔/自主訓練/外出野餐/汁妹/做善事/坐下休息/釣魚/修行/哭啊]",
  coolDown: 3,
  aliases: [],
  execute,
};
