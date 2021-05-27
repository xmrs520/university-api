//var createError = require('http-errors');
var express = require('express');

const cors = require('cors');

// 引用bodyPrser插件包
const bodyParser = require('body-parser');
//引入插件
var vertoken = require('./utli/token')
var expressJwt = require('express-jwt')

var path = require('path');
var cookieParser = require('cookie-parser');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
app.use(cors());
//设置允许跨域访问该服务.
// app.all('*', function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", 'Authorization,X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method');
//   res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
//   res.header("X-Powered-By", ' 3.2.1')
//   res.header("Content-Type", "application/json;charset=utf-8");
//   next();
// });


//解析token获取用户信息
app.use(function (req, res, next) {
  var token = req.headers['Authorization'];
  if (token == undefined) {
    return next();
  } else {
    vertoken.getToken(token).then((data) => {
      req.data = data;
      return next();
    }).catch((error) => {
      return next();
    })
  }
});

//验证token是否过期并规定那些路由不需要验证
app.use(expressJwt({
  secret: 'zgs_first_token',
  algorithms: ['HS256']
}).unless({
  path: ['/users/login']  //不需要验证的接口名称
}))

//token失效返回信息
app.use(function (err, req, res, next) {
  if (err.status == 401) {
    return res.json({ message: 'token失效' })
    //可以设置返回json 形式  res.status(401).send('token失效')
  }
})

// 改写
var http = require('http');
var server = http.createServer(app);

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 静态资源
app.use(express.static(path.join(__dirname, 'public')));
// post 请求
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', indexRouter);
app.use('/users', usersRouter);
//http://192.168.248.177:3000/
server.listen('3000', '192.168.43.143');
// const server = app.listen(3000,,function(){
//   let host = server.address().address;
//   let port = server.address().port;
//   console.log(host,port);
// })