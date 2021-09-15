// 注意：每次调用 $.get() 或 $.post() 或 $.ajax() 的时候，
// 会先调用 ajaxPrefilter 这个函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function (options){
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url
    //统一为有权限的请求设置请求头
    if (options.url.indexOf('/my/') !== -1){
        //请求头配置对对象
        options.headers = {
            Authorization:localStorage.getItem('token') || ''
        }
    }
    //全局统一挂载complete回调函数  请求无论成功与失败都会调用complete函数
    options.complete = function (res){
        // console.log(res)
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！'){
            //身份验证失败需强制清除token并把页面跳转到登录页面
            localStorage.removeItem('token')
            location.href = '/login.html'
        }
    }
})
