
// api的子路由

var express = require('express')
var router = express.Router()
var User = require('../models/user')

// 统一返回格式
var responseData;
router.use(function (req, res, next) {
  responseData = {
    code: 0,
    message: ''
  }
  next()
})

// 注册路由
router.post('/user/register', function (req, res, next) {
  console.log(req.body)
  // 1.基本判断：非空、两次密码必须相同
  var username = req.body.username
  var password = req.body.password
  var repassword = req.body.repassword
  
  if(username == '' || password == '') {
    responseData.code = 1
    responseData.message = '用户名和密码不能为空'
    res.json(responseData)
    return
  }
  if(repassword == '') {
    responseData.code = 1
    responseData.message = '重复密码不能为空'
    res.json(responseData)
    return
  }
  if(password != repassword) {
    responseData.code = 2
    responseData.message = '两次密码必须一致'
    res.json(responseData)
    return
  }

  // 2.数据库对象的操作
  User.findOne({
    username: username
  }).then(function (userInfo) {
    // 如果存在
    if (userInfo) {
      responseData.code = 3
      responseData.message = '用户名已经被注册'
      res.json(responseData)
      return
    } 
    // 否则保存到数据库
    var user = new User({
      username: username,
      password: password,
      isAdmin: false
    })
    return user.save()
  }).then(function (newUserInfo) {
    // console.log(newUserInfo)
    responseData.message = '注册成功'
    res.json(responseData)
  }).catch(function (err) {
    console.log(err)
  })
})

// 登录路由
router.post('/user/login', function (req, res, next) {
  var username = req.body.username
  var password = req.body.password
  // 基本判断
  if(username == '' || password == '') {
    responseData.code = 1
    responseData.message = '用户名和密码不能为空'
    res.json(responseData)
    return
  }
  // 数据库操作
  User.findOne({
    username: username,
    password: password
  }).then(function (userInfo) {
    console.log(userInfo)
    if(!userInfo) {
      responseData.code = 2
      responseData.message = '用户名或密码错误'
      res.json(responseData)
      return
    }
    responseData.message = '登录成功'
    responseData.userInfo = {
      _id: userInfo._id,
      username: userInfo.username
    }
    // 返回一个cookie
    req.cookies.set('userInfo', JSON.stringify({
      _id: userInfo._id,
      username: userInfo.username
    }))
    res.json(responseData)
    return
  })
  
})

//退出路由
router.get('/user/logout', function (req, res, next) {
  req.cookies.set('userInfo', null)
  responseData.message = '退出登录'
  res.json(responseData)
})


module.exports = router