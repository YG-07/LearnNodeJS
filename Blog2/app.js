/*
* 应用程序的启动（入口）文件
*/

// 1.加载模块：express、swig处理模块、mongoose加载数据库模块、处理提交的post数据、cookie模块
var express = require('express')
var swig = require('swig')
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var Cookies = require('cookies')

// 2.创建app应用，NodeJS Http.createServer()
var app = express()
var User = require('./models/user')


// 设置静态文件托管目录
// 请求以'/public'，将文件路径补全
app.use('/public', express.static(__dirname + '/public'))

// 配置应用模板
// 1.engine定义模板引擎：1模板引擎名称html、2解析模板内容的方法
app.engine('html', swig.renderFile)
// 2.set设置模板存放目录：1.views，2.目录
app.set('views', './views')
// 3.注册引擎：1.view engine，2.模板引擎名称html
app.set('view engine', 'html')


// 4.开发过程，取消模板缓存
swig.setDefaults({catch: false})
// 设置bodyParser
app.use(bodyParser.urlencoded({extended: true}))
// 设置cookie
app.use(function (req, res, next) {
  req.cookies = new Cookies(req, res)
  
  // 解析登录用户信息
  req.username = {}
  if(req.cookies.get('userInfo')){
    try {
      req.userInfo = JSON.parse(req.cookies.get('userInfo'))
      // 获取当前用户的类型
      User.findById(req.userInfo._id).then(function (userInfo) {
        req.userInfo.isAdmin = Boolean(userInfo.isAdmin)
        next()
      })
      
    } catch (e) {
      next()
    }
  } else {
    next()
  }
})


// 处理3种路由
app.use('/admin', require('./routers/admin'))
app.use('/api', require('./routers/api'))
app.use('/', require('./routers/main'))
// 4.路由绑定.req请求对象, res响应对象, next函数
// 首页
// app.get('/', function (req, res, next) {
//   // res.send('<h1>欢迎光临！</h1>')
//   // 读取views目录的文件，解析并返回给客户端.render函数
//   res.render('index')
// })

// 获取css,静态文件
//弃用方案
// app.get('/main.css', function (req, res, next) {
//   res.setHeader('content-type', 'text/css')
//   res.send('body {background: green;}')
// })


// 3.监听http请求
mongoose.connect('mongodb://localhost:27017/blog', function (err) {
  if(err) {
    console.log('blog数据库 连接失败')
  } else {
    console.log('blog数据库 连接成功')
    app.listen(8081)
  }
})
