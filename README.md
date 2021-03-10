# LearnNodeJS
学习nodejs

## 一、项目准备
### 1.生成package.json指令：npm init
### 2.安装Express指令：cnpm install --save express
### 3.以及其他第三方模块：body-parser、cookies、markdown、mongoose、swig

## 二、创建项目
### 2.1 创建6个文件夹，和1个入口文件app.js
1. db 数据库存储目录
2. models 数据库模型文件目录
3. public 公共文件目录（css、js、image..…）
4. routers 路由文件目录
5. schemas 数据库结构文件（schema）目录
6. views 模板视图文件目录
7. app.js 应用（启动）入口文件

### 2.2 创建入口程序
#### 2.2.1 在app.js中使用express搭建服务器
```javaScript
// 1.加载express模块
var express = require('express')
// 2.创建app应用，NodeJS Http.createServer()
var app = express()
// ...处理用户请求，路由绑定...
// 3.监听http请求
app.listen(8081)
```

#### 2.2.2 简单使用一下路由绑定
```javaScript
// 4.路由绑定.req请求对象, res响应对象, next函数
// 首页
app.get('/', function (req, res, next) {
  res.send('<h1>欢迎光临！</h1>')
})
```

#### 2.2.3 使用模板引擎
* 为html文件配置模板引擎
```javaScript
// 1.加载swig模块
var swig = require('swig')
// 配置应用模板
// 1.engine定义模板引擎：1模板引擎名称html、2解析模板内容的方法
app.engine('html', swig.renderFile)
// 2.set设置模板存放目录：1.views，2.目录
app.set('views', './views')
// 3.注册引擎：1.view engine，2.模板引擎名称html
app.set('view engine', 'html')
```

#### 2.2.4 在路由中使用模板解析
* 在views目录创建index.html文件，通过render函数读取它
```javaScript
// 读取views目录的文件，解析并返回给客户端.render函数
res.render('index')
```
### 2.3 使用css静态文件
* 用户发送http请求->url->解析路由->找到匹配的规则->执行指定绑定函数（处理静态、动态文件），返回对应内容至用户
  * 以'/public'开头->静态->直接读取指定目录下的文件，返回给用户
  * 其他路由，动态->处理业务逻辑，加载模板，解析模板->返回数据给用户
```javaScript
// 设置静态文件托管目录
// 请求以'/public'，将文件路径补全，如：该目录下的main.css
app.use('/public', express.static(__dirname + '/public'))
```

## 三、项目模块划分
### 3.1 根据功能进行模块划分，有：
1. 前台模块
2. 后台模块
3. API模块

### 3.2 使用app.use()进行模块划分的编程，并在**routers文件夹**创建对应的js文件

app.use('admin', require('./routers/admin'))
app.use('api', require('./routers/api'))
app.use('/', require('./routers/main'))
```

### 3.3 在对应的js文件中创建路由，例如：
```javaScript
// admin的子路由
var express = require('express')
var router = express.Router()
router.get('/user', function (req, res, next) {
  res.send('Admin User')
})
module.exports = router
```
* 通过url访问：http://localhost:8081/admin/user

### 3.4 模块的详细划分
1. main模块
* /   首页
* /view   内容页
2. api模块
* /register   用户注册
* /login    用户登录
* /comment    评论获取
* /comment/post   评论提交
3. admin模块
* 用户管理
  * /user   用户列表
* 分类管理
  * /category    分类列表
  * /category/add   添加分类
  * /category/edit    编辑分类
  * /category/delete    删除分类
* 文章内容管理
  * /article    内容列表
  * /article/add    添加内容
  * /article/edit   编辑内容
  * /article/delete   删除内容
* 评论内容管理
  * /comment    评论列表
  * /comment/delete   删除评论

### 3.5 功能开发顺序
* 功能模块开发顺序：**用户、栏目、内容、评论**
* 编码顺序：**通过schema定义设计数据存储结构、功能逻辑、页面展示**

## 四、配置MongoDB数据库
* 官方下载地址：https://www.mongodb.com/try/download/community
### 4.1 安装后配置MongoDB服务
1. 配置mongo安装目录的**bin文件夹**的环境变量
2. 在目录下新建一个**mongo.conf配置文件**，内容是：
```javaScript
dbpath = D:\NodeJS\LearnNodeJS\Blog2\db
logpath = D:\NodeJS\LearnNodeJS\Blog2\db\log\mongod.log
logappend = true
port = 27017
```
3. 以上的路径是项目的数据库文件夹，再里面新建**log文件夹**，里面新建一个**mongod.log日志文件**
4. 通过配置文件注册服务，指令：`mongod --install -f mongo.conf`
5. 打开任务管理器(或使用指令：`net start MongoDB`)，打开MongoDB的服务

### 4.2 创建一个数据库
1. 打开cmd，输入mongo即可打开数据库。
2. 使用`use blog`语句新建blog数据库
3. 要插入一条数据才能新建数据库，使用`db.blog.insert({"name":"blog"})`语句，使用`show dbs`查看所有数据库

### 4.3 在项目中使用MongoDB数据库
1. 在app.js中使用mongoose模块连接，并将端口监听放在成功条件下
```javaScript
mongoose.connect('mongodb://localhost:27017/blog', function (err) {
  if(err) {
    console.log('blog数据库 连接失败')
  } else {
    console.log('blog数据库 连接成功')
    app.listen(8081)
  }
})
```
2. 在schemas文件夹中创建user的表结构js文件，查看[Schema语法](https://mongoosejs.com/docs/guide.html)
3. 在user.js文件中创建并暴露表结构
```javaScript
var mongoose = require('mongoose')
module.exports = new mongoose.Schema({
  username: String,
  password: String
})
```
4. 在models文件夹中创建user.js，指向schemas文件夹的js文件.作用是生成一个**表结构对象**，用于对表操作
```javaScript
var mongoose = require('mongoose')
var userSchema = require('../schemas/users')
module.exports = mongoose.model('User', userSchema)
```

## 五、用户注册前端页面
### 5.1 配置路由main.js，get请求，render解析'/main/index.html'
1. 在main文件夹创建index.html，并展示所有注册和登录的界面
2. 修改静态资源的路径，改成'/public'
3. 通过jQuery语法实现注册和登录界面的切换，在public文件夹新建js文件夹，在里面新建index.js
4. 在index.html中使用script标签静态导入jQuery.min.js和/js/index.js

### 5.2 在index.js中实现注册功能(**前端**)
1. 通过`$('')`选择器获取登录和注册的外标签元素
2. 再通过`.find`和`.on()`查找元素并监听事件
```javaScript
// 切换注册面板。同理切换登录
  $loginBox.find('a.colMint').on('click', function () {
    $registerBox.show()
    $loginBox.hide()
  })
```
3. 监听“注册”按钮点击，通过AJAX发送post请求，提交用户输入的数据，这里路由url为：`/api/user/register`
* ajax请求的属性有：type(有get/post)、url、data对象、dataType(如json)、success成功回调
```javaScript
$registerBox.find('button').on('click', function () {
$.ajax({...})
})
```
### 5.3 在api中配置注册的路由(**后端**)
* 先创建一个统一返回格式的对象，包含状态码(一般用0表示成功)、信息等
```javaScript
var responseData;
router.use(function (req, res, next) {
  responseData = {
    code: 0,
    message: ''
  }
  next()
})
```
* 然后对注册信息进行判断，并返回统一格式对象
1. 基本判断：非空、两次密码必须相同
2. 数据库对象的操作，对user的model对象操作，查询一条User.findOne()使用Promise语法，保存到数据库user.save()

### 5.4 ajax监听“登录”按钮，同理
### 5.5 api配置登录的路由，并在对象中返回用户信息
```javaScript
responseData.userInfo = {
  _id: userInfo._id,
  username: userInfo.username
}
```
### 5.6 登录后显示用户信息
* 一开始隐藏用户信息、注册界面，只显示登录界面
* 登录成功就隐藏登录、注册的面板，显示用户信息面板

### 5.7 使用cookie保存用户状态
1. 在app.js中导入cookies模块，并设置
2. 弃用登录后通过选择器修改页面的方案，使用[HTML模板语法](https://blog.csdn.net/xiaoming0018/article/details/80389277)
3. 修改后，在配置cookies中解析登录用户信息
```javaScript
req.username = {}
if(req.cookies.get('userInfo')){
  try {
    req.userInfo = JSON.parse(req.cookies.get('userInfo'))
  } catch (e) {}
}
```
4. 然后登录路由里面设置cookie，重载页面即可
```javaScript
// 返回一个cookie
req.cookies.set('userInfo', JSON.stringify({
  _id: userInfo._id,
  username: userInfo.username
}))
```
5. 监听退出按钮，同样发送AJAX，配置退出路由，设置一个null的cookie，重载页面

### 5.8 [小结]前端设计界面，后端配置路由
> 编程大致流程：创建数据库 -> 在schemas中建表 -> 在models中建数据库对象 -> 编写前端views的html页面 -> 引用public静态资源 -> 编写js/css等资源 -> 编写后端api路由js文件 -> 最后前端根据请求的后端数据变换页面内容 
* 前端界面的代码在views/main/index.html中，通过静态文件index.js控制界面的**事件监听**和**数据请求**
* 后端在routers/api.js根据前端的url，配置路由，检查数据再通过models/user.js的**数据库对象**进一步检查，最后返回一个**统一格式对象**
> cookie的使用过程：app.js引入Cookies -> 配置Cookie -> 编写后端api返回cookie -> 修改前端js登录切换页面的方式 -> 修改index.html使用模板语法 -> 再配置Cookies解析登录信息 -> 最后退出功能同理


