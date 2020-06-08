const FS = require("fs");
var info = require("../info.js");
const UPDATEJSONFILE = require("update-json-file");

exports.edit = function (user, mode, skill_set, callback) {
  switch (mode) {
    case "check":
      var database = JSON.parse(FS.readFileSync("./user.json", "utf8"));
      var result;
      for (var i = 0; i < database.length; i++) {
        if (database[i]["user"] == user) {
          result = database[i]["battle_skill"];
        }
      }
      if (result) {
        var msg = `${user}的戰鬥技能組合為：雨緣、火元素、神聖術、金木樨之劍`;
        for (var j = 0; j < result.length; j++) {
          msg = msg.concat(`、${result[j]}`);
        }
        callback(msg);
      } else {
        callback(`查無帳號或是尚未設定技能組合！`);
      }
      break;
    case "edit":
      var user_skill = info.get_skill(user);
      var user_ex = 0;
      var ill = 0;
      if (!skill_set) {
        callback(`請確認技能名稱是否正確以及是否用"、"符號區隔`);
        break;
      }
      var skills = skill_set.split("、");
      if (skills.length > 6) {
        callback(`最多設定6個自選技能！`);
        break;
      }
      for (var j = 0; j < skills.length; j++) {
        if (user_skill.indexOf(skills[j]) == -1) {
          ill = 1;
          callback(
            `不可設定角色未持有或不存在的技能！(請確認技能名稱是否正確以及是否用"、"符號區隔)`
          );
          break;
        }
      }
      if (ill) break;
      UPDATEJSONFILE("./user.json", (database) => {
        for (var i = 0; i < database.length; i++) {
          if (database[i]["user"] == user) {
            database[i]["battle_skill"] = skills;
            user_ex = 1;
          }
        }
        if (!user_ex) {
          callback(`查無此帳號！`);
        } else {
          callback(`修改成功，請使用$skill check進行確認`);
        }
        return database;
      });
      break;
    default:
      callback(
        `\`\`\`編輯可在戰鬥中使用的技能，加上愛麗絲原本持有的 4 個技能後最多可再持有 6 個\n若不設定持有技能則會使用最先取得的技能進行戰鬥\n備註：BOSS戰依然可以使用全技能\n可使用指令如下：\n\n$skill check    (查看自己的技能組合)\n$skill edit [技能1、技能2、技能3、技能4]   (編輯技能組合)\`\`\``
      );
      break;
  }
};
