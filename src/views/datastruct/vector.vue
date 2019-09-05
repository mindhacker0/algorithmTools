<template>
    <div class='itemBox_cnt' v-dragable>
       <div class='head clear-float'>vector<span class='el-icon-close icon'></span></div>
       <div class='left_api'>
           <span>调用方法</span>
           <div v-for='item in adt' class='api_btn'>
               <span style='padding:0 5px;'>{{item.name}}</span>
               (<el-input v-model='item.param'  v-if='item.hasParam' style='width:60px;display:inline-block' type="text"></el-input>)
               <span @click='exec(item.name)' style='border:1px solid #fff'>exec</span>
           </div>
       </div>
       <div class='right_info'>
            <div class='show_data'><span v-for='item in baseData'>{{item}}</span></div>
            <div><span>solution:</span><span>{{result}}</span></div>
       </div>
    </div>
</template>

<script>
export default {
    name: "vector",
    components:{
      
    },
    data() {
        return {
            adt:[{
                    name:'size',
                    param:'',
                    hasParam:false
                },{
                    name: 'get',
                    param:'',
                    hasParam:true
                },{
                    name:'put',
                    param:'',
                    hasParam:true
                },{
                    name:'insert',
                    param:'',
                    hasParam:true
                },{
                    name:'remove',
                    param:'',
                    hasParam:true
                },{
                    name:'disordered',
                    param:'',
                    hasParam:false
                },{
                    name:'find',
                    param:'',
                    hasParam:true
                },{
                    name:'search',
                    param:'',
                    hasParam:true
                },{
                    name:'deduplicate',
                    param:'',
                    hasParam:false
                },{
                    name:'uniquify',
                    param:'',
                    hasParam:false
                },{
                    name:'traverse',
                    param:'',
                    hasParam:false
                }],
            baseData:[],
            result:''
        }
    },
    mounted:function(){
        
    },
    methods: {
        exec(cmd){

        },
    },
}
</script>
<style lang="scss" scoped>
    .itemBox_cnt{
        width:1240px;
        background:#efefef;
        .head{
            .icon{
                float:right;
            }
        }
        .left_api{
            width:20%;
            vertical-align:top;
            display:inline-block;
            .api_btn{
                background:#ccc;
                padding:5px;
                cursor:pointer;
            }
        }
        .right_info{
            display:inline-block;
            vertical-align:top;
            width:80%;
        }
    }
</style>