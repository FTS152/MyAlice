var info = require('./info.js');

exports.practice = function(user, move, callback){

	move_out = {
		'狩獵野兔' : getRndInteger(15, 20),
		'自主訓練' : 15,
		'外出野餐' : getRndInteger(13, 20),
		'汁妹'	  : 16,
		'坐下休息' : 15,
		'做善事'	  : 18,
		'釣魚' 	  : 15
	}

	if (!move_out.hasOwnProperty(move)){
		callback('沒有這個行動！')
	}
	else{
		info.move_cooldown(user, function(canMove, cool){
			if(!canMove){
				callback(`${user} 的行動CD還在冷卻中，還有 ${cool} 秒才能再次行動 \n`)
			}else{
				var e = move_out[move]
				var skill
				msg = `${user}行動成功！獲得了 ${e} 點經驗值`
				var level = Math.random() < 0.1
				if (level){
					msg = msg.concat(`，等級已提升！能力變化如下：\nHP +30\n攻擊 +2\n防禦 +3\n體力 +3\n敏捷 +2\n反應速度 +1\n技巧 +3\n智力 +3\n幸運 +2\n`)
				}
				var sun = Math.random() < 0.05
				if (sun && move=='汁妹'){
					msg = msg.concat(`\n遇見了 天野陽菜 ！${user}的愛麗絲學會閉上眼祈禱，似乎有什麼意外的作用......`)
					skill = '天野陽菜'
				}
				var g = Math.random() < 0.03
				if (g && move=='汁妹'){
					msg = msg.concat(`\n好了啦別再汁了，汁妹只會出陽菜啦= =`)
				}		
				var peko = Math.random() < 0.05
				if (peko && move=='狩獵野兔'){
					msg = msg.concat(`\n遇見了 兔田ぺこら ，${user}的愛麗絲變成HOLOLIVE的DD了`)
					skill = '兔田ぺこら'
				}
				var giant = Math.random() < 0.05
				if (peko && move=='坐下休息'){
					msg = msg.concat(`\n遇見了 利維爾兵長 ！${user}的愛麗絲學會如何使用立體機動裝置了`)
					skill = '立體機動裝置'
				}
				var tea = Math.random() < 0.05
				if (tea && move=='做善事'){
					msg = msg.concat(`\n遇見了 茶渡泰虎 ！他徹底地鍛鍊${user}的愛麗絲，愛麗絲學會了「魔人的一擊」`)
					skill = '魔人的一擊'
				}
				var fish = Math.random() < 0.1
				if (fish && move=='釣魚'){
					msg = msg.concat(`\n釣到了 努西，被${user}的愛麗絲成功收服了`)
					skill = '努西'
				}
				var slash1 = Math.random()< 0.1
				if (slash1 && move=='自主訓練'){
					msg = msg.concat(`\n${user}的愛麗絲學會了劍技「旋風」！`)
					skill = '旋風'
				}				
				info.record_move(user, skill)
				callback(msg)
			}
		})
	}
}

function getRndInteger(min, max) {
	return Math.floor(Math.random() * (max - min) ) + min;
}
