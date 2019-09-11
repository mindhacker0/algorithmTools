<template>
    <div class='editer_cnt' v-dragable>
        <div class='head clear-float'>meter-Editer<span class='el-icon-close icon'></span></div>
        <div contenteditable class='text_cnt'>
            
        </div>
        <div class='tools'>
           <div class='tool_tittle'><span>工具栏</span></div>
           <div class='tool_cnt'><span v-for='item in toolbars'>{{item.name}}</span></div>
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
            toolbars:[
                {
                    name:'加粗',
                    command:'bold'
                }
            ]
        }
    },
    mounted() {
        
    },
    methods: {
        
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
