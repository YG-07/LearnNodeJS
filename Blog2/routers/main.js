
// 首页的子路由

var express = require('express')
var router = express.Router()

router.get('/', function (req, res, next) {
  // 分配模板
  res.render('main/index', {
    userInfo: req.userInfo
  })
})

module.exports = router