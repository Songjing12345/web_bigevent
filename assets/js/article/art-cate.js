$(function (){
    var layer = layui.layer
    var form = layui.form
    initArtCateList()
    //获取文章分类列表
    function initArtCateList(){
        $.ajax({
            method:'GET',
            url:'/my/article/cates',
            success:function (res){
                // console.log(res)
                if (res.status !== 0){
                    return layer.msg('获取文章分类列表失败！')
                }
                var result = res.data
                var html = template('tpl-table', {data:result})
                $('tbody').html(html)
            }
        })
    }

    //为添加分类按钮添加点击事件
    var indexAdd = null
    $('#btnAddcate').on('click',function (){
        indexAdd = layer.open({
            type:1,
            area:['500px','250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });
    })

    //实现新增文章分类
    $('body').on('submit','#form-add',function (e){
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url:'/my/article/addcates',
            data:$(this).serialize(),
            success:function (res){
                if (res.status !== 0){
                    return layer.msg(res.message)
                }
                initArtCateList()
                layer.msg(res.message)
                //关闭弹出层
                layer.close(indexAdd)
            }
        })
    })

    //为修改按钮添加点击事件
    var indexEdit = null
    $('tbody').on('click','.btn-edit',function (){
        indexEdit = layer.open({
            type:1,
            area:['500px','250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })
        //将文章内容显示在修改框中
        var id = $(this).attr('data-id')
        $.ajax({
            method:'GET',
            url:'/my/article/cates/' + id,
            success:function (res){
                // console.log(res)
                form.val('form-edit',res.data)
            }
        })
    })

    //实现修改文章功能
    $('body').on('submit','#form-edit',function (e){
        e.preventDefault()
        // alert('ok')
        $.ajax({
            method:'POST',
            url:'/my/article/updatecate',
            data:$(this).serialize(),
            success:function (res){
                // console.log(res)
                if (res.status !== 0){
                    return layer.msg(res.message)
                }
                initArtCateList()
                layer.msg(res.message)
                //关闭弹出层
                layer.close(indexEdit)
            }

        })
    })

    //为删除按钮添加点击事件
    $('tbody').on('click','.layui-btn-danger',function (){
        // alert('ok')
        var id = $(this).attr('data-id')
        //询问是否确认删除
        layer.confirm('确认删除吗?', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                method:'GET',
                url:'/my/article/deletecate/' + id,
                success:function (res){
                    // console.log(res)
                    if (res.status !== 0){
                        return layer.msg(res.message)
                    }
                    layer.msg(res.message)
                    initArtCateList()
                }
            })
            layer.close(index);
        });

    })


})