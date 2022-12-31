
var {add} = require("./model1");//ES5 导入语法
var Vue = require("./vue.min");

//编写MVVM中的model部分及VM（ViewModel）部分
var VM = new Vue({
    el:'#app',//vm接管了app区域的管理
    data:{//model数据
        name:'webpack_test',
        num1:0,
        num2:0,
        result:0,
        url:'http://www.itcast.cn',
        size:44
    },
    methods:{
        change:function () {
            this.result = add(Number.parseInt(this.num1), Number.parseInt(this.num2))
            // this.result = Number.parseInt(this.num1)+Number.parseInt(this.num2)
            //alert("计算结果："+this.result)
        }
    }
});