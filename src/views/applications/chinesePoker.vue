<template>
    <div class='poker_cnt' :style="{'width':width||'840px'}" v-dragable>
        <div class='head clear-float'>poker<span class='el-icon-close icon' @click="close"></span></div>
        <div class="main">
            <canvas ref="mainCav" :height="cavHeight" :width="cavWidth"></canvas>
        </div>
        <div>分数:{{score}}</div>
        <div>
            <el-button size="small" @click="startGame">开始</el-button>
        </div>
    </div>
</template>
<script>
import ChinesePoker from "../../utils/chinesePoker";
export default {
    name:'chinese-poker',
    comments:{
        
    },
    props: ['width'],
    data() {
        return {
            cavWidth:720,
            cavHeight:500,
            score:0,
            game:null
        }
    },mounted() {
    },methods: {
        close(){
            this.$emit("execTrans",{fnc:"closeDialog",param:['showPoker']})
        },startGame(){
            this.game = new ChinesePoker(this.$refs.mainCav);
            this.game.start();
        },

    },
}
</script>
<style lang="scss" scoped>
.poker_cnt{
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