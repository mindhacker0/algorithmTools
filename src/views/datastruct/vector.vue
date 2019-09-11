<template>
    <div class='itemBox_cnt' v-dragable>
       <div class='head clear-float'>vector<span class='el-icon-close icon'></span></div>
       <div class='left_api'>
           <span>调用方法</span>
           <div v-for='item in adt' class='api_btn'>
               <span style='padding:0 5px;'>{{item.name}}</span>
               (<el-input v-model='item.param'  v-if='item.hasParam' style='width:60px;display:inline-block' type="text"></el-input>)
               <span @click='exec(item.name,item.param)' style='border:1px solid #fff'>exec</span>
           </div>
       </div>
       <div class='right_info'>
            <div class='show_data'><span v-for='item in baseData'>{{item}}</span></div>
            <div><span>solution:</span><span style='color:red;'>{{result}}</span></div>
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
            baseData:[1,2,3,4,5],
            result:''
        }
    },
    mounted:function(){
        
    },
    methods: {
        exec(cmd,param){
            let _param=param.split(',');
            let that=this;
            console.log(_param);
            switch(cmd){
                case 'size':this.result=this.baseData.length;break;
                case 'get':this.result=this.baseData[_param[0]] || 'undefined';break;
                case 'put':this.result=put(_param);break;
                case 'insert':this.result=insert(_param);break;
                case 'remove':this.result=this.baseData.length;break;
                case 'disordered':this.result=this.baseData.length;break;
                case 'find':this.result=this.baseData.length;break;
                case 'search':this.result=this.baseData.length;break;
                case 'deduplicate':this.result=this.baseData.length;break;
                case 'uniquify':this.result=this.baseData.length;break;
                case 'traverse':this.result=this.baseData.length;break;
                default:throw new error('unrecongnize symbol');break;
            }
            function put(param){
                let pre=that.baseData[param[0]];
                that.baseData[param[0]]=param[1];
                console.log(that.baseData);
                return pre||'undefined';
            }
            function insert(param){
                that.baseData.splice([param[0]],0,param[1]);
                console.log(that.baseData);
                return that.baseData||'undefined';
            }
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
            .show_data{
                span{
                    padding:3px;
                    height:32px;
                    line-height:32px;
                    border-width:1px 1px 1px 0;
                    border-style:solid;
                    border-color:#fff;
                    &:first-child{border:1px solid #fff;}
                }
            }
        }
    }
</style>