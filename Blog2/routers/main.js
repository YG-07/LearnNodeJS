
// 首页的子路由

var express = require('express')
var router = express.Router()

router.get('/user', function (req, res, next) {
  res.send('欢迎光临！ 首页')
})

module.exports = router