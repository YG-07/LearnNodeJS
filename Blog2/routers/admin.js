
// admin的子路由

var express = require('express')
var router = express.Router()

var User = require('../models/user')

router.use(function(req, res, next) {
  if(!req.userInfo.isAdmin) {
    res.send('只能管理员访问该页面！')
  }
  next()
})

// 首页
router.get('/', function (req, res, next) {
  res.render('admin/index', {
    userInfo: req.userInfo
  })
})

// 用户管理
router.get('/user', function(req, res) {
  // 从数据库里读取用户数据
  User.find().then(function(users) {
    console.log(users)
    res.render('admin/user_index', {
      userInfo: req.userInfo,
      users: users
    })
  })
})

module.exports = router