var info = require('./info.js');

exports.practice = function(user, move, callback){

	move_out = {
		'狩獵野兔' : getRndInteger(15, 20),
		'自主訓練' : 15,
		'外出野餐' : getRndInteger(13, 20),
		'汁妹'	  : 16,
		'坐下休息' : 15,
		'做善事'	  : 18,
		'釣魚' 	  : 15,
		'修行'	  : 7400,
		'哭啊'	  : 87
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

				switch(move){
					case '狩獵野兔':
						var peko = Math.random() < 0.05
						if (peko){
							msg = msg.concat(`\n遇見了 兔田ぺこら ，${user}的愛麗絲變成HOLOLIVE的DD了`)
							skill = '兔田ぺこら'
							break
						}
						var rabbit = Math.random() < 0.05
						if (rabbit){
							msg = msg.concat(`\n遇見了 雜燴兔 ，${user}的愛麗絲可以像兔子一樣跳來跳去了`)
							skill = '雜燴兔'
							break
						}
						var noel = Math.random() < 0.05
						if (noel){
							msg = msg.concat(`\n遇見了 白銀ノエル ，${user}的愛麗絲把獵到的兔子做成牛丼後和她締結了友情`)
							skill = '白銀ノエル'
							break
						}
						break
					case '自主訓練':
						var president = Math.random()< 0.05
						if (president){
							msg = msg.concat(`\n${user}的愛麗絲遇見大總統，學會了最強之眼的戰鬥方式！`)
							skill = '大總統'
							break
						}
						var slash1 = Math.random()< 0.05
						if (slash1){
							msg = msg.concat(`\n${user}的愛麗絲學會了劍技「旋風」！`)
							skill = '旋風'
							break
						}
						var slash2 = Math.random()< 0.05
						if (slash2){
							msg = msg.concat(`\n${user}的愛麗絲學會了劍技「雪崩」！`)
							skill = '雪崩'
							break
						}
						break	
					case '外出野餐':
						var dead = Math.random()< 0.05
						if (dead){
							msg = msg.concat(`\n${user}的愛麗絲吃粽子時遇到潤羽るしあ，學會了死靈法術！`)
							skill = '潤羽るしあ'
							break							
						}
						var ugo = Math.random()< 0.05
						if (ugo){
							msg = msg.concat(`\n${user}的愛麗絲和尤吉歐出去野餐，愛麗絲學會了隕石衝擊！`)
							skill = '隕石衝擊'
							break
						}
						var poke = Math.random()< 0.05
						if (poke){
							msg = msg.concat(`\n${user}的愛麗絲出去野餐遇到噴火龍，噴火龍變成了愛麗絲的同伴！`)
							skill = '噴火龍'
							break							
						}
						break
					case '汁妹':
						var matsuri = Math.random() < 0.05
						if (matsuri){
							msg = msg.concat(`\n遇見了 夏色まつり ！${user}的愛麗絲體驗到了瘋狂呼吸女孩子的美妙之處`)
							skill = '夏色まつり'
							break
						}
						var sun = Math.random() < 0.05
						if (sun){
							msg = msg.concat(`\n遇見了 天野陽菜 ！${user}的愛麗絲學會閉上眼祈禱，似乎有什麼意外的作用......`)
							skill = '天野陽菜'
							break
						}
						var memory = Math.random() < 0.05
						if (memory){
							msg = msg.concat(`\n${user}的愛麗絲對桐人的思念化作了強大的力量......`)
							skill = '記憶解放'
							break
						}
						break
					case '坐下休息':
						var giant = Math.random() < 0.05
						if (giant){
							msg = msg.concat(`\n遇見了 利維爾兵長 ！${user}的愛麗絲學會如何使用立體機動裝置了`)
							skill = '立體機動裝置'
							break
						}
						break
					case '做善事':
						var tea = Math.random() < 0.05
						if (tea){
							msg = msg.concat(`\n遇見了 茶渡泰虎 ！他徹底地鍛鍊${user}的愛麗絲，愛麗絲學會了「魔人的一擊」`)
							skill = '魔人的一擊'
							break
						}
						var system = Math.random() < 0.05
						if (system){
							msg = msg.concat(`\n${user}的愛麗絲偶然發現了系統的BUG......`)
							skill = '超越系統的一擊'
							break
						}
						break					
					case '釣魚':
						var fbk = Math.random() < 0.05
						if (fbk){
							msg = msg.concat(`\n在湖邊遇見了 白上フブキ，成為了 ${user}的愛麗絲的同伴`)
							skill = '白上フブキ'
							break
						}
						var ahoy = Math.random() < 0.05
						if (ahoy){
							msg = msg.concat(`\n遇見了航行中的船長 宝鐘マリン，${user}的愛麗絲學會了海盜打招呼的方式`)
							skill = '宝鐘マリン'
							break
						}
						var fish = Math.random() < 0.1
						if (fish){
							msg = msg.concat(`\n釣到了 努西，被${user}的愛麗絲成功收服了`)
							skill = '努西'
							break
						}
						break
					case '修行':
						var fist = Math.random() < 0.05
						if (fist){
							msg = msg.concat(`\n${user}的愛麗絲遇到了神秘的石頭，它將兩把刀交給了愛麗絲......`)
							skill = '星爆氣流斬'
							break
						}
						var burst = Math.random() < 0.05
						if (burst){
							msg = msg.concat(`\n${user}的愛麗絲遇見星爆怪力，愛麗絲學會了「爆裂拳」！`)
							skill = '爆裂拳'
							break
						}
						var gun = Math.random() < 0.05
						if (gun){
							msg = msg.concat(`\n${user}的愛麗絲遇見詩乃，從她那裡學會了槍的使用方式！`)
							skill = '黑卡蒂'
							break
						}
						break
					case '哭啊':
						var cliff = Math.random() < 0.05
						if (cliff){
							msg = msg.concat(`\n${user}的愛麗絲遇見茅場晶彥的意識體，他將希茲克利夫的帳號借給了愛麗絲`)
							skill = '希茲克利夫'
							break
						}
						var coco = Math.random() < 0.05
						if (coco){
							msg = msg.concat(`\n${user}的愛麗絲開直播時被桐生ココ亂入，直播被BAN了`)
							skill = '桐生ココ'
							break
						}
						var sister = Math.random() < 0.05
						if (sister){
							msg = msg.concat(`\n${user}的愛麗絲遇見了桐人的妹妹，但她的樣子好像有點奇怪......`)
							skill = '直葉'
							break
						}
						var cry = Math.random() < 0.03
						if (cry){
							msg = msg.concat(`\n https://tenor.com/view/otaku-gif-10276143 `)
							break
						}
						break
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
