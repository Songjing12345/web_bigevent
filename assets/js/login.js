$(function (){
//为注册账号添加点击事件
$('#link_reg').on('click',function (){
    $('.login-box').hide();
    $('.reg-box').show();
})

//为去登录添加点击事件
$('#link_Login').on('click',function (){
    $('.login-box').show();
    $('.reg-box').hide();
})


    //自定义验证规则
    var form = layui.form
    var layer = layui.layer
    form.verify({
        pwd:[/^[\S]{6,12}$/
            ,'密码必须6到12位，且不能出现空格'],
        //校验两次密码框的值是否一直
        repwd: function (value){
            var pwd = $('.reg-box [name=password]').val()
            if (pwd !== value){
                return '两次密码输入不一致'
            }
        }
    })

    // 监听注册表单的提交事件
    $('#form-reg').on('submit',function (e){
        //阻止表单默认提交
        e.preventDefault()
        var data = {
            username:$('.reg-box [name=username]').val(),
            password:$('.reg-box [name=password]').val()
        }
        $.post('/api/reguser',data,function (res){
            if (status !== 0){
                return layer.msg(res.message)
            }
            layer.msg('注册成功')
            // debugger
            // console.log('注册成功')
            //手动调用点击事件
            $('#link_login').click()
            // $('.login-box').show();
            // $('.reg-box').hide();
        })

    })
    // 监听登录表单的提交事件
    $('#form-login').on('submit',function (e){
        e.preventDefault()
        var data = {
            username:$('.login-box [name=username]').val(),
            password:$('.login-box [name=password]').val()
        }
        $.ajax({
            method:'POST',
            url:'/api/login',
            data:data,
            success:function (res){
                if (res.status !== 0){
                    return layer.msg(res.message)
                }
                // console.log(res)
                layer.msg(res.message)
                localStorage.setItem('token',res.token)
                location.href = '/index.html'
            }
        })
    })

})