$(function (){
    //自定义验证规则
    var form = layui.form
    form.verify({
        nickname:function (value){
            if (value.length > 6){
                return '长度需在1~6位之间'
            }
        }
    })
    initUserInfo()
    //获取用户的基本信息
    function initUserInfo() {
        $.ajax({
            method:'GET',
            url:'/my/userinfo',
            success:function (res){
                // console.log(res)
                if (res.status !== 0){
                    return layer.msg(res.message)
                }
                //调用 form.val() 方法快速为表单赋值
                form.val('formUserInfo',res.data)
            }
        })
    }
    //实现表单重置效果
    $('#btnReset').on('click',function (e){
        // alert('ok')
        //阻止表单默认提交
        e.preventDefault()
        initUserInfo()
    })
    //更新用户信息
    //监听表单提交事件
    $('.layui-form').on('submit',function (e){
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url:'/my/userinfo',
            data:$(this).serialize(),
            success:function (res){
                if (res.status !== 0){
                    return layer.msg('用户信息修改失败')
                }
                layer.msg('用户信息修改成功')
                //让父元素的头像和名称随之一起改变
                window.parent.getUserInfo()
            }
        })
    })

})