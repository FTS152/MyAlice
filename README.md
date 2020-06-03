# MyAlice
Discord battle bot

基本上是照著 https://home.gamer.com.tw/creationDetail.php?sn=4433179 的教學架的

建立Discord bot後把這些檔案pull下來，加上auth.json就可以用了

要使用info功能需要再加上user.json儲存戰鬥紀錄

user.json 格式為:

```
[
	{
		"user": "example",
		"win": 87,
		"lose": 87,
		"death": 87,
		"kill": 87,
		"time": 1591162012122 //timestamp
	},...
]
```

可使用指令：

戰鬥

>$battle [你想決鬥的人] [友好切磋/認真對決/決一死戰/我要殺死你] [想和對方說的話]


行動

>$move [狩獵野兔/自主訓練/外出野餐/汁妹/做善事/坐下休息/釣魚]


查看個人資訊

>$info [名字]
