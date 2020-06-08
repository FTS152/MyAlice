const skill = require("./skill.js");

const execute = (msgInfo, args) => {
  const { username, sendMessage } = msgInfo;
  skill.edit(username, args[1], args[2], sendMessage);
};

module.exports = {
  name: "skill",
  describe: "查看與挑選戰鬥技能",
  usage: "[check/edit]",
  coolDown: 3,
  aliases: [],
  execute,
};
