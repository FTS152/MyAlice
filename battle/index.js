const battle = require("./battle.js");

const execute = (msgInfo, args) => {
  const { username, mention, sendMessage } = msgInfo;
  const opp = mention || args[1];
  battle.fight(username, opp, args[2], args[3], sendMessage);
};

module.exports = {
  name: "battle",
  describe: "戰鬥",
  usage:
    "[你想決鬥的人] [友好切磋/認真對決/決一死戰/我要殺死你] [想和對方說的話]",
  coolDown: 3,
  aliases: [],
  execute,
};
