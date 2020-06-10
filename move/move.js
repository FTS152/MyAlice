const { random } = require("lodash");
const info = require("../info.js");
const event = require("./event");

exports.practice = function (user, move, sendMessage) {
  const move_out = {
    狩獵野兔: random(15, 19),
    自主訓練: 15,
    外出野餐: random(13, 19),
    汁妹: 16,
    坐下休息: 15,
    做善事: 18,
    釣魚: 15,
    修行: 7400,
    哭啊: 87,
  };

  if (!move_out[move]) {
    sendMessage("沒有這個行動！");
    return;
  }

  const { canMove, cool } = info.move_cooldown(user);
  if (!canMove) {
    sendMessage(`${user} 的行動CD還在冷卻中，還有 ${cool} 秒才能再次行動 \n`);
    return;
  }

  const exp = move_out[move];
  let skill;
  let msg = `${user}行動成功！獲得了 ${exp} 點經驗值`;
  const level = Math.random() < 0.1;
  if (level) {
    msg = msg.concat(
      `，等級已提升！能力變化如下：\nHP +30\n攻擊 +2\n防禦 +3\n體力 +3\n敏捷 +2\n反應速度 +1\n技巧 +3\n智力 +3\n幸運 +2\n`
    );
  }

  const possibleEvents = event[move];
  possibleEvents.some((event) => {
    if (Math.random() > event.prob) return false;
    msg = msg.concat(event.text(user));
    skill = event.skill;
    return true;
  });

  info.record_move(user, skill);
  sendMessage(msg);
};
