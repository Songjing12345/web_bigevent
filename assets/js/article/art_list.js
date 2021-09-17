$(function (){
    //提示消息
    var layer = layui.layer
    var form = layui.form
    //分页
    var laypage = layui.laypage;

    template.defaults.imports.dataFormat = function (date){
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    // 定义一个查询的参数对象，将来请求数据的时候，需要将请求参数对象提交到服务器
    var p = {
        pagenum:1,     //页码值
        pagesize:2,    //每页显示多少条数据
        cate_id:'',    //文章分类的 Id
        state:''       //文章的状态
    }

    initTable()
    //渲染文章列表页面
    function initTable(){
        $.ajax({
            method:'GET',
            url:'/my/article/list',
            data:p,
            success:function (res){
                // console.log(res)
                if (res.status !== 0){
                    return layer.msg(res.message)
                }
                // layer.msg(res.message)
                var html = template('tpl-list',res)
                $('tbody').html(html)
                renderPage(res.total)
            }
        })
    }

    initCate()
    //获取文章类别下拉值
    function initCate(){
        $.ajax({
            method:'GET',
            url:'/my/article/cates',
            success:function (res){
                if (res.status !== 0){
                    return layer.msg(res.message)
                }
                // layer.msg(res.message)
                var html = template('tpl-cate',res)
                $('[name=cate_id]').html(html)
                //一定要调用render方法
                form.render()
            }
        })
    }

    //实现筛选功能
    $('.layui-form').on('submit',function (e){
        e.preventDefault()
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        // console.log(state,cate_id)
        p.cate_id = cate_id
        p.state = state
        initTable()

    })
    // renderPage(total)
    //实现分页，定义分页的函数
    function renderPage(total){
        // console.log(total)
        layui.use('laypage', function(){
            //执行一个laypage实例，实现分页
            laypage.render({
                elem: 'pageBox',          //注意，这里的 test1 是 ID，不用加 # 号
                count: total,             //数据总数，从服务端得到
                limit:p.pagesize,         //每页显示的条数
                curr:p.pagenum,           //起始页
                limits:[2,3,5,10],        //每页条数的选择项
                //自定义排版
                layout:['count','limit','prev', 'page', 'next','skip'],
                //直接调用initTable会造成死循环
                //触发jump函数有两种方式，一种是通过点击页码触发，一种是调用laypage.render方法
                //应该在点击页码时调用initTable
                jump:function (obj,first){
                    // console.log(obj.curr)
                    // console.log(first)
                    p.pagenum = obj.curr
                    // 把最新的条目数，赋值到 q 这个查询参数对象的 pagesize 属性中
                    p.pagesize = obj.limit
                    //当first为undefined的时候表示是通过点击页码触发jump函数
                    if (!first){
                        initTable()
                    }
                }
            });
        });
    }

    //实现点击删除按钮删除数据功能
    $('tbody').on('click','.layui-btn-danger',function (){
        //获取当前页文章删除按钮的个数
        var len = $('.layui-btn-danger').length
        // console.log(len)
        var id = $(this).attr('data-id')
        layer.confirm('确认删除吗?', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                method:'GET',
                url:'/my/article/delete/' + id,
                success:function (res){
                    if (res.status !== 0){
                        return layer.msg(res.message)
                    }
                    layer.msg(res.message)
                    //判断当前页码的数据时候删完，如果删完则需让页码值减一再渲染页面
                    if (len === 1){
                        p.pagenum = p.pagenum === 1 ? 1 : p.pagenum - 1
                    }
                    initTable()
                }
            })
            layer.close(index);
        });
    })

})