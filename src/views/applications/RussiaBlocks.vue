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
            cavWidth:480,//宽高必须为大小的整数倍 px
            cavHeight:300,
            block_size:5,//方块的大小px
            score:0,//得分
            dropPool:[],//方块化整个画布
            falling:{},
            fall_step:0,//下落的距离
            handleMove:null,
            fallSpeed:200,//blocksize per
            prevblock:[],//记录之前的方块，以便清除
            footblock:[],//到了底部后停留在底部的方块
        }
    },mounted() {
        this.ctx=this.$refs.mainCav.getContext("2d");
    },methods: {
        close(){
            this.$emit("execTrans",{fnc:"closeDialog",param:['showRussiaBlocks']})
        },startGame(){
           this.drawRB();
        },drawRB(){
            let that=this;clearInterval(this.handleMove);
            let isinboot=true;//新的方块是否已经到了底部
            this.handleMove=setInterval(() => {
                that.ctx.save();
                if(isinboot){//如果有到了底部新建一个方块
                    that.falling=that.makeblock();
                    isinboot=false;
                    that.fall_step=0;
                }
                if(that.prevblock.length){//清除前一个方块的痕迹
                    let obj=that.prevblock.pop();console.log(obj)
                    that.drawblock(obj.falling,obj.fall_step,true);
                }
                that.drawblock(that.falling,that.fall_step,false);//绘制新的方块
                that.prevblock.push({
                    falling:that.falling,
                    fall_step:that.fall_step
                });
                if(that.fall_step<(that.cavHeight/that.block_size-that.falling.block_height)){
                    that.fall_step++;
                }else{isinboot=true;that.footblock.push(that.prevblock.pop());}//底部的不需要清理，直接弹出压入已完成移动的数组
                that.ctx.restore();
            }, this.fallSpeed);
        },pauseGame(){

        },makeblock(){//随机出现一个方块,单位是1方块 方块的高度就用数组的第一个长度凑合
            var falling_block=this.russia_block[0|Math.random()*19];
            var block_width=falling_block.arr.length;
            var position_h=0|Math.random()*((this.cavWidth/this.block_size)-block_width);
            return {block:falling_block,position:position_h,color:this.randomColor(),block_width:block_width,block_height:falling_block.arr[0].length}
        },randomColor(){//音乐素材随机背景颜色
            return ["#fec433","#ffa23e","#b8e745","#ff7659","#69b5fa","#d366f8"][Math.ceil(Math.random()*6)-1]
        },drawblock(block,step,isclean){//清除或者绘制方块
            let that=this;
            for(let i=0;i<block.block.arr.length;i++){
                for(let j=0;j<block.block.arr[i].length;j++){
                    if(block.block.arr[i][j]){
                        if(isclean){//脏区清除清除的区域要比原来的大一些
                            that.ctx.save();
                            that.ctx.clearRect((block.position+i)*that.block_size,
                            (step+j)*that.block_size,that.block_size,that.block_size);
                            that.ctx.restore();
                        }else{//绘制小方块
                            that.ctx.save();
                            that.ctx.strokeStyle=block.color;
                            that.ctx.lineWidth=1;
                            that.ctx.strokeRect((block.position+i)*that.block_size+1,
                            (step+j)*that.block_size+1,that.block_size-2,that.block_size-2)
                            that.ctx.restore();
                        }
                    }
                }
            }
        },getBootMaxHeight(falling){//计算底部的碰撞 计算出底部元素的每个位置的大小，来比较
        let vetor=new Array()
            this.footblock.map(()=>{

            })
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