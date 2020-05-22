<template>
    <div class='RussiaBlocks_cnt' :style="{'width':width||'480px'}" v-dragable>
        <div class='head clear-float'>RussiaBlocks<span class='el-icon-close icon' @click="close"></span></div>
        <div class="main">
            <canvas ref="mainCav" :height="cavHeight" :width="cavWidth"></canvas>
        </div>
        <div>分数:{{score}}</div>
        <div>
            <el-button size="small" @click="startGame">开始</el-button>
            <el-button size="small" @click="pauseGame">停止</el-button>
        </div>
    </div>
</template>
<script>
export default {
    name:'Russia-blocks',
    comments:{
        
    },
    props: ['width'],
    data() {
        return {
            cavWidth:480,
            cavHeight:300,
            score:0,//得分
            dropPool:[],//完成下落的元素，看成一个整体，枚举
        }
    },mounted() {
        
    },methods: {
        close(){
            this.$emit("execTrans",{fnc:"closeDialog",param:['showRussiaBlocks']})
        },startGame(){

        },pauseGame(){

        }
    },
}
</script>
<style lang="scss" scoped>
.RussiaBlocks_cnt{
        background:#efefef;
        text-align:left;
        border:3px solid #efefef;
        left:20%;
        top:20%;
        position: absolute;
        .head{
            text-align:center;
            padding:10px 0;
            .icon{
                float:right;
                cursor: pointer;
            }
        }
}
</style>