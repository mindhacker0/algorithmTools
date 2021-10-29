//封装处理图像数据的函数
/**
* data:图像数据
* dataW:图像数据宽度
* dataH:图像数据高度
**/
import {doTransition} from "./tools";
export function reverseFilter(data,dataW,dataH){//反色
    for(var i=0;i<data.length;i+=4){
        var r = data[i];
        var g = data[i+1];
        var b = data[i+2];
        data[i] = 255 - r;
        data[i+1] = 255 - g;
        data[i+2] = 255 - b;
    }
    console.log(data);
    return data;
}
// times模糊程度，就是对图像求几次平均值
export function blurFilter(data,dataW,dataH,times=1){//模糊
    let fn =()=>{
        console.log("blur");
        for(var i=0;i<data.length;i+=4){
            var r = data[i];
            var g = data[i+1];
            var b = data[i+2];
            data[i] = (r+data[i-4]+data[i+4])/3;
            data[i+1] = (g+data[i-3]+data[i+5])/3;
            data[i+2] = (b+data[i-2]+data[i+6])/3;
        }
    };
    doTransition(fn,times);
    console.log(data);
    return data;
}
//马赛克
export function mosicArea(data,dataW,dataH){
    for(var i=0;i<data.length;i+=4){
        var r = data[i];
        var g = data[i+1];
        var b = data[i+2];
        let line = Math.floor(i/dataW);
        let row = i%dataW;
        if(line%2 === 0 && row%8===0){
            console.log(i);
            data[i+4] = r;
            data[i+5] = g;
            data[i+6] = b;
        }
    }
}