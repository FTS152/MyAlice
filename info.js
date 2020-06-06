const FS = require('fs');
const UPDATEJSONFILE = require('update-json-file');

exports.record = function(user, tar, callback)
{
	if(tar){
		var target = tar
	}else{
		var target = user
	}
	var result
	var database = JSON.parse(FS.readFileSync('./user.json', 'utf8'));
	for (var i = 0; i < database.length; i++) {
		if (database[i]['user'] == target){
			result = database[i];
		}
	}
	if(result){
		if(result['skill']){
			var s = ''
			for (var i=0; i < result['skill'].length; i++){
				s = s.concat(`、${result['skill'][i]}`)
			}
			var msg = `${target} 一共獲勝了 ${result['win']} 場，戰敗了 ${result['lose']} 場, 總計擊殺了 ${result['kill']} 人，被殺死 ${result['death']} 次。\n持有技能：雨緣、火元素、神聖術、金木樨之劍${s}`
		}else{
			var msg = `${target} 一共獲勝了 ${result['win']} 場，戰敗了 ${result['lose']} 場, 總計擊殺了 ${result['kill']} 人，被殺死 ${result['death']} 次。\n持有技能：雨緣、火元素、神聖術、金木樨之劍`
		}
	}else{
		var msg = '查無資料！'
	}
	callback(msg);
}

exports.get_skill = function(target){
	var database = JSON.parse(FS.readFileSync('./user.json', 'utf8'));
	var result
	for (var i = 0; i < database.length; i++) {
		if (database[i]['user'] == target){
			result = database[i]['skill'];
		}
	}
	if(result){
		return result
	}else{
		return []
	}
}

exports.get_battle_skill = function(target){
	var database = JSON.parse(FS.readFileSync('./user.json', 'utf8'));
	var result
	for (var i = 0; i < database.length; i++) {
		if (database[i]['user'] == target){
			result = database[i]['battle_skill'];
		}
	}
	if(result){
		return result
	}else{
		return []
	}
}

exports.battle_cooldown = function(target, callback){
	const COOL = 100*1000
	var result
	var m = (+new Date())
	var database = JSON.parse(FS.readFileSync('./user.json', 'utf8'));
	for (var i = 0; i < database.length; i++) {
		if (database[i]['user'] == target){
			result = database[i]['battle_time'];
		}
	}
	if(result){
		if(m - result < COOL){
			callback(false,Math.floor((result+COOL-m)/1000))
		}else{
			callback(true,0)
		}
	}else{
		callback(true,0)
	}
}

exports.move_cooldown = function(target, callback){
	const COOL = 30*1000
	var result
	var m = (+new Date())
	var database = JSON.parse(FS.readFileSync('./user.json', 'utf8'));
	for (var i = 0; i < database.length; i++) {
		if (database[i]['user'] == target){
			result = database[i]['move_time'];
		}
	}
	if(result){
		if(m - result < COOL){
			callback(false,Math.floor((result+COOL-m)/1000))
		}else{
			callback(true,0)
		}
	}else{
		callback(true,0)
	}
}

exports.record_battle = function(att, def, result, death)
{
	UPDATEJSONFILE('./user.json',(database) => {
		var m = (+new Date())
		var att_ex = 0
		var def_ex = 0
		for(var i=0; i < database.length; i++){
			if(database[i]['user'] == att){
				if(result){
					database[i]['win'] = database[i]['win'] + 1;
				}else{
					database[i]['lose'] = database[i]['lose'] + 1;
				}
				if(death){
					if (result){
						database[i]['kill'] = database[i]['kill'] + 1;
					}else{
						database[i]['death'] = database[i]['death'] + 1;
					}
				}
				database[i]['battle_time'] = m 
				att_ex = 1
			}
			if(database[i]['user'] == def){
				if(!result){
					database[i]['win'] = database[i]['win'] + 1;
				}else{
					database[i]['lose'] = database[i]['lose'] + 1;
				}
				if(death){
					if (!result){
						database[i]['kill'] = database[i]['kill'] + 1;
					}else{
						database[i]['death'] = database[i]['death'] + 1;
					}
				}
				def_ex = 1
			}
		}
		if (att==def){
			if (att_ex==0 && def_ex==0){
				new_user = {
					'user': att,
					'win':1,
					'lose':1,
					'death':(death)?1:0,
					'kill':(death)?1:0,
					'battle_time':m
				}
				database.push(new_user)	
			}		
		}else{
			if (att_ex == 0){
				new_user = {
					'user': att,
					'win':result?1:0,
					'lose':result?0:1,
					'death':(!result&&death)?1:0,
					'kill':(result&&death)?1:0,
					'battle_time':m
				}
				database.push(new_user)
			}
			if (def_ex == 0){
				new_user = {
					'user': def,
					'win':result?0:1,
					'lose':result?1:0,
					'death':(result&&death)?1:0,
					'kill':(!result&&death)?1:0
				}
				database.push(new_user)
			}			
		}

		return database;
	})
}

exports.record_move = function(user, skill){
	UPDATEJSONFILE('./user.json',(database) => {
		var m = (+new Date())
		var user_ex = 0
		for(var i=0; i < database.length; i++){
			if(database[i]['user'] == user){
				database[i]['move_time'] = m
				if(skill){
					if (database[i]['skill']){
						if(database[i]['skill'].indexOf(skill)==-1){
							database[i]['skill'].push(skill)
						}
					}else{
						database[i]['skill'] = [skill]
					}
				} 
				user_ex = 1
			}
		}
		if (user_ex==0){
			if(skill){
				new_user = {
					'user': user,
					'win':0,
					'lose':0,
					'death':0,
					'kill':0,
					'move_time':m,
					'skill': [skill]
				}				
			}else{
				new_user = {
					'user': user,
					'win':0,
					'lose':0,
					'death':0,
					'kill':0,
					'move_time':m
				}	
			}

			database.push(new_user)	
		}		

		return database;
	})	
}