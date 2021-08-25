<template>
    <div class='bot_task'>
        <div class='begain' @click="newPrint">打印</div>
        <el-table
        id="printMe"
    :data="tableData"
    stripe
    style="width: 100%">
    <el-table-column
      prop="date"
      label="日期"
      width="180">
    </el-table-column>
    <el-table-column
      prop="name"
      label="姓名"
      width="180">
    </el-table-column>
    <el-table-column
      prop="address"
      label="地址">
    </el-table-column>
  </el-table>
    </div>
</template>

<script>
import Print from "../../pakage/printJs";
export default {
    name: "tasklist",
    components:{
      
    },
    data() {
        return {
            tableData: [{
                date: '2016-05-02',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: '2016-05-04',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1517 弄'
            }, {
                date: '2016-05-01',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1519 弄'
            }, {
                date: '2016-05-03',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1516 弄'
            }],
            printObj: {
              id: "printMe",
              preview:true,
              popTitle: 'good print',
              extraCss: "https://cdn.bootcdn.net/ajax/libs/animate.css/4.1.1/animate.compat.css, https://cdn.bootcdn.net/ajax/libs/hover.css/2.3.1/css/hover-min.css",
              extraHead: '<meta http-equiv="Content-Language"content="zh-cn"/>',
              beforeOpenCallback (vue) {
                vue.printLoading = true
                console.log('打开之前')
              },
              openCallback (vue) {
                vue.printLoading = false
                console.log('执行了打印')
              },
              closeCallback (vue) {
                console.log('关闭了打印工具')
              }
            }
        }
    },
    mounted:function(){
       
    },
    methods:{
        newPrint(){
            new Print({
                el:"#printMe",
                title:"小白白"
            })
        }
    }
}
</script>
<style lang="scss" scoped>
    .bot_task{
        position:fixed;
        bottom:0;
        left:0;
        width:100%;
        border:1px solid rgba(23,24,25,.6);
        background:rgba(32,98,231,.6);
        .begain{
            margin-left: 600px;
            max-width:120px;
            height:32px;
            line-height:32px;
            border-radius:4px;
            cursor:pointer;
            background:linear-gradient(-45deg, white,black);
            color:#fff;
        }
    }
</style>