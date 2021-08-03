//this file will stroke dom elements to canvas accroding to type.
class StrokeDom{
    constructor(width,height){
        this.width = width;
        this.height = height;
        this.canvas = document.createElement("canvas");//总的图层
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.ctx = this.canvas.getContext("2d");
        this.history = [];
        this.domLayer = Object.create(null);//dom的图层
        this.addLayer(0);//初始化一个zindex为0的图层，作为基图层
    }
    composeCanvas(){//合成图层,跨域图片会使合成失效
        let sortkey = Object.keys(this.domLayer).sort((a,b)=>a-b>0);
        console.log(sortkey);
        sortkey.forEach((val)=>{
            this.ctx.save();
            this.ctx.putImageData(this.domLayer[val].getImageData(0,0,this.width,this.height),0,0);
            this.ctx.restore();
        });
    }
    addLayer(zIndex){//添加层级
        let canvas = document.createElement("canvas");
        canvas.width = this.width;
        canvas.height = this.height;
        this.domLayer[zIndex] = canvas.getContext("2d");
    }
    drawElment(element){
        let zIndex = element.style.zIndex||0;
        let rect = element.getBoundingClientRect();
        if(!this.domLayer[zIndex]) this.addLayer(zIndex);
        const activeLayer = this.domLayer[zIndex];
        if(element instanceof Image){
            console.log(element.attributes);
            activeLayer.drawImage(element,rect.x,rect.y);
        }
        this.composeCanvas();
    }
}
export default StrokeDom;