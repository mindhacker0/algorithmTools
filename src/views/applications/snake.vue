<template>
    <div class='snake_cnt' :style="{'width':width||'480px'}" v-dragable>
        <div class='head clear-float'>snake<span class='el-icon-close icon' @click="close"></span></div>
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
    name:'greedy-snake',
    comments:{
        
    },
    props: ['width'],
    data() {
        return {
            cavWidth:720,
            cavHeight:200,
            scale:5,//比例
            snake:[{x:0,y:0,color:"green"},{x:5,y:0,color:"green"}],//蛇的组成数组
            score:0,//得分
            speed:200,//蛇移动的间隔ms
            ctx:null,
            direction:"right",
            handleMove:null,//定时器句柄
            food:[],//理论来说只有一个食物，需要多个要改代码
        }
    },mounted() {
        this.ctx=this.$refs.mainCav.getContext("2d");
        console.log(this.ctx);
    },methods: {
        close(){
            clearInterval(this.handleMove);
            this.$emit("execTrans",{fnc:"closeDialog",param:['showSnake']})
        },startGame(){//开始游戏
            let that=this;
            this.drawSnake();
            this.initFood();
            document.addEventListener("keydown",function(event){
                console.log(event);
                if([37,38,39,40].indexOf(event.keyCode)!=-1 && that.handleMove){//有效按键，并且游戏运行按键事件触发
                    that.direction=["left","up","right","down"][event.keyCode-37];console.log(that.direction)
                    that.drawSnake();
                }
            });
        },drawSnake(){
           let that=this;clearInterval(this.handleMove);
           this.handleMove=setInterval(()=>{
                that.ctx.save();
                let ele={...[...that.snake].pop()};
                if(that.direction=="up"){
                    ele.y-=that.scale;
                }
                if(that.direction=="down"){
                    ele.y+=that.scale;
                }
                if(that.direction=="right"){
                    ele.x+=that.scale;
                }
                if(that.direction=="left"){
                    ele.x-=that.scale;
                }
                that.snake.push(ele);//头部,通过原头部和方向判断新头部的位置
                let oldele=that.snake.shift();
                if(that.food.some((item)=>item.x==ele.x&&item.y==ele.y)){//吃到食物了没有 
                    that.snake.unshift({
                        x:oldele.x,
                        y:oldele.y,
                        color:"green"
                    });//后面插入一个元素
                    that.score+=10;//吃掉加10分
                    that.initFood();//吃掉后新增食物
                }
                //边界限制未设置
                that.ctx.fillStyle="white";
                that.ctx.fillRect(oldele.x,oldele.y,5,5);console.log(that.snake,oldele);
                that.ctx.restore();
                that.snake.forEach(item => {
                    that.ctx.save();
                    that.ctx.fillStyle=item.color;
                    // that.ctx.translate(item.x,item.y);
                    that.ctx.fillRect(item.x,item.y,5,5);
                    that.ctx.restore();
                });
            },that.speed);
        },pauseGame(){
            clearInterval(this.handleMove);
        },initFood(){//初始化食物
            let pos={},that=this;
            function getPos(){
                pos.x=Math.ceil((Math.random()*that.cavWidth)/5)*5;
                pos.y=Math.ceil((Math.random()*that.cavHeight)/5)*5;
                that.snake.some((item)=>item.x==pos.x&&item.y==pos.y) && getPos();
            }
            getPos();//获取随机的坐标，但不能在蛇身上
            this.ctx.save();
            that.ctx.fillStyle="red";
            that.ctx.fillRect(pos.x,pos.y,5,5);
            that.ctx.restore();//绘制小红点食物
            that.food.push(pos);
        }
    },
}
</script>
<style lang="scss" scoped>
.snake_cnt{
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