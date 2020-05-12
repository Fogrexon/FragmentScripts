// constants
const VERSION = "0.0.2";
const BOT_START = "Fbot";
const COMMANDS = {
    "Version" : "version",
    "Parrot" : "parrot",
    "HoloScope" : "holoscope",
    "Help" : "help",
    "Weather" : "weather"
};
const COMMANDS_HELP = "特殊コマンド : ほめて（ホメて、褒めて）\n" + 
"通常コマンド : Fbot + (Command) + (Message(無くてもよい))\n" + 
"コマンドは以下" + "\n" +
"version : バージョン" + "\n" +
"parrot : オウム返し" + "\n" +
"holoscope : 占い" + "\n" +
"help : ヘルプ";
const WEATHER_API_KEY = "31e9362ffc534036a1794c31da498ba9";

let XorShift = (w) => {
    let x = 123456789;
    
    let t = x ^ (x << 11);
    return (w ^ (w >>> 19)) ^ (t ^ (t >>> 8)); 
}


const eris = require("eris");
const https = require("https");

// TODO
var bot = new eris("NjIxNTA0Njg3MzEyNDcwMDM2.XXmWvQ.iK9L9fOuNsqZ2PTh2Ncb7_x_ISw");

bot.on("ready", () => {
    console.log("bot is ready");
});

bot.on("messageCreate", (msg) => {
    if (msg.author.bot) return;
    nonCommandChecker(msg.channel.id,msg.content);

    console.log(msg.content);
    checkCommand(msg);
});

let nonCommandChecker = (id,content) => {
    const homeCommands = "ほめてホメて褒めて誉めて";
    const homeageCommands = "ほめてあげて誉めてあげてホメてあげて褒めてあげて";
    if(homeCommands.indexOf(content) >= 0)  return bot.createMessage(id, Homeru());
    if(homeageCommands.indexOf(content) >= 0) return bot.createMessage(id, "それは無理。");
    if(content.search(/草(w|ｗ)/gi)>=0) return bot.createMessage(id, "草に草生やすな");
    if(content.search(/草/gi)>=0) return bot.createMessage(id, "草超えて林");
    if(content.search(/林/gi)>=0) return bot.createMessage(id, "林超えて森");
    if(content.search(/森/gi)>=0) return bot.createMessage(id, "森超えてジャングル");
}


const HomeSerif = "アイデアが豊富だね よく考えているね 足が綺麗だね アグレッシブだね リーダーシップがあるね 存在感があるよ あなたが一番だよ 安心するよ 男らしいね あなたのおかげだよ 意思が強いね 男前だね あなたのようになりたいです 鋭いね 超一流だね あなたの頑張りはすごいね 艶があるね 度胸があるね あなたは私のメンターです 何をやっても上手だね 透き通るような肌をしているね あなたは私のモデルです 華があるよね 頭の回転が速いね あなたは私の憧れです 我慢強いね 髪が綺麗だね あなたは多才だね 勘がいいね 美人だね あなたは天才だよ 完璧だよ 必ずやり遂げるね あなたを尊敬します 頑張ってるね 品があるね いいアドバイスをありがとう 器が大きいね 雰囲気いいね いいこと言うよね 器用だね 包容力があるね いい身体しているね 機転が利くね 本質を見抜くね いいしているね 教養があるね 本当にありがとう いつもありがとう 筋がいいね 本当にうれしいよ いつも一生懸命だね 断がはやいね 本当におめでとう いつも応援しているよ 断力があるね 本当にかわいいね いつも輝いているね 健康的だね 本当に気がきくね いつも爽やかだね 献身的だね 本当に助かるよ いつも堂々としているね 個性的だね 本当に尊敬します いつも冷静だね 行動力があるね 夢があるよね いつも礼儀正しいね 最高に素敵だよ るいね いつも綺麗だね 仕事がはやいね 面倒見がいいね えらいね 仕事熱心だね 問題解能力が高いね お金持ちだね 姿勢がいいね 癒し系だよね お仕事お疲れさま 思いやりがあるね 優秀だね さすがだね 思い切りがいいよね 勇気があるね すごいね 字がうまいね 頼りがいがあるね すごい才能があるね 時間管理が上手いね 落ち着きがあるね すごくかっこいいね 自分を持ってるね 理解力があるね すごくモテるでしょう 趣味がいいね 料理が上手だね すごく感謝しています 集中力があるよね 話題が豊富だね すごく幸せそうだね 笑顔が素敵だね 凛としているね すごく頭がいいね 情熱的だね 綺麗な目をしているね すごく魅力的だね 信頼しているよ スタイルがいいね 心が広いね スペシャリストだね 心が綺麗だね セクシーだね 真剣さがいいね センスがいいね 紳士だね そんなに頑張らなくてもいいよ 芯が強いね ダンディーだね 親近感があるよ なにをやっても上手だね 親切だね なんだかキラキラしているよ 人を惹きつけるね なんだか垢抜けたね 人柄がいいね バイタリティーがあるね 性格いいね パワフルだね 成長したね ハンサムだね 誠実だね プロフェッショナルだね 積極的だね ポジティブだね 責任感があるよね モチベーションが高いね 素直だね やさしいね 創造力が豊かだね やさしいよね 想像力が豊かだね".split(" ");

let Homeru = () => {
    let num = Math.floor(Math.random() * HomeSerif.length);
    return HomeSerif[num];
}

let checkCommand = (msg) => {
    let slt = msg.content.split(" ");
    if(slt[0]!=BOT_START) return;
    let cmd = slt[1];
    let ctx = msg.content.slice(BOT_START.length + cmd.length + 2);
    let result = "";
    switch(cmd)
    {
        case COMMANDS.Version : 
        {
            result = VERSION;
            break;
        }
        case COMMANDS.Parrot :
        {
            result = ctx;
            break;
        }
        case COMMANDS.HoloScope :
        {
            result = HoloScope(msg.author.username);
            break;
        }
        case COMMANDS.Help :
        {
            result = COMMANDS_HELP;
            break;
        }
        case COMMANDS.Weather :
        {
            WeatherForecast(msg.channel.id);
            return;
        }
        default :
        {
            result = "Invaild Command."
            break;
        }
    }
    bot.createMessage(msg.channel.id, result);
}

const Holos = [
    "大吉",
    "大吉",
    "中吉",
    "中吉",
    "中吉",
    "中吉",
    "吉",
    "吉",
    "平",
    "吉",
    "吉",
    "吉",
    "小吉",
    "小吉",
    "小吉",
    "小吉",
    "凶",
    "凶",
    "大凶",
    "凶",
    "大凶"
];

let HoloScope = (username) => {
    let num = 0;
    for(let i=0;i<username.length;i++)
    {
        num += username.charCodeAt(i);
    }
    num += Math.abs(XorShift(new Date().getDate()));
    console.log(num);
    return Holos[num % Holos.length];
}

let WeatherForecast = (channelID) => {
    
    let url = "https://api.openweathermap.org/data/2.5/forecast/daily?id=1850147&cnt=1&appid="+WEATHER_API_KEY;
    let request = https.get(url, (res)=>{
        if(res.cod!="200")
        {
            bot.createMessage(channelID, "Sorry! I failed to load weather forecast.");
            return ;
        }
        let message = "";
        let tomorrow = res.list[0];
        message = "明日の天気は"+tomorrow.weather.main+"です";
        bot.createMessage(channelID, message);
    });
    request.on("error",(err)=>{
        bot.createMessage(channelID, "Sorry! I failed to connect OpenWeatherMap.");
        return ;
    })
}

bot.connect();