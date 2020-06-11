const { check, edit, help_text } = require("./skill.js");

const execute = (msgInfo, args) => {
  const { username, sendMessage } = msgInfo;
  const skill = { check, edit };
  const mode = args[1]
  if (!skill[mode]) {
    sendMessage(help_text);
    return
  }
  skill[mode](username, args[2], sendMessage);
};

module.exports = {
  name: "skill",
  describe: "查看與挑選戰鬥技能",
  usage: "[check/edit]",
  coolDown: 3,
  aliases: [],
  execute,
};
