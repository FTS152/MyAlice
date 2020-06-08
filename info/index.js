const info = require("../info.js");

const execute = (msgInfo, args) => {
  const { username, mention, sendMessage } = msgInfo;
  const opp = mention || args[1];
  info.record(username, opp, sendMessage);
};

module.exports = {
  name: "info",
  describe: "查看個人資訊",
  usage: "[名字]",
  coolDown: 3,
  aliases: [],
  execute,
};
