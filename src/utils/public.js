export const openFile = function(accept){//will not be call if user dont interact with browser.
    return new Promise((resolve,reject)=>{
        let fileInput = document.createElement("input");
        fileInput.setAttribute("display","none");
        fileInput.setAttribute("type","file");
        fileInput.setAttribute("accept",accept);
        fileInput.addEventListener("change",(e)=>{
            resolve(e);
        });
        fileInput.click();
    })
    
}
let wmap = new WeakMap();
function tranverse(obj,path=''){
    for(var i in obj){
        if(typeof obj[i] === 'object' && obj[i]!==null && !wmap.get(obj[i])){
            wmap.set(obj[i],true);
            tranverse(obj[i],path+'/'+i);
        }else if(deviceType.includes(obj[i])){
            console.log(i,obj[i],path);
        }
    }
}
//主要是为了minemap模拟百度地图的动圈动画效果，添加canvas图层
class blinkCircle{
    constructor(ctx,center,radius){
        this.ctx = ctx;
        this.radius = radius;
        this.center = center;
        this.blinkRange = [radius*0.7,radius*0.95];//闪动的半径范围
        this.step = 0;//当前的步骤
        this.period = 16;//几个动画为一个周期,不能为0
    }
    draw(){
        const {ctx,blinkRange,radius,center:[x,y],period,step} = this;
        ctx.beginPath();
        let start = blinkRange[0] + (blinkRange[1] - blinkRange[0])*((step%period)/period);
        let gradient = ctx.createRadialGradient(x,y,start,x,y,radius);
        gradient.addColorStop(0,'rgba(255,255,255,0)');
        gradient.addColorStop(0.2,'rgba(255,255,255,0)');
        gradient.addColorStop(1,'rgba(255,255,0,0.8)');
        ctx.fillStyle = gradient;
        ctx.arc(x, y, radius, 0, 2*Math.PI);
        ctx.fill();
        ctx.closePath();
    }
    update(){
        this.step++;
        this.draw();
    }
}
class AccompanyCircle{
    constructor(canvasElem){
        const {width,height} = canvasElem.getBoundingClientRect();
        this.width = width;
        this.height = height;
        this.addCanvas = this.createCanvas(width,height);
        this.pointList = [];//添加的节点
        this.requestId = null;
        this.state = 0;//0停止状态，1动画进行
    }
    createCanvas(width,height){//创建canvas元素
        let canavs = document.getElementById("addCanvas");
        if(canavs) return canavs;
        let elem = document.createElement("canvas");
        elem.setAttribute("width",width);
        elem.setAttribute("height",height);
        elem.setAttribute("id","addCanvas");
        elem.style.display = "none";
        document.body.appendChild(elem);
        return elem;
    }
    sleep(time){//异步阻塞
        return new Promise((resolve,reject)=>{
            setTimeout(function(){resolve()},time);
        });
    }
    drawBlinkCircle(points){
        let ctx = this.addCanvas.getContext("2d");
        let _this = this;
        this.pointList = points.map(({center,radius})=>new blinkCircle(ctx,center,radius));
        this.state = 1;
        async function draw(){
            ctx.clearRect(0,0,_this.width,_this.height);
            _this.pointList.forEach(element => {
                element.update();
            });
            await _this.sleep(100);//控制动画速度
            if(_this.state === 1) _this.requestId = window.requestAnimationFrame(draw);
        }
        draw();
    }
    destory(){
        this.state = 0;
        window.cancelAnimationFrame(this.requestId);
    }
}
export default AccompanyCircle;