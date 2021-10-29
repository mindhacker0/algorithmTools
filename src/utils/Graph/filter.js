import {Rect} from "./shape";
class ImageFilter{
    constructor(context,rect){
        this.context = context;
        this.rect = null;
        this.setRect(rect);
        const {x,y,width,height} = rect;
        this.imageData = this.context.getImageData(x, y,width,height);
    }
    setRect(rect){//设置滤镜区域
        if(!(rect && rect instanceof Rect)){throw ReferenceError("rect is required,specific the filter Area")};
        this.rect = rect;
    }
    useFilter(filter,...params){//使用滤镜
        const {x,y} = this.rect;
        const {imageData} = this;
        let data = imageData.data;
        let dataW = imageData.width,dataH = imageData.height;
        filter.call(this,data,dataW,dataH,...params);
        this.context.putImageData(imageData,x,y);
    }
}

export default ImageFilter;