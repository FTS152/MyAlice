# MyAlice

Discord battle bot

基本上是照著 https://home.gamer.com.tw/creationDetail.php?sn=4433179 的教學架的

建立 Discord bot 後把這些檔案 pull 下來，加上 auth.json 就可以用了

要使用 info 功能需要再加上 user.json 儲存戰鬥紀錄

user.json 格式為:

```
[
	{
		"user": "example",
		"win": 87,
		"lose": 87,
		"death": 87,
		"kill": 87,
		"move_time": 1591162012122 //timestamp,
		"battle_time": 1591162012122 //timestamp,
		"skill": [] //collected skill,
		"battle_skill": []  //skills set for battle, max_length = 6
	},...
]
```

可使用指令：

戰鬥

> \$battle [你想決鬥的人][友好切磋/認真對決/決一死戰/我要殺死你] [想和對方說的話]

行動

> \$move [狩獵野兔/自主訓練/外出野餐/汁妹/做善事/坐下休息/釣魚]

查看個人資訊

> \$info [名字]

查看與挑選戰鬥技能

> \$skill [check/edit]

行動 CD 為 30 秒，戰鬥 CD 為 100 秒，行動有機會拿到特殊技能在戰鬥中使用

戰鬥最多使用 6 個自訂技能，編輯技能組合請使用 \$skill 指令進行

查看個人資訊可得知勝敗場、持有技能，但需要至少行動一次或戰鬥一次才會登錄到資料庫裡
