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

