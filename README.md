首先你需要安装NodeJS环境 这里不再做介绍,
1.安装Express

  npm install express -g //全局安装
  npm install express-generator -g //安装全局变量
2.初始化项目

cd  example //进入项目文件夹
express project //创建express目录,project是目录名
3.执行如下命令：

1.cd project //进入项目根目录
2.npm install  //安装依赖

一，安装 ： npm install body-parser
// 引用bodyPrser插件包
const bodyParser = require('body-parser');
// 静态资源
app.use(express.static(path.join(__dirname, 'public')));
// post 请求
app.use(bodyParser.urlencoded({ extended: true }));

安装热更新nodemon
cnpm install -g  nodemon
安装在全局。

开启后台接口服务端
nodemon app.js
serve -s dist

开启网站
npm run serve