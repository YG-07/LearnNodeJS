
// admin的子路由

var express = require('express')
var router = express.Router()

var User = require('../models/User')
var Category = require('../models/Category')


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

// 分类路由,首页
router.get('/category', function(req, res, next) {
  res.render('admin/category_index', {
    userInfo: req.userInfo
  })
})

//添加
router.get('/category/add', function(req, res, next) {
  res.render('admin/category_add', {
    userInfo: req.userInfo
  })
})
// 添加分类的保存
router.post('/category/add', function(req, res, next) {
  var catename = req.body.catename || ''
  if(catename == '') {
    res.render('admin/error',{
      userInfo: req.userInfo,
      message: '名称不能为空！'
    })
  }

  Category.findOne({
    catename: catename
  }).then(function(rs) {
    if(rs) {
      res.render('admin/error', {
        userInfo: req.userInfo,
        message: '分类已经存在！'
      })
      return Promise.reject()
    } else {
      // 保存
      return new Category({
        catename: catename
      }).save()
    }
  }).then(function(newCate) {
    res.render('admin/success', {
      userInfo: req.userInfo,
      message: '分类保存成功',
      url: '/admin/category'
    })
  })
  
})

module.exports = router