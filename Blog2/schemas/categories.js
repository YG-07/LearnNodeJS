
var mongoose = require('mongoose')

// 定义分类的表结构
module.exports = new mongoose.Schema({
  // 分类名
  catename: String,
})