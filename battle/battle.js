const _ = require("lodash");
const info = require("../info.js");
const {
  type,
  magic_skill: magic_skill_origin,
  sword_skill: sword_skill_origin,
  defense_skill: defense_skill_origin,
  MAX_SKILL,
} = require("./params");

let magic_skill = { ...magic_skill_origin };
let sword_skill = { ...sword_skill_origin };
let defense_skill = { ...defense_skill_origin };

exports.fight = function (user, opponent, mode, shout, sendMessage) {
  if (!type[mode]) return sendMessage("沒有這個對戰模式！");
  const death = type[mode];
  const m = new Date();
  const { canBattle, cool } = info.battle_cooldown(user);
  if (!canBattle) {
    const msg = `${user} 的戰鬥CD還在冷卻中，還有 ${cool} 秒才能再次發起戰鬥 \n`;
    sendMessage(msg);
    return;
  }

  var user_hp = 3250;
  var opp_hp = 3250;
  var user_g = 0;
  var opp_g = 0;
  var msg = `\`\`\`diff\n${user} 向 ${opponent} 發起 ${mode} ${m.toLocaleString()} \n`;
  if (shout) {
    msg = msg.concat(`${user} 向 ${opponent} 喊道：「${shout}」\n`);
  }
  var user_skill = info.get_battle_skill(user);
  var oppo_skill = info.get_battle_skill(opponent);
  if (!user_skill.length) {
    user_skill = info.get_skill(user) || [];
    user_skill = user_skill.slice(0, MAX_SKILL);
  }
  if (!user_skill.length) {
    oppo_skill = info.get_skill(opponent) || [];
    oppo_skill = oppo_skill.slice(0, MAX_SKILL);
  }

  round = 0;
  while (user_hp > 0 && opp_hp > 0) {
    skill_use = skill();
    if (round % 2 === 0) {
      if (skill_use[0] && user_g == 0) {
        msg = msg.concat(
          `-「Enhance Armament」${user}解放了金木樨之劍，刀身化作無數的碎片\n`
        );
        user_g = 1;
      }
      round_data = round_fight(
        user,
        opponent,
        skill_use,
        user_g,
        opp_g,
        user_hp,
        user_skill,
        oppo_skill
      );
      msg = msg.concat(round_data["round_msg"]);
      user_hp = user_hp + round_data["heal"];
      opp_hp = opp_hp - round_data["damage"];
    } else {
      if (skill_use[0] && opp_g == 0) {
        msg = msg.concat(
          `-「Enhance Armament」${opponent}解放了金木樨之劍，刀身化作無數的碎片\n`
        );
        opp_g = 1;
      }
      round_data = round_fight(
        opponent,
        user,
        skill_use,
        opp_g,
        user_g,
        opp_hp,
        oppo_skill,
        user_skill
      );
      msg = msg.concat(round_data["round_msg"]);
      opp_hp = opp_hp + round_data["heal"];
      user_hp = user_hp - round_data["damage"];
    }
    round = round + 1;
  }
  if (user_hp < 0) {
    msg = msg.concat(`${user}倒下了， ${opponent}剩餘 ${opp_hp} 點血量\n`);
    if (Math.random() < death) {
      msg = msg.concat(`${user}被擊殺身亡了\n`);
      info.record_battle(user, opponent, 0, 1);
    } else {
      info.record_battle(user, opponent, 0, 0);
    }
  } else if (opp_hp < 0) {
    msg = msg.concat(`${opponent}倒下了， ${user}剩餘 ${user_hp} 點血量\n`);
    if (Math.random() < death) {
      msg = msg.concat(`${opponent}被擊殺身亡了\n`);
      info.record_battle(user, opponent, 1, 1);
    } else {
      info.record_battle(user, opponent, 1, 0);
    }
  }
  msg = msg.concat("```");
  //reset
  magic_skill = { ...magic_skill_origin };
  sword_skill = { ...sword_skill_origin };
  defense_skill = { ...defense_skill_origin };
  sendMessage(msg);
};

function round_fight(
  att,
  def,
  skill_use,
  att_g,
  def_g,
  cur_hp,
  att_skill,
  def_skill
) {
  let damage = 0;
  let heal = 0;
  let r = "";

  if (skill_use[1]) {
    //fire
    r = r.concat(
      `「Generate thermal element, arrow shape, discharge」${att}發射火元素攻擊`
    );
    h = hit(150, 400, def, def_g, def_skill);
    damage = damage + h["damage"];
    r = r.concat(h["msg"]);
  }
  if (skill_use[2]) {
    rand = Math.random();
    var miss = rand < 0.5 && rand > 0.01;
    var blow = rand < 0.01;
    if (miss) {
      r = r.concat(`-${att}的飛龍雨緣在空中飛了一圈但是沒有吐息，哭啊\n`);
    } else if (blow) {
      h = getRndInteger(400, 2000);
      heal = heal - h;
      r = r.concat(
        `-${att}的飛龍雨緣從空中發射吐息攻擊但是炸膛了，對自己造成 ${h} 點傷害\n`
      );
    } else {
      r = r.concat(`-${att}的飛龍雨緣從空中發射吐息攻擊`);
      h = hit(900, 3000, def, def_g, def_skill);
      damage = damage + h["damage"];
      r = r.concat(h["msg"]);
    }
  }
  if (skill_use[3] && cur_hp < 3250) {
    heal = heal + Math.min(3250 - cur_hp, getRndInteger(100, 300));
    r = r.concat(
      `「Generate luminous element」${att}用神聖術恢復了 ${heal} 點生命值\n`
    );
  }
  m = magic(att, def, def_g, att_skill, def_skill);
  r = r.concat(m["msg"]);
  damage = damage + m["damage"];

  a = attack(att, def, att_g, def_g, att_skill, def_skill);
  r = r.concat(a["msg"]);
  damage = damage + a["damage"];

  return { round_msg: r, damage, heal };
}

function magic(att, def, def_g, skill, def_skill) {
  let cast;
  let damage = 0;
  let r = "";
  for (var i = 0; i < skill.length; i++) {
    if (!magic_skill.hasOwnProperty(skill[i])) continue;
    cast = Math.random() < magic_skill[skill[i]];
    if (!cast) continue;
    switch (skill[i]) {
      case "天野陽菜":
        d = getRndInteger(1600, 2600);
        damage = damage + d;
        r = r.concat(
          `-${att}嚇得蹲下閉眼祈禱，突然打雷擊中${def}造成 ${d} 點傷害\n`
        );
        break;
      case "兔田ぺこら":
        defense_skill = {
          立體機動裝置: 0.08,
          雜燴兔: 0.08,
          宝鐘マリン: 0.125,
          大總統: 0.08,
          白銀ノエル: 0.125,
          希茲克利夫: 0.08,
          極限輔助系統: 0.75,
        };
        r = r.concat(
          `-「哈↑哈↑哈↑哈↑哈↑」兔田ぺこら發出嘲笑，強化Hololive系列防禦技能，並削弱了其他的防禦技能\n`
        );
        magic_skill["兔田ぺこら"] = 0;
        break;
      case "努西":
        r = r.concat(`${att}的寵物努西使出咬碎`);
        h = hit(400, 1400, def, def_g, def_skill);
        damage = damage + h["damage"];
        r = r.concat(h["msg"]);
        break;
      case "記憶解放":
        let miss = Math.random() < 0.8;
        if (miss) {
          r = r.concat(
            `-「Release Recollection」${att}聚集了附近的神聖力，但因為周遭神聖力不足沒有成功\n`
          );
        } else {
          d = getRndInteger(100000, 200000);
          damage = damage + d;
          r = r.concat(
            `-「Release Recollection」${att}聚集了附近的神聖力，使用金木樨射出毀滅光線，對${def}造成 ${d} 點傷害\n`
          );
        }
        break;
      case "噴火龍":
        let firemiss = Math.random() < 0.25;
        if (firemiss) {
          r = r.concat(
            `-${att}的噴火龍從空中發射火球，但打中了雨緣所以沒有命中敵人\n`
          );
        } else {
          r = r.concat(`-${att}的噴火龍從空中發射火球`);
          h = hit(500, 1000, def, def_g, def_skill);
          damage = damage + h["damage"];
          r = r.concat(h["msg"]);
        }
        break;
      case "白上フブキ":
        let has_skill = [];
        for (var i = 0; i < def_skill.length; i++) {
          if (sword_skill.hasOwnProperty(def_skill[i])) {
            has_skill.push(def_skill[i]);
          }
        }
        if (has_skill.length == 0) {
          r = r.concat(
            `-「I'm Scatman」白上フブキ開始唱歌，不過 ${def} 已經沒有劍技可以封印了\n`
          );
        } else {
          u = getRndInteger(0, has_skill.length);
          delete sword_skill[has_skill[u]];
          r = r.concat(
            `-「I'm Scatman」白上フブキ開始唱歌，技能 ${has_skill[u]} 被封印了\n`
          );
        }
        magic_skill["白上フブキ"] = 0;
        break;
      case "桐生ココ":
        damage = Math.floor(damage * 2);
        r = r.concat(
          `「FUCK YOU!」桐生ココ剝奪了${def}的收益化，${def}本回合受到的魔法傷害增加了\n`
        );
        break;
      case "直葉":
        r = r.concat(
          `-「接近哥哥的狐狸精...一個都不能放過」${att}的直葉拿起小刀刺向${def}`
        );
        h = hit(100, 300, def, def_g, def_skill);
        damage = damage + h["damage"];
        r = r.concat(h["msg"]);
        counter = 2;
        while (Math.random() < 0.7) {
          r = r.concat(
            `「殺了你殺了你殺了你」直葉拿小刀瘋狂攻擊，第 ${counter} 擊`
          );
          h = hit(50, 100, def, def_g, def_skill);
          damage = damage + h["damage"];
          r = r.concat(h["msg"]);
          counter = counter + 1;
        }
        break;
      case "潤羽るしあ":
        let colamiss = Math.random() < 0.5;
        if (colamiss) {
          r = r.concat(`潤羽るしあ詠唱死靈法術，但被噴出的可樂強制中斷了\n`);
        } else {
          r = r.concat(`潤羽るしあ詠唱死靈法術`);
          h = hit(100, 700, def, def_g, def_skill);
          damage = damage + h["damage"];
          r = r.concat(h["msg"]);
        }
        break;
      case "夏色まつり":
        r = r.concat(`「FBK！FBK！FBK！」${att}的夏色まつり朝${def}胡亂攻擊\n`);
        for (var i = 1; i < 5; i++) {
          r = r.concat(`夏色まつり的第 ${i} 擊`);
          h = hit(100, 150, def, def_g, def_skill);
          damage = damage + h["damage"];
          r = r.concat(h["msg"]);
        }
        break;
    }
  }
  return { msg: r, damage: damage };
}

function attack(att, def, att_g, def_g, skill, def_skill) {
  let cast;
  let damage = 0;
  let r = "";
  let has_skill = ["普攻", "普攻", "普攻", "普攻", "普攻", "普攻"];
  for (var i = 0; i < skill.length; i++) {
    if (sword_skill.hasOwnProperty(skill[i])) {
      has_skill.push(skill[i]);
    }
  }
  u = getRndInteger(0, has_skill.length);
  switch (has_skill[u]) {
    case "普攻":
      if (att_g) {
        r = r.concat(`${att}用解放的無數的刀身碎片攻擊`);
      } else {
        r = r.concat(`${att}攻擊`);
      }
      h = hit(400, 600, def, def_g, def_skill);
      damage = damage + h["damage"];
      r = r.concat(h["msg"]);
      if (att_g) {
        counter = 2;
        while (Math.random() < 0.5) {
          r = r.concat(`${att}繼續追加第 ${counter} 擊`);
          h = hit(150, 350, def, def_g, def_skill);
          damage = damage + h["damage"];
          r = r.concat(h["msg"]);
          counter = counter + 1;
        }
      } else {
        counter = 2;
        while (Math.random() < 0.1) {
          r = r.concat(`${att} ${counter} 連擊！`);
          h = hit(400, 600, def, def_g, def_skill);
          damage = damage + h["damage"];
          r = r.concat(h["msg"]);
          counter = counter + 1;
        }
      }
      break;
    case "旋風":
      r = r.concat(`${att}使出了劍技「旋風」`);
      h = hit(700, 2300, def, def_g, def_skill);
      damage = damage + h["damage"];
      r = r.concat(h["msg"]);
      break;
    case "魔人的一擊":
      miss = Math.random() < 0.8;
      r = r.concat(`${att}以惡魔的左臂使出了「魔人的一擊」`);
      if (miss) {
        r = r.concat(`，但因為無法控制過於強大的力量而打偏了\n`);
      } else {
        h = hit(10000, 20000, def, def_g, def_skill);
        damage = damage + h["damage"];
        r = r.concat(h["msg"]);
      }
      break;
    case "隕石衝擊":
      r = r.concat(`${att}使出了隕石衝擊`);
      h = hit(1000, 2000, def, def_g, def_skill);
      damage = damage + h["damage"];
      r = r.concat(h["msg"]);
      break;
    case "雪崩":
      r = r.concat(`${att}使出了雙手劍技「雪崩」`);
      h = hit(1200, 1500, def, def_g, def_skill);
      damage = damage + h["damage"];
      r = r.concat(h["msg"]);
      break;
    case "爆裂拳":
      r = r.concat(`${att}使出了爆裂拳`);
      h = hit(1000, 2000, def, def_g, def_skill);
      damage = damage + h["damage"];
      r = r.concat(h["msg"]);
      break;
    case "星爆氣流斬":
      r = r.concat(`-${att}拔出了第二把刀\n${att}：「星爆...氣流斬」\n`);
      for (var i = 1; i < 17; i++) {
        r = r.concat(`${att}的第 ${i} 擊`);
        h = hit(0, 250, def, def_g, def_skill);
        damage = damage + h["damage"];
        r = r.concat(h["msg"]);
      }
      break;
    case "聖母聖詠":
      r = r.concat(`-${att}使出了聖母聖詠\n`);
      for (var i = 1; i < 12; i++) {
        r = r.concat(`${att}的第 ${i} 擊`);
        h = hit(100, 250, def, def_g, def_skill);
        damage = damage + h["damage"];
        r = r.concat(h["msg"]);
      }
      break;
    case "黑卡蒂":
      rand = Math.random();
      var miss = rand < 0.7 && rand > 0.05;
      var shut = rand < 0.05;
      r = r.concat(`${att}掏出黑卡蒂開槍射擊`);
      if (miss) {
        r = r.concat(`，但因為不熟練而沒有打中\n`);
      } else if (shut) {
        r = r.concat(`成功爆頭`);
        h = hit(10000, 15000, def, def_g, def_skill);
        damage = damage + h["damage"];
        r = r.concat(h["msg"]);
      } else {
        h = hit(1000, 2000, def, def_g, def_skill);
        damage = damage + h["damage"];
        r = r.concat(h["msg"]);
      }
      break;
    case "超越系統的一擊":
      miss = Math.random() < 0.9;
      if (miss && att != "FTS152") {
        r = r.concat(`-${att}嘗試使出超越系統的一擊，但被GM發現而被無效化了\n`);
      } else {
        d = getRndInteger(1000000, 2000000);
        damage = damage + d;
        r = r.concat(`-${att}使出超越系統的一擊，${def}倒下了\n`);
      }
      break;
  }
  return { msg: r, damage: damage };
}

function defense(def, skill) {
  let cast;
  let de = false;
  let r = "";
  for (var i = 0; i < skill.length; i++) {
    if (!defense_skill.hasOwnProperty(skill[i])) continue;
    cast = Math.random() < defense_skill[skill[i]];
    if (!cast) continue;
    switch (skill[i]) {
      case "立體機動裝置":
        r = r.concat(`，但是${def}使用立體機動裝置閃開了\n`);
        de = true;
        break;
      case "雜燴兔":
        r = r.concat(`，但是${def}一跳躲開了\n`);
        de = true;
        break;
      case "宝鐘マリン":
        r = r.concat(`，但是${def}大喊一聲「Ahoy!」後閃過了\n`);
        de = true;
        break;
      case "大總統":
        r = r.concat(`，但是${def}用最強之眼看穿攻擊輕鬆閃過了\n`);
        de = true;
        break;
      case "白銀ノエル":
        r = r.concat(`，但是${def}的夥伴白銀ノエル跳出來抵擋了攻擊\n`);
        de = true;
        break;
      case "希茲克利夫":
        r = r.concat(`，但是茅場晶彥化身希茲克利夫用盾牌抵擋了攻擊\n`);
        de = true;
        break;
      case "極限輔助系統":
        r = r.concat(`，但是${def}開啟極限輔助系統輕鬆迴避了\n`);
        de = true;
        break;
    }
    break;
  }
  return { msg: r, defense: de };
}

function dodge_output(def) {
  return `，但是被${def}閃過了\n`;
}

function block_output(def) {
  return `，但是${def}用解放的刀身擋下了攻擊\n`;
}

function hit(low, high, def, def_g, def_skill) {
  let damage = 0;
  let r = "";
  dodge = Math.random() < 0.05;
  block = Math.random() < 0.25;
  critical = Math.random() < 0.2;
  d = defense(def, def_skill);
  if (dodge) {
    r = r.concat(dodge_output(def));
  } else if (def_g && block) {
    r = r.concat(block_output(def));
  } else if (d["defense"]) {
    r = r.concat(d["msg"]);
  } else {
    if (critical) {
      d = Math.floor(getRndInteger(low, high) * 2);
      damage = damage + d;
      r = r.concat(`命中要害，對${def}造成 ${d} 點傷害\n`);
    } else {
      d = getRndInteger(low, high);
      damage = damage + d;
      r = r.concat(`，對${def}造成 ${d} 點傷害\n`);
    }
  }
  return { msg: r, damage: damage };
}

function skill() {
  let enhance = Math.random() < 0.3;
  let fire = Math.random() < 0.15;
  let drake = Math.random() < 0.15;
  let heal = Math.random() < 0.1;
  let a = [enhance, fire, drake, heal];
  return a;
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
