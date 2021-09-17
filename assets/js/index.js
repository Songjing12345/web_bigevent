$(function (){
    getUserInfo()

    //退出功能
    $('#btnLogout').on('click',function (){
        layer.confirm('确认退出登录吗？', {icon: 3, title:'提示'}, function(index){
            //退出后删除token，页面跳转到登录页面
            localStorage.removeItem('token')
            location.href = '/login.html'
            //关闭弹出框
            layer.close(index);
        });
    })

})

// 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method:'GET',
        url:'/my/userinfo',
        success:function (res) {
            // console.log(res)
            if (res.status !== 0){
                return layui.layer.msg('获取用户信息失败')
            }
            //渲染用户信息
            renderAvatar(res.data)
        }
    })
}
//渲染用户信息
function renderAvatar(user) {
    //渲染文字信息
    var name = user.nickname || user.username
    $('.welcome').html('欢迎&nbsp;&nbsp' + name)
    //渲染头像信息
    if (user.user_pic === null) {
        // debugger
        //渲染文字头像
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
        $('.layui-nav-img').hide()
    }else {
        //渲染图片头像
        $('.layui-nav-img').attr('src',user.user_pic).show()
        $('.text-avatar').hide()
    }
}