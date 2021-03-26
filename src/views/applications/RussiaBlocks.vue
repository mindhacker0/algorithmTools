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
        <div>
            <div v-for="item in bootMap" style="height:5px;line-height:5px;">
                <div v-for="block in item" :style="'width:5px;height:5px;display:inline-block;background-color:'+block.color"></div>
            </div>
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
            cavWidth:100,//宽高必须为大小的整数倍 px
            cavHeight:200,
            block_size:10,//方块的大小px
            score:0,//得分
            bootMap:[],//已下落的元素构成的填充地图
            falling:{},//当前正在下落的方块
            fall_step:0,//下落的距离
            handleMove:null,//定时器句柄
            fallSpeed:300,//下落的速度
            prevblock:[],//记录之前的方块，以便清除
            footblock:[],//到了底部后停留在底部的方块
            eventQueue:[],//等待消费的事件
        }
    },mounted() {
        this.ctx=this.$refs.mainCav.getContext("2d");
        for(var i=0;i<this.cavHeight/this.block_size;i++){//初始化地图映射
            this.bootMap.push([]);
            for(var j=0;j<this.cavWidth/this.block_size;j++){
                this.bootMap[i].push({
                    fill:0,
                    color:"transparent"
                })
            }
        }
        console.log(this.bootMap);
    },methods: {
        close(){
            clearInterval(this.handleMove);
            this.$emit("execTrans",{fnc:"closeDialog",param:['showRussiaBlocks']})
        },startGame(){
            let that=this;
            if(that.handleMove){return;}
            this.score=0;
            this.drawRB();
            document.addEventListener("keydown",function(event){
                if([32,37,38,39,40].indexOf(event.keyCode)!=-1 && that.handleMove){//有效按键，并且游戏运行按键事件触发
                    that.eventQueue.push(event.code);//生产键盘事件
                }
            });
        },drawRB(){
            let that=this;
            clearInterval(this.handleMove);
            let isinboot=true;//新的方块是否已经到了底部
            this.handleMove=setInterval(() => {//主函数循环
                that.ctx.save();
                if(isinboot){//如果有方块到了底部新建一个方块
                    that.falling=that.makeblock();
                    isinboot=false;
                    that.fall_step=0;
                }
                if(that.prevblock.length){//清除前一个方块的痕迹
                    let obj=that.prevblock.pop();
                    that.drawblock(obj.falling,obj.fall_step,true);
                }
                let eventItem;
                while(eventItem=that.eventQueue.pop()){//消费按键事件
                    switch(eventItem){
                        case "ArrowLeft":!that.hasCollapse(that.falling,"left") && that.falling.position--;break;
                        case "ArrowRight":!that.hasCollapse(that.falling,"right") && that.falling.position++;break;
                    }
                }
                that.drawblock(that.falling,that.fall_step,false);//绘制新的方块
                that.prevblock.push({//旧方块入栈
                    falling:that.falling,
                    fall_step:that.fall_step
                });
                if(!that.hasCollapse(that.falling)){//判断方块是否和底部的方块碰撞
                    that.fall_step++;
                }else{
                    isinboot=true;
                    that.footblock.push(that.prevblock.pop());
                    that.refreshFoot();
                }//底部的不需要清理，直接弹出压入已完成移动的数组
                that.ctx.restore();
            }, this.fallSpeed);
        },pauseGame(){
            clearInterval(this.handleMove);
        },makeblock(){//随机出现一个方块,单位是1方块 方块的高度就用数组的第一个长度凑合
            var falling_block=this.russia_block[0|Math.random()*19];
            var block_height=falling_block.arr.length;
            var block_width = falling_block.arr[0].length;
            var position_h=0|Math.random()*((this.cavWidth/this.block_size)-block_width);//初始的位置是随机的
            return {block:falling_block,position:position_h,color:this.randomColor(),block_width:block_width,block_height:block_height}
        },randomColor(){//随机方块颜色
            return ["#fec433","#ffa23e","#b8e745","#ff7659","#69b5fa","#d366f8"][Math.ceil(Math.random()*6)-1]
        },drawblock(block,step,isclean){//清除或者绘制方块
            let that=this;
            for(let i=0;i<block.block.arr.length;i++){
                for(let j=0;j<block.block.arr[i].length;j++){
                    if(block.block.arr[i][j]){
                        if(isclean){//脏区清除清除的区域要比原来的大一些，小方块是有边框的
                            that.ctx.save();
                            that.ctx.clearRect((block.position+j)*that.block_size,
                            (step+i)*that.block_size,that.block_size,that.block_size);
                            that.ctx.restore();
                        }else{//绘制小方块
                            that.ctx.save();
                            that.ctx.strokeStyle=block.color;
                            that.ctx.lineWidth=1;
                            that.ctx.strokeRect((block.position+j)*that.block_size+1,
                            (step+i)*that.block_size+1,that.block_size-2,that.block_size-2)
                            that.ctx.restore();
                        }
                    }
                }
            }
        },hasCollapse(falling,direction="bottom"){//计算碰撞
            let vertical_baise=0,horizontal_baise=0;
            if(direction==="bottom"){//如果向下会碰撞吗
                if(falling.block_height+this.fall_step+1>this.cavHeight/this.block_size){//和底部碰撞停止
                    return true;
                }
                vertical_baise=1;
            }
            if(direction === "left"){//如果向左会碰撞吗
                if(falling.position-1<0){//左碰撞
                    return true;
                }
                horizontal_baise=-1;
            }
            if(direction === "right"){//如果向右会碰撞吗
                if(falling.position+1>((this.cavWidth/this.block_size)-falling.block_width)){//右碰撞
                   return true;
                }
                horizontal_baise=1;
            }
            for(var i=0;i<falling.block_height;i++){
                for(var j=0;j<falling.block_width;j++){
                    if(falling.block.arr[i][j] + this.bootMap[this.fall_step+i+vertical_baise][falling.position+j+horizontal_baise].fill === 2){//元素有重合碰撞
                        return true;
                    }
                }
            }
            return false;
        },refreshFoot(){//更新地图，并检测是否有底部可以消除进而得分
            //todo
            this.footblock.map((val,index)=>{
                let obj = val.falling.block;
                for(var i=0;i<val.falling.block_height;i++){//初始化地图映射
                    for(var j=0;j<val.falling.block_width;j++){
                        if(obj.arr[i][j]===1){
                            this.bootMap[val.fall_step+i][val.falling.position+j]={
                                fill:obj.arr[i][j],
                                color:val.falling.color
                            }
                        }
                    }
                }
            });
            this.footblock=[];
            let newBotMap=JSON.parse(JSON.stringify(this.bootMap)),shuldRend=false;
            this.bootMap.map((val,key)=>{
                if(val.every(val=>val.fill===1)){//这一行满了，可以得分
                    newBotMap.splice(key,1);
                    console.log("score",key);
                    let addArr=new Array(this.cavWidth/this.block_size).fill({
                            fill:0,
                            color:"transparent"
                        });
                    newBotMap.unshift(addArr);
                    this.score+=10;
                    shuldRend=true;
                }
            });
            this.bootMap=newBotMap;
            if(shuldRend){this.renderMap();}//当底部有更新时刷新底部
        },renderMap(){
            this.ctx.save();
            for(var i=0;i<this.bootMap.length;i++){
                for(var j=0;j<this.bootMap[i].length;j++){
                    if(this.bootMap[i][j].fill === 1){
                        this.ctx.strokeStyle=this.bootMap[i][j].color;
                        this.ctx.lineWidth=1;
                        this.ctx.strokeRect((j)*this.block_size+1,
                        (i)*this.block_size+1,this.block_size-2,this.block_size-2);
                    }else{
                        this.ctx.clearRect((j)*this.block_size,
                        (i)*this.block_size,this.block_size,this.block_size);
                    }
                }
            }
            this.ctx.restore();
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