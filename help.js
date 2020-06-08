const msg = `
\`\`\`
這是由 FTS152#0862 開發的決鬥用bot [MyAlice] ，可使用指令如下：

戰鬥
$battle [你想決鬥的人] [友好切磋/認真對決/決一死戰/我要殺死你] [想和對方說的話]

行動
$move [狩獵野兔/自主訓練/外出野餐/汁妹/做善事/坐下休息/釣魚/修行/哭啊]

查看個人資訊
$info [名字]

挑戰boss
$boss [想挑戰的boss]

查看與挑選戰鬥技能
$skill [check/edit]

行動 CD 為 30 秒，戰鬥 CD 為 100 秒，行動有機會拿到特殊技能在戰鬥中使用
查看個人資訊可得知勝敗場、持有技能，但需要至少行動一次或戰鬥一次才會登錄到資料庫裡
若有任何建議請再聯繫我，此bot的所有程式碼在
https://github.com/FTS152/MyAlice 
\`\`\`
`;

const execute = (msgInfo, args) => {
  const { sendMessage } = msgInfo;
  sendMessage(msg);
};

module.exports = {
  name: "help",
  describe: "指令",
  usage: "",
  aliases:[],
  execute,
};
