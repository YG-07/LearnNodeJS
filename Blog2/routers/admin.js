
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
      name: 'user'
      })
    })
  })
})

// 分类路由,首页
router.get('/category', function(req, res, next) {
  var page = Number(req.query.page || 1)
  var limitNum = 2
  
  Category.count().then(function(count) {
    // 根据limitNum和总条数计算总页数,ceil向上取整
    pages = Math.ceil(count / limitNum)
    // 不能大于pages,两者中取较小值
    page = Math.min(page, pages)
    // 不能小于1，反之
    page = Math.max(1, page)
    var skipNum = (page - 1) * limitNum

    Category.find().limit(limitNum).skip(skipNum).then(function(cates) {
    res.render('admin/category_index', {
      userInfo: req.userInfo,
      cates,

      count,
      limitNum,
      pages,
      page,
      name: 'category'
      })
    })
  })
})

//添加分类首页
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
  }).then(function() {
    res.render('admin/success', {
      userInfo: req.userInfo,
      message: '分类保存成功',
      url: '/admin/category'
    })
  })
  
})

// 分类修改页面
router.get('/category/edit', function(req, res) {
  var id = req.query.id || ''
  // 修改的分类
  Category.findOne({
    _id: id
  }).then(function(category) {
    if(!category) {
      res.render('admin/error', {
        userInfo: req.userInfo,
        message: '分类信息不存在！'
      })
      return Promise.reject()
    } else {
      res.render('admin/category_edit', {
        userInfo: req.userInfo,
        category
      })
    }
  })

})

// 分类修改请求
router.post('/category/edit', function(req, res) {
  var id = req.query.id || ''
  var catename = req.body.catename || ''

  // 修改的分类
  Category.findOne({
    _id: id
  }).then(function(category) {
    if(!category) {
      res.render('admin/error', {
        userInfo: req.userInfo,
        message: '分类信息不存在！'
      })
      return Promise.reject()
    } else {
      // 判断用户是否操作
      if (catename == category.catename) {
        res.render('admin/success', {
          userInfo: req.userInfo,
          message: '未进行修改分类信息！',
          url: '/admin/category'
        }) 
        return Promise.reject()
      } else {
          //要修改名称是否存在
          return Category.findOne({
            // $ne 不等于
            _id: {$ne: id},
            catename: catename
          })
        }
    }
  }).then(function(isSame) {
    if(isSame) {
      res.render('admin/error', {
        userInfo: req.userInfo,
        message: '数据库中已经存在同名的分类！'
      })
      return Promise.reject()
    } else {
      // 保存
      return Category.update({
        _id: id
      }, {
        catename: catename
      })
    }
  }).then(function() {
    res.render('admin/success', {
      userInfo: req.userInfo,
      message: '分类修改成功！',
      url: '/admin/category'
    })
  })
})

// 分类删除
router.get('/category/delete', function(req, res) {
  var id = req.query.id || ''
  Category.remove({
    _id: id
  }).then(function() {
    res.render('admin/success', {
      userInfo: req.userInfo,
      message: '删除修改成功！',
      url: '/admin/category'
    })
  })
})


module.exports = router