<template>
    <div class='editer_cnt' v-dragable>
        <div class='head clear-float'>meter-Editer<span class='el-icon-close icon'></span></div>
        <div contenteditable @input="inputFunction"  v-model='smsText' class='text_cnt' ref='textcnt' :placeholder='placeholder'>
            
        </div>
        <div class='tools'>
           <div class='tool_tittle'><span>工具栏</span></div>
           <div class='tool_cnt'><span v-for='item in toolbars'>{{item.name}}</span></div>
           <div><span>插入一段文字</span><el-input v-model='insertTxt'></el-input><el-button @click='insert'>插入</el-button></div>
        </div>
    </div>
</template>
<script>
export default {
    name:'meter-edit',
    comments:{
        
    },
    data() {
        return {
            placeholder:'欢迎使用meter-edit',
            toolbars:[
                {
                    name:'加粗',
                    command:'bold'
                }
            ],
            smsText:'',
            insertTxt:''
        }
    },
    mounted() {
        
    },
    methods: {
        insert(){
            let elInput=this.$refs.textcnt;
            let insertTxt='<span contenteditable="false" style="color:red">'+this.insertTxt+'</span>';
            var selection=getSelection();
            let txt = elInput.innerHTML;
            let result = txt.substring(0, selection.anchorOffset) + insertTxt + txt.substring(selection.anchorOffset);
            elInput.innerHTML=result;
            console.log(result,this.smsText);
        },
        inputFunction(){
            console.log('>>>')
        }
    },
}
</script>
<style lang="scss" scoped>
    .editer_cnt{
        min-width:1240px;
        background:#efefef;
        text-align:left;
        border:3px solid #efefef;
        .head{
            text-align:center;
            .icon{
                float:right;
            }
        }
        .text_cnt{
            min-height:120px;
            background:#fff;
            outline:none;
        }
        .text_cnt:empty::before{
            content:attr(placeholder);
            font-size:14px;
            color:#ccc;
            line-height:18px;
        }
        .tools{
            .tool_tittle{
                margin:10px 0 0;
            }
            .tool_cnt{
                overflow:hidden;
                margin:10px 0 0;
                span{
                    display:inline-block;
                    padding:3px 5px;
                    border:1px solid #666;
                    border-radius:6px;
                    margin:0 10px 5px 0;
                }
            }
        }
    }
</style>
