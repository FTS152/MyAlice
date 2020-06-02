

exports.fight = function(user, opponent, mode, shout, callback){
	if(mode != '友好切磋' && mode != '認真對決' && mode != '決一死戰' && mode != '我要殺死你' ){
		callback('沒有這個對戰模式！')
	}else{
		death = {'友好切磋':0.002, '認真對決':0.05, '決一死戰':0.25, '我要殺死你':0.6}
		var m = new Date()
		var user_hp = 3250
		var opp_hp = 3250
		var user_g = 0
		var opp_g = 0
		var msg = `${user} 向 ${opponent} 發起 ${mode} ${m.toLocaleString()} \n`
		if (shout){
			msg = msg.concat(`${user} 向 ${opponent} 喊道：「${shout}」\n`)
		}
		round = 0
		while(user_hp > 0 && opp_hp > 0){
			if (round%2 == 0){
				skill_use = skill()
				if (skill_use[0] && user_g==0){
					msg = msg.concat(`「Enhance Armament」${user}解放了金木樨之劍，刀身化作無數的碎片\n`)
					user_g = 1
				}
				round_data = round_fight(user, opponent, skill_use, user_g, opp_g, user_hp)
				msg = msg.concat(round_data['round_msg'])
				user_hp = user_hp + round_data['heal']
				opp_hp = opp_hp - round_data['damage']
			}else{
				skill_use = skill()
				if (skill_use[0] && opp_g==0){
					msg = msg.concat(`「Enhance Armament」${opponent}解放了金木樨之劍，刀身化作無數的碎片\n`)
					opp_g = 1
				}
				round_data = round_fight(opponent, user, skill_use, opp_g, user_g, opp_hp)
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
			}
		}else if (opp_hp < 0){
			msg = msg.concat(`${opponent}倒下了， ${user}剩餘 ${user_hp} 點血量\n`)
			if(Math.random()<death[mode]){
				msg = msg.concat(`${opponent}被擊殺身亡了\n`)
			}
		}
		callback(msg)	
	}

}

function round_fight(att, def, skill_use, att_g, def_g, cur_hp){
	var damage = 0
	var heal = 0
	var r = ''

	if(skill_use[1]){ //fire
		d = getRndInteger(150, 400)
		damage = damage + d
		r = r.concat(`「Generate thermal element, arrow shape, discharge」${att}發射火元素攻擊，對${def}造成 ${d} 點傷害\n`)
	}
	if(skill_use[2]){
		d = getRndInteger(900, 4000)
		damage = damage + d
		r = r.concat(`${att}的飛龍雨緣從空中發射吐息攻擊，對${def}造成 ${d} 點傷害\n`)
	}
	if(skill_use[3] && cur_hp < 3250){
		heal = Math.min(3250-cur_hp, getRndInteger(100, 300))
		r = r.concat(`「Generate luminous element」${att}用神聖術恢復了 ${heal} 點生命值\n`)
	}
	if(att_g){
		var r = r.concat(`${att}用解放的無數的刀身碎片攻擊`)
	}else{
		var r = r.concat(`${att}攻擊`)
	}

	var dodge = Math.random() < 0.05
	var block = Math.random() < 0.3
	var critical = Math.random() < 0.2
	if (dodge){r = r.concat(dodge_output(def))}
	else if(def_g && block){r = r.concat(block_output(def))}
	else{
		if (critical){
			d = Math.floor(getRndInteger(400, 600)*2.5)
			damage = damage + d
			r = r.concat(`命中要害，對${def}造成 ${d} 點傷害\n`)
		}else{
			d = getRndInteger(400, 600)
			damage = damage + d
			r = r.concat(`對${def}造成 ${d} 點傷害\n`)			
		}
	}

	if(att_g){
		counter = 2
		while(Math.random() < 0.6){
			dodge = Math.random() < 0.05
			block = Math.random() < 0.3
			critical = Math.random() < 0.2
			r = r.concat(`${att}繼續追加第 ${counter} 擊`)	
			if (dodge){r = r.concat(dodge_output(def))}
			else if(def_g && block){r = r.concat(block_output(def))}
			else{
				if (critical){
					d = Math.floor(getRndInteger(150, 350)*2.5)
					damage = damage + d
					r = r.concat(`命中要害，對${def}造成 ${d} 點傷害\n`)
				}else{
					d = getRndInteger(150, 350)
					damage = damage + d
					r = r.concat(`，對${def}造成 ${d} 點傷害\n`)				
				}				
			}
			counter = counter + 1
		}
	}else{
		counter = 2
		while(Math.random() < 0.1){
			dodge = Math.random() < 0.05
			block = Math.random() < 0.3
			critical = Math.random() < 0.2	
			r = r.concat(`${att} ${counter} 連擊！`)
			if (dodge){r = r.concat(dodge_output(def))}
			else if(def_g && block){r = r.concat(block_output(def))}
			else{
				if (critical){
					d = Math.floor(getRndInteger(400, 600)*2.5)
					damage = damage + d
					r = r.concat(`命中要害，對${def}造成 ${d} 點傷害\n`)
				}else{
					d = getRndInteger(400, 600)
					damage = damage + d
					r = r.concat(`對${def}造成 ${d} 點傷害\n`)				
				}				
			}
			counter = counter + 1
		}
	}
	return {'round_msg':r, 'damage':damage, 'heal':heal}

}

function dodge_output(def){
	return `，但是被${def}閃過了\n`
}

function block_output(def){
	return `，但是${def}用解放的刀身擋下了攻擊\n`
}


function skill(){
	var enhance = Math.random() < 0.3
	var fire = Math.random() < 0.15
	var drake = Math.random() < 0.25
	var heal = Math.random() < 0.05
	var a = [enhance, fire, drake, heal]
	return a
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}