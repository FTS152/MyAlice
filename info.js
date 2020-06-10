const FS = require("fs");
const UPDATEJSONFILE = require("update-json-file");
const { isEmpty } = require("lodash");

// main info comment
exports.info = {
  name: "info",
  describe: "查看個人資訊",
  usage: "[名字]",
  coolDown: 3,
  aliases: [],
  execute: (msgInfo, args) => {
    const { username, mention, sendMessage } = msgInfo;
    const opp = mention || args[1];
    exports.record(username, opp, sendMessage);
  },
};

const get_user_data = (target) => {
  const database = JSON.parse(FS.readFileSync("./user.json", "utf8"));
  const user = database.filter((item) => item.user === target)[0];
  return user || {};
};

exports.record = function (user, tar, sendMessage) {
  const target = tar || user;
  const user_data = get_user_data(target);
  if (isEmpty(user_data)) {
    sendMessage("查無資料！");
    return;
  }

  const { skill = [] } = user_data;
  const skill_msg = skill.join("、");

  let msg = "";
  msg += `${target} 一共獲勝了 ${user_data.win} 場，戰敗了 ${user_data.lose} 場,`;
  msg += ` 總計擊殺了 ${user_data.kill} 人，被殺死 ${user_data.death} 次。`;
  msg += `\n持有技能：雨緣、火元素、神聖術、金木樨之劍、${skill_msg}`;
  sendMessage(msg);
};

exports.get_skill = function (target) {
  const { skill = [] } = get_user_data(target);
  return skill;
};

exports.get_battle_skill = function (target) {
  const { battle_skill = [] } = get_user_data(target);
  return battle_skill;
};

exports.battle_cooldown = function (target) {
  const COOL = 100 * 1000;
  const m = +new Date();
  const { battle_time } = get_user_data(target);
  if (!battle_time || m - battle_time > COOL)
    return { canBattle: true, cool: 0 };
  return {
    canBattle: false,
    cool: Math.floor((battle_time + COOL - m) / 1000),
  };
};

exports.move_cooldown = function (target) {
  const COOL = 30 * 1000;
  const m = +new Date();
  const { move_time } = get_user_data(target);
  if (!move_time || m - move_time >= COOL) return { canMove: true, cool: 0 };
  return { canMove: false, cool: Math.floor((move_time + COOL - m) / 1000) };
};

exports.record_battle = function (att, def, result, death) {
  UPDATEJSONFILE("./user.json", (database) => {
    const m = +new Date();

    const write_battle = (item) => (win, lose, death, m) => {
      item.win += win ? 1 : 0;
      item.lose += lose ? 1 : 0;
      item.kill += win && death ? 1 : 0;
      item.death += lose && death ? 1 : 0;
      if (m) item.battle_time = m;
    };

    const create_new_user = (name) => ({
      user: name,
      win: 0,
      lose: 0,
      death: 0,
      kill: 0,
    });

    // get users refer
    const att_user = database.find((item) => item.user === att);
    const def_user = database.find((item) => item.user === def);

    if (att_user) write_battle(att_user)(result, !result, death, m);
    if (def_user) write_battle(def_user)(!result, result, death);
    if (att === def && !att_user && !def_user) {
      const new_user = create_new_user(att);
      write_battle(new_user)(true, true, death, m);
      database.push(new_user);
      return database;
    }
    if (!att_user) {
      const new_user = create_new_user(att);
      write_battle(new_user)(result, !result, death, m);
      database.push(new_user);
    }
    if (!def_user) {
      const new_user = create_new_user(def);
      write_battle(new_user)(!result, result, death);
      database.push(new_user);
    }

    return database;
  });
};

exports.record_move = function (user, skill) {
  UPDATEJSONFILE("./user.json", (database) => {
    const m = +new Date();
    // get user refer
    const user_data = database.find((item) => item.user === user);

    if (!user_data) {
      const new_user = {
        user: user,
        win: 0,
        lose: 0,
        death: 0,
        kill: 0,
        move_time: m,
      };
      if (skill) new_user.skill = [skill];
      database.push(new_user);
      return database;
    }

    user_data.move_time = m;
    if (skill) {
      user_data.skill = user_data.skill || []; // set default array if no skill
      if (!user_data.skill.includes(skill)) user_data.skill.push(skill);
    }
    return database;
  });
};
