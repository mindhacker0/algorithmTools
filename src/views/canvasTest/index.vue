<template>
    <div style="position:relative;">
        <canvas ref="drawboard" :width="cavWidth" :height="cavHeight"></canvas>
        <div class="toolWrap">
            <div @click="loadFile" class="button"><span>打开</span></div>
            <div @click="reverseFilter" class="button"><span>反色</span></div>
            <div @click="blurFilter" class="button"><span>模糊</span></div>
            <div @click="mosicArea" class="button"><span>马赛克</span></div>
        </div>
    </div>
</template>
<script>
import {openFile} from "../../utils/public";
import {ImageFilter} from "../../utils/Graph";
import {Rect} from "../../utils/Graph/shape";
import {reverseFilter,blurFilter,mosicArea} from "../../utils/Graph/process";
export default {
    name:'canvas-test',
    comments:{
        
    },
    data() {
        return {
            cavWidth:window.innerWidth,
            cavHeight:window.innerHeight,
            image:null,
            context:null,
            drawList:[]
        }
    },mounted() {
        let image = localStorage.getItem("imageCache");
        if(image){this.image = image;this.drawImage(this.image);}
        this.context = this.$refs.drawboard.getContext("2d");
        // this.addCircle()
    },
    methods: {
        loadFile(){
            openFile("*").then(event=>this.fileResolve(event));
        },
        fileResolve(event){
            const elem = event.path[0];
            if(elem){
                let fileList = elem.files;
                var reader = new FileReader();
                reader.readAsDataURL(fileList[0]); // 读出 base64
                reader.onload = ()=>{
                    console.log(reader.result);
                    if(reader.result){
                        this.image = reader.result;
                        localStorage.setItem("imageCache",reader.result);
                        this.drawImage(this.image);
                    }
                }
            }
        },
        drawImage(url){
            const vm = this;
            var image = new Image();
            image.src =url;
            image.onload = function(){
                console.log(this.width,this.height);
                let offsetTop = (vm.cavHeight - this.height)/2;
                let offsetLeft = (vm.cavWidth - this.width)/2;
                if(offsetTop<0) offsetTop = 0;
                if(offsetLeft<0) offsetLeft = 0;
                vm.context.drawImage(image,offsetLeft,offsetTop);
                vm.drawList.push({
                    type:"image",
                    position:new Rect(offsetLeft,offsetTop,this.width,this.height)
                });
            }
        },
        reverseFilter(){//反色滤镜
            let filter = new ImageFilter(this.context,this.drawList[0].position);
            filter.useFilter(reverseFilter);
        },
        blurFilter(){
            let filter = new ImageFilter(this.context,this.drawList[0].position);
            filter.useFilter(blurFilter,20);
        },
        mosicArea(){
            let filter = new ImageFilter(this.context,this.drawList[0].position);
            filter.useFilter(mosicArea);
        },
        async addCircle(from = 0){
            const {context:ctx} = this;
            drawBlinkCircle(ctx,[100,100],100);
            drawBlinkCircle(ctx,[300,100],100);
            drawBlinkCircle(ctx,[500,100],100);
            function drawBlinkCircle(ctx,point,radius){
                let blinkRange = [75,95];//闪动的半径范围
                let tickStep = 2;//动画每次执行增加的半径
                let perCycle = 6;
                let x = point[0],y = point[1];
                async function draw(add,count){
                    count++;
                    if(count%perCycle === 0){
                        console.log(add,count);
                        add+=tickStep;
                        ctx.save();
                        ctx.beginPath();
                        let start = blinkRange[0] + add%(blinkRange[1] - blinkRange[0]);
                        let gradient = ctx.createRadialGradient(x,y,start, x,y,radius);
                        gradient.addColorStop(0,'white');
                        gradient.addColorStop(.9,'rgba(255,255,0,0.3)');
                        gradient.addColorStop(1,'white');
                        ctx.fillStyle = gradient;
                        ctx.arc(x, y, radius, 0, 2*Math.PI);
                        ctx.fill();
                        ctx.closePath();
                        ctx.restore();
                    }
                    requestAnimationFrame(draw.bind(null,add,count));
                }
                draw(0,0);
            }
            function sleep(time){
                return new Promise((resolve,reject)=>{
                    setTimeout(function(){resolve()},time);
                });
            }
        }
    },
}
</script>
<style lang="scss" scoped>
.toolWrap{
    position: absolute;
    left: 0;
    top: 10%;
    .button{
        padding: 0 10px;
        height: 32px;
        line-height: 32px;
        border: 1px solid #666;
        cursor: pointer;
    }
}
</style>