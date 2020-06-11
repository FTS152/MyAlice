const info = require("../info.js");
const { isEmpty } = require("lodash");
const UPDATEJSONFILE = require("update-json-file");

const basic_skill = ["雨緣", "火元素", "神聖術", "金木樨之劍"];

exports.check = (user, skill_set, sendMessage) => {
  const battle_skill = info.get_battle_skill(user);
  if (isEmpty(battle_skill)) {
    sendMessage(`查無帳號或是尚未設定技能組合！`);
    return;
  }
  const skills_msg = basic_skill.concat(battle_skill).join("、");
  const msg = `${user}的戰鬥技能組合為：${skills_msg}`;
  sendMessage(msg);
  return;
};

exports.edit = (user, skill_set, sendMessage) => {
  const user_skill = info.get_skill(user);
  if (!skill_set) {
    sendMessage(`請確認技能名稱是否正確以及是否用"、"符號區隔`);
    return;
  }
  const skills = skill_set
    .split("、")
    .filter((skill) => !basic_skill.includes(skill)); // ignore alice basic skills
  if (skills.length > 6) {
    sendMessage(`最多設定6個自選技能！`);
    return;
  }
  for (const skill of skills) {
    if (!user_skill.includes(skill)) {
      sendMessage(
        `不可設定角色未持有或不存在的技能！(請確認技能名稱是否正確以及是否用"、"符號區隔)`
      );
      return;
    }
  }
  UPDATEJSONFILE("./user.json", (database) => {
    // get user refer
    const user_data = database.find((item) => item.user === user);
    if (!user_data) {
      sendMessage(`查無此帳號！`);
      return;
    }
    user_data.battle_skill = skills;
    sendMessage(`修改成功，請使用$skill check進行確認`);
    return database;
  });
};

exports.help_text = `\`\`\`
編輯可在戰鬥中使用的技能，加上愛麗絲原本持有的 4 個技能後最多可再持有 6 個
若不設定持有技能則會使用最先取得的技能進行戰鬥
備註：BOSS戰依然可以使用全技能
可使用指令如下：

$skill check    (查看自己的技能組合)
$skill edit [技能1、技能2、技能3、技能4]   (編輯技能組合)
\`\`\``;
