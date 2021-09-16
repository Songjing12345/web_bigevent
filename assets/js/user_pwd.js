$(function (){
    //自定义验证规则
    var form = layui.form
    form.verify({
        pwd:[/^[\S]{6,12}$/
            ,'密码必须6到12位，且不能出现空格'],
        //新旧密码不能一样
        samePwd:function (value){
            if (value === $('[name=oldPwd]').val()){
                return '新旧密码不能一样'
            }
        },
        //校验两次密码框的值是否一直
        rePwd: function (value){
            var pwd = $('[name=newPwd]').val()
            if (pwd !== value){
                return '两次密码输入不一致'
            }
        }
    })

    //重置密码
    $('.layui-form').on('submit',function (e){
        e.preventDefault()
        $.ajax({
            method:'POST',
            url:'/my/updatepwd',
            data:$(this).serialize(),
            success:function (res){
                if (res.status !== 0){
                    return layer.msg('密码修改失败')
                }
                layer.msg('密码修改成功')
                //重置表单 [0]表示将获取的jQuery对象转换为DOM原生对象才能调用reset方法
                $('.layui-form')[0].reset()
            }
        })

    })

})