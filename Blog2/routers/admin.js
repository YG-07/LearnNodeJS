
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
  // 使用数据库对象，从数据库里读取用户数据
  // limit()：数据分页，限制数据条数
  // skip():从什么地方开始，忽略数据条数，跳过skipNum = (page - 1) * limitNum
  var page = Number(req.query.page || 1)
  var limitNum = 2
  
  User.count().then(function(count) {
    // 根据limitNum和总条数计算总页数,ceil向上取整
    pages = Math.ceil(count / limitNum)
    // 不能大于pages,两者中取较小值
    page = Math.min(page, pages)
    // 不能小于1，反之
    page = Math.max(1, page)
    var skipNum = (page - 1) * limitNum

    User.find().limit(limitNum).skip(skipNum).then(function(users) {
    console.log(users)
    res.render('admin/user_index', {
      userInfo: req.userInfo,
      users,

      count,
      limitNum,
      pages,
      page,
    })
  })
  })

  
})

module.exports = router