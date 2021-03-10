
$(function () {
  var $loginBox = $('#loginBox')
  var $registerBox = $('#registerBox')
  var $userInfo = $('#userInfo')
  
  // 切换注册面板
  $loginBox.find('a.colMint').on('click', function () {
    $registerBox.show()
    $loginBox.hide()
  })
  // 切换登录面板
  $registerBox.find('a.colMint').on('click', function () {
    $loginBox.show()
    $registerBox.hide()
  })
  
  // 注册按钮
  $registerBox.find('button').on('click', function () {
    // ajax提交请求
    $.ajax({
      type: 'post',
      url: '/api/user/register',
      data: {
        username: $registerBox.find('[name="username"]').val(),
        password: $registerBox.find('[name="password"]').val(),
        repassword: $registerBox.find('[name="repassword"]').val()
      },
      dataType: 'json',
      success: function (res) {
        console.log(res)
        $registerBox.find('.colWarning').html(res.message)
        if(!res.code) {
          // 注册成功
          setTimeout(function () {
            $loginBox.show()
            $registerBox.hide()
          }, 1000)
        }
      }
    })
  })
  
  //登录按钮
  $loginBox.find('button').on('click', function () {
    // ajax提交请求
    $.ajax({
      type: 'post',
      url: '/api/user/login',
      data: {
        username: $loginBox.find('[name="username"]').val(),
        password: $loginBox.find('[name="password"]').val(),
      },
      dataType: 'json',
      success: function (res) {
        console.log(res)
        $loginBox.find('.colWarning').html(res.message)
        if(!res.code) {
          // 登录成功
          setTimeout(function () {
            // $loginBox.hide()
            // $registerBox.hide()
            // $userInfo.show()
            // // 将用户信息显示出来
            // $userInfo.find('.username').html(res.userInfo.username)
            // $userInfo.find('.info').html('你好'+res.userInfo.username+',欢迎光临我的博客~')
            window.location.reload()
          }, 1000)
        }
      }
    })
  })
  
  //绑定退出按钮
  $('#logout').on('click', function () {
    $.ajax({
      url: '/api/user/logout',
      success: function (res) {
        if(!res.code){
          window.location.reload()
        }
      }
    })
  })
  
  
})