var info = require('./info.js');

const magic_skill = {"天野陽菜":0.05, "兔田ぺこら": 0.25, "努西":0.15}
const sword_skill = {"旋風":1, '魔人的一擊':1}
const defense_skill = {"立體機動裝置": 0.1}

exports.fight = function(user, opponent, mode, shout, callback){
	if(mode != '友好切磋' && mode != '認真對決' && mode != '決一死戰' && mode != '我要殺死你' ){
		callback('沒有這個對戰模式！')
	}else{
		death = {'友好切磋':0.002, '認真對決':0.05, '決一死戰':0.25, '我要殺死你':0.6}
		var m = new Date()
		info.battle_cooldown(user, function(canBattle, cool){
			if(!canBattle){
				callback(`${user} 的戰鬥CD還在冷卻中，還有 ${cool} 秒才能再次發起戰鬥 \n`)
			}else{
				var user_hp = 3250
				var opp_hp = 3250
				var user_g = 0
				var opp_g = 0
				var msg = `\`\`\`diff\n${user} 向 ${opponent} 發起 ${mode} ${m.toLocaleString()} \n`
				if (shout){
					msg = msg.concat(`${user} 向 ${opponent} 喊道：「${shout}」\n`)
				}
				var user_skill = info.get_skill(user)
				var oppo_skill = info.get_skill(opponent)
				if(!user_skill){
					user_skill = []
				}
				if(!oppo_skill){
					oppo_skill = []
				}
				round = 0
				while(user_hp > 0 && opp_hp > 0){
					if (round%2 == 0){
						skill_use = skill()
						if (skill_use[0] && user_g==0){
							msg = msg.concat(`-「Enhance Armament」${user}解放了金木樨之劍，刀身化作無數的碎片\n`)
							user_g = 1
						}
						round_data = round_fight(user, opponent, skill_use, user_g, opp_g, user_hp, user_skill, oppo_skill)
						msg = msg.concat(round_data['round_msg'])
						user_hp = user_hp + round_data['heal']
						opp_hp = opp_hp - round_data['damage']
					}else{
						skill_use = skill()
						if (skill_use[0] && opp_g==0){
							msg = msg.concat(`-「Enhance Armament」${opponent}解放了金木樨之劍，刀身化作無數的碎片\n`)
							opp_g = 1
						}
						round_data = round_fight(opponent, user, skill_use, opp_g, user_g, opp_hp, oppo_skill, user_skill)
						msg = msg.concat(round_data['round_msg'])
						opp_hp = opp_hp + round_data['heal']
						user_hp = user_hp - round_data['damage']
					}
					round = round + 1
				}
				if (user_hp < 0){
					msg = msg.concat(`${user}倒下了， ${opponent}剩餘 ${opp_hp} 點血量\n`)
					if(Math.random()<death[mode]){
						msg = msg.concat(`${user}被擊殺身亡了\n`)
						info.record_battle(user, opponent, 0, 1)
					}else{
						info.record_battle(user, opponent, 0, 0)
					}
				}else if (opp_hp < 0){
					msg = msg.concat(`${opponent}倒下了， ${user}剩餘 ${user_hp} 點血量\n`)
					if(Math.random()<death[mode]){
						msg = msg.concat(`${opponent}被擊殺身亡了\n`)
						info.record_battle(user, opponent, 1, 1)
					}else{
						info.record_battle(user, opponent, 1, 0)
					}
				}
				msg = msg.concat('```')
				callback(msg)					
			}
        })

	}

}

function round_fight(att, def, skill_use, att_g, def_g, cur_hp, att_skill, def_skill){
	let damage = 0
	let heal = 0
	let r = ''

	if(skill_use[1]){ //fire
		d = getRndInteger(150, 400)
		damage = damage + d
		r = r.concat(`「Generate thermal element, arrow shape, discharge」${att}發射火元素攻擊，對${def}造成 ${d} 點傷害\n`)
	}
	if(skill_use[2]){
		rand =  Math.random()
		var miss = rand < 0.5 && rand > 0.01
		var blow = rand < 0.01
		if(miss){
			r = r.concat(`-${att}的飛龍雨緣在空中飛了一圈但是沒有吐息，哭啊\n`)
		}else if (blow){
			h = getRndInteger(400, 2000)
			heal = heal - h
			r = r.concat(`-${att}的飛龍雨緣從空中發射吐息攻擊但是炸膛了，對自己造成 ${h} 點傷害\n`)
		}
		else{			
			d = getRndInteger(900, 4000)
			damage = damage + d
			r = r.concat(`-${att}的飛龍雨緣從空中發射吐息攻擊，對${def}造成 ${d} 點傷害\n`)
		}
	}
	if(skill_use[3] && cur_hp < 3250){
		heal = heal + Math.min(3250-cur_hp, getRndInteger(100, 300))
		r = r.concat(`「Generate luminous element」${att}用神聖術恢復了 ${heal} 點生命值\n`)
	}
	m = magic(att, def, att_skill)
	r = r.concat(m['msg'])
	damage = damage + m['damage']

	a = attack(att, def, att_g, def_g, att_skill, def_skill)
	r = r.concat(a['msg'])
	damage = damage + a['damage']

	return {'round_msg':r, 'damage':damage, 'heal':heal}

}

function magic(att, def, skill){
	let cast
	let damage = 0
	let r = ''
	for(var i=0; i < skill.length; i++){
		if (magic_skill.hasOwnProperty(skill[i])){
			cast = Math.random() < magic_skill[skill[i]]
			if(cast){
				switch(skill[i]) {
					case '天野陽菜':  
						d = getRndInteger(1600, 2600)
						damage = damage + d
						r = r.concat(`-${att}嚇得蹲下閉眼祈禱，突然打雷擊中${def}造成 ${d} 點傷害\n`)
						break
					case '兔田ぺこら':
						r = r.concat(`「哈↑哈↑哈↑哈↑哈↑」兔田ぺこら嘲笑對手，${def}的技能發動率下降了\n`)
						break
					case '努西':
						d = getRndInteger(900, 1500)
						damage = damage + d
						r = r.concat(`${att}的寵物努西使出咬碎，對${def}造成 ${d} 點傷害\n`)
						break
				}
			}
		}
		
	}
	return {'msg':r,'damage':damage}
}

function attack(att, def, att_g, def_g, skill, def_skill){
	let cast
	let damage = 0
	let r = ''
	let has_skill = ['普攻']
	for(var i=0; i < skill.length; i++){
		if (sword_skill.hasOwnProperty(skill[i])){
			has_skill.push(skill[i])
		}
	}
	u = getRndInteger(0, has_skill.length)
	switch(has_skill[u]) {
		case '普攻':
				if(att_g){
					r = r.concat(`${att}用解放的無數的刀身碎片攻擊`)
				}else{
					r = r.concat(`${att}攻擊`)
				}  
				h = hit(400, 600, def, def_g, def_skill)
				damage = damage + h['damage']
				r = r.concat(h['msg'])
				if(att_g){
					counter = 2
					while(Math.random() < 0.5){
						r = r.concat(`${att}繼續追加第 ${counter} 擊`)	
						h = hit(150, 350, def, def_g, def_skill)
						damage = damage + h['damage']
						r = r.concat(h['msg'])
						counter = counter + 1
					}
				}else{
					counter = 2
					while(Math.random() < 0.1){
						r = r.concat(`${att} ${counter} 連擊！`)
						h = hit(400, 600, def, def_g, def_skill)
						damage = damage + h['damage']
						r = r.concat(h['msg'])
						counter = counter + 1
					}
				}
				break
		case '旋風':
				r = r.concat(`${att}使出了劍技「旋風」`)
				h = hit(1500, 2000, def, def_g, def_skill)
				damage = damage + h['damage']
				r = r.concat(h['msg'])						
				break
		case '魔人的一擊':
				miss = Math.random() < 0.8
				r = r.concat(`${att}以惡魔的左臂使出了「魔人的一擊」`)
				if(miss){
					r = r.concat(`，但因為無法控制過於強大的力量而打偏了\n`)
				}else{			
					h = hit(10000, 20000, def, def_g, def_skill)
					damage = damage + h['damage']
					r = r.concat(h['msg'])	
				}
				break
	}
	return {'msg':r,'damage':damage}
}

function defense(def, skill){
	let cast
	let de = false
	let r = ''
	for(var i=0; i < skill.length; i++){
		if (defense_skill.hasOwnProperty(skill[i])){
			cast = Math.random() < defense_skill[skill[i]]
			if(cast){
				switch(skill[i]) {
					case '立體機動裝置':  
						r = r.concat(`，但是${def}使用立體機動裝置閃開了\n`)
						de = true
						break
				}
				break
			}
		}
		
	}
	return {'msg':r,'defense':de}
}

function dodge_output(def){
	return `，但是被${def}閃過了\n`
}

function block_output(def){
	return `，但是${def}用解放的刀身擋下了攻擊\n`
}

function hit(low, high, def, def_g, def_skill){
	let damage = 0
	let r = ''
	dodge = Math.random() < 0.05
	block = Math.random() < 0.25
	critical = Math.random() < 0.2
	d = defense(def, def_skill)
	if (dodge){r = r.concat(dodge_output(def))}
	else if(def_g && block){r = r.concat(block_output(def))}
	else if (d['defense']){r = r.concat(d['msg'])}
	else{
		if (critical){
			d = Math.floor(getRndInteger(low, high)*2)
			damage = damage + d
			r = r.concat(`命中要害，對${def}造成 ${d} 點傷害\n`)
		}else{
			d = getRndInteger(low, high)
			damage = damage + d
			r = r.concat(`，對${def}造成 ${d} 點傷害\n`)				
		}				
	}
	return {'msg':r,'damage':damage}	
}


function skill(){
	let enhance = Math.random() < 0.2
	let fire = Math.random() < 0.15
	let drake = Math.random() < 0.25
	let heal = Math.random() < 0.05
	let a = [enhance, fire, drake, heal]
	return a
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}