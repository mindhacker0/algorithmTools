class Timeline{ 
    constructor(){
        this.animations = new Set(); 
        this.finishedAnimaions = new Set(); 
        this.addTimes = new Map(); 
        this.requestID = null; 
        this.state = "inited";
        this.onFinishAll = ()=>{};//所有动画都完成的回调
        this.tick = () => {
            let t = Date.now() - this.startTime;
            for(let animation of this.animations){
                let {object, property, template, start, end, duration, timingFunction, delay} = animation;
                let addTime = this.addTimes.get(animation);
                if(t < delay + addTime) continue;
                let progression = timingFunction((t - delay - addTime)/duration); //0-1之间的数值
                if(t > duration + delay + addTime) {//该动画完成动画完成
                    progression = 1;
                    this.animations.delete(animation);
                    this.finishedAnimaions.add(animation);
                }
                let value = animation.valueFromProgression(progression);
                object[property] = template(value);
                if(progression === 1 && this.animations.size === 0) this.onFinishAll(this);
            }
            if(this.animations.size){
                this.requestID = requestAnimationFrame(this.tick);
            }else{
                this.requestID = null;
            }            
        }
    }
    pause(){ 
        if(this.state !== "playing") return; 
        this.state = "paused";
        this.pauseTime = Date.now();
        if(this.requestID !== null){ 
            cancelAnimationFrame(this.requestID); 
            this.requestID = null;
        }
    }
    resume(){
        if(this.state !== "paused") return;
        this.state = "playing"
        this.startTime += Date.now() - this.pauseTime; 
        this.tick();
    }
    start(){
        if(this.state !== "inited") return;
        this.state = "playing";
        this.startTime = Date.now();
        this.tick();
    }
    reset(){
        if(this.state === "playing") this.pause(); 
        this.animations = new Set; 
        this.finishedAnimaions = new Set; 
        this.addTimes = new Map; 
        this.requestID = null; 
        this.startTime = Date.now(); 
        this.pauseTime = null; 
        this.state = "inited";
    }
    restart(){
        if(this.state === "playing") this.pause();
        for(let animation of this.finishedAnimaions)
        this.animations.add(animation);
        this.finishedAnimaions = new Set();
        this.requestID = null;
        this.state = "playing";
        this.startTime = Date.now();
        this.pauseTime = null;
        this.tick();
    }
    add(animation, addTime){
        this.animations.add(animation);
        if(this.state === "playing" && this.requestID === null)
          this.tick();
        if(this.state === "playing")
          this.addTimes.set(animation, addTime !== void 0 ? addTime : Date.now() - this.startTime)
        else
          this.addTimes.set(animation, addTime !== void 0 ? addTime : 0);
    }
}
/*
* @param object {domElement.style} 传入dom的style对象，以便于添加该元素的动画
* @param property {one of CssStyle(string)} 传入dom的style属性，基于该属性的动画
* @param start {startNumber} 传入属性的起始值
* @param end {endNumber} 传入属性的结束值
* @param delay {(Number)} 传入开始动画的时间
* @param timingFunction {(Function)} 时间函数，即数值和时间的关系函数
* @param template {(Function)} 模板函数，设置属性时添加单位或其它
*/
class Animation {
    constructor(object, property, start, end, duration, delay, timingFunction, template) { 
        this.object = object;
        this.template = template; 
        this.property = property; 
        this.start = start;
        this.end = end;
        this.duration = duration;
        this.delay = delay; 
        this.timingFunction = timingFunction; //ease linear easeln easeOut
        this.additionProcess = 0;
    }
    valueFromProgression(progression){
        return this.start + progression * (this.end - this.start);
    }
}
class ColorAnimation{
    constructor(object, property , start, end, duration, delay, timingFunction, template) { 
        this.object = object;
        this.template = template || (v =>`rgba(${v.r}, ${v.g}, ${v.b}, ${v.a})`); 
        this.property = property;
        this.start = start; 
        this.end = end; 
        this.duration = duration;
        this.delay = delay; 
        this.timingFunction = timingFunction;
    }
    valueFromProgression(progression){
        return {
            r: this.start.r + progression * (this.end.r - this.start.r), 
            g: this.start.g + progression * (this.end.g - this.start.g), 
            b: this.start.b + progression * (this.end.b - this.start.b), 
            a: this.start.a + progression * (this.end.a - this.start.a),
        }
    }
}
export {
    Timeline,
    Animation,
    ColorAnimation,
}