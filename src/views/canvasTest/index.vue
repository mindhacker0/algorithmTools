<template>
    <div style="position:relative;">
        <canvas ref="drawboard" :width="cavWidth" :height="cavHeight"></canvas>
        <div class="toolWrap">
            <div @click="loadFile" class="button"><span>打开</span></div>
            <div @click="reverseFilter" class="button"><span>反色</span></div>
            <div @click="grayScaleFilter" class="button"><span>模糊</span></div>
        </div>
    </div>
</template>
<script>
import {openFile} from "../../utils/public";
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
        if(image){this.image = image;}
        this.context = this.$refs.drawboard.getContext("2d");
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
                    x:offsetLeft,
                    y:offsetTop,
                    width:this.width,
                    height:this.height
                })
            }
        },
        reverseFilter(){//反色滤镜
            let {x,y,width,height} = this.drawList[0];
            let imageData = this.context.getImageData(x, y,width/2,height/2);
            let data = imageData.data;
            for(var i=0;i<data.length;i+=4){
                var r = data[i];
                var g = data[i+1];
                var b = data[i+2];
                data[i] = 255 - r;
                data[i+1] = 255 - g;
                data[i+2] = 255 - b;
            }
            console.log(imageData);
            this.context.putImageData(imageData,x,y);
        },
        grayScaleFilter(){
            let {x,y,width,height} = this.drawList[0];
            let imageData = this.context.getImageData(x, y,width/2,height/2);
            let data = imageData.data;
            let dataW = imageData.width,dataH = imageData.height;
            for(var i=0;i<data.length;i+=4){
                var r = data[i];
                var g = data[i+1];
                var b = data[i+2];
                data[i] = (r+data[i+4]+data[i-4])/3;
                data[i+1] = (g+data[i+5]+data[i-3])/3;
                data[i+2] = (b+data[i+6]+data[i-2])/3;
            }
            this.context.putImageData(imageData,x,y);
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