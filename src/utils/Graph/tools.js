export function doTransition(fn,times) {//循环调用函数
    let count = 0;
    let tick = function(){
        count++;
        if(count%20===0){fn.call(null);}
        if(count>=(times*20)){console.log(times,count);}
        else{tick();}
    };
    tick();
}