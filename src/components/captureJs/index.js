import StrokeDom from "./domToCanvas";
class Capture {//组件，用于屏幕截图
    constructor(container, options = {}) {
        this.root = container || document.body;
        this.shader = null;
        this.domCollects = [];
        this.root.addEventListener("keydown", this.handleKeyDown.bind(this));
        this.root.addEventListener("mousedown", this.handleMouseDown.bind(this));
        this.root.addEventListener("mouseup", this.handleMouseUp.bind(this));
    }
    handleKeyDown(e) {
        if (e.altKey && e.keyCode === 82) {//alt+r开启截图
            console.log("开始截图");
            this.drawShader();
            this.getDomInArea(0,0,document.body.clientWidth,document.body.clientHeight);
            e.preventDefault();
        }
    }
    drawShader() {//添加蒙版
        let elements = document.createElement("div");
        let cssText = `height:${document.body.clientHeight}px;width:${document.body.clientWidth}px;`;
        cssText += "position:fixed;left:0;top:0;background:rgba(0,0,0,.3);";
        elements.style.cssText = cssText;
        document.body.append(elements);
        this.shader = elements;
    }
    getDomInArea(x,y,width,height){//获取选中区域的所有DOM元素
        let drawer = new StrokeDom(width,height);
        this.tranverseELements(document.body,(element)=>{
            drawer.drawElment(element);
        });
        drawer.canvas.style.position="absolute";
        drawer.canvas.style.left=`${x}px`;
        drawer.canvas.style.top=`${y}px`;
        this.shader.appendChild(drawer.canvas);
    }
    tranverseELements(parent,eachCall){//遍历所有的元素节点
        if(parent instanceof Element){
            typeof eachCall === "function" && eachCall(parent);
            let children = parent.children;
            if(typeof children === "object" && children.length){
                for(var i in children){
                    this.tranverseELements(children[i],eachCall);
                }
            }
        }
    }
    handleMouseDown(e) {
        console.log(e)
    }
    handleMouseUp(e){
        
    }
}

new Capture();