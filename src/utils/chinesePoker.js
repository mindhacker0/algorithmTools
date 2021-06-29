const query = Symbol("query");
const king = Symbol("king");
const King = Symbol("King");
const pokerToken = ['3','4','5','6','7','8','9','10','J','Q','K','A','2',king,King];
const backImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAGCAIAAAEYqUiJAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAxZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MjJCNkIxRjMxMEIzMTFFQTg4MTVEOTIzQkFBRjE1NzciIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MjJCNkIxRjIxMEIzMTFFQTg4MTVEOTIzQkFBRjE1NzciIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9Ijc3MDExMzNENEU4OUZCNEQ0NDkxRUQ4OThFOEJBQkU5IiBzdFJlZjpkb2N1bWVudElEPSI3NzAxMTMzRDRFODlGQjRENDQ5MUVEODk4RThCQUJFOSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PscIFYQAAAB0SURBVHjaYvj67QdAADH8//cfIIAY////z8DAABBADJ+//2IAMgECiOHjt1/vfgAZfwECiOH1+09A+X///zP9YeJgYPz3j4EBppiBASDAGF+++/SHkY2RkVGSnwXI/8vABJUEkkBRiComoMAfoCSM/5eBAQDKyzU5/CcN5QAAAABJRU5ErkJggg==';
const Icon = require("./image/icon.jpeg");
export default class ChinesePoker{
    constructor(elem){
        this.el = this[query](elem);
        if(!this.el) return;
        this.context = this.el.getContext("2d");
        this.context.globalAlpha ="1";
        this.context.imageSmoothingEnabled = false;
        this.cards =  this.initCards();
        this.dispatchArr = [];//发牌
        this.remainArr = [];//预留的牌
    }
    start(){
        let nextCall = this.drawAllCards();
        this.runGenerator(nextCall);
        this.dispatchCards(3);
        console.log(this.dispatchArr);
    }
    runGenerator(nextFn){
        //let next = nextFn();
        console.log(nextFn);
    }
    *drawAllCards(){//绘制所有纸牌
        const {context}=this;
        for(let i = 0;i< this.cards.length;i++){
          let s = yield this.drawCard(200+2*i,20,this.cards[i],1);
          console.log(s);
        }  
    }
    sleep(time){
        return new Promise((resolve,reject)=>{
            setTimeout(function(){resolve()},time);
        });
    }
    async drawCard(x,y,obj,type){
      await this.drawRoundReact(x,y,120,160,6,type);
      await this.fillFront(x,y,120,160,obj);
      await this.sleep(1000);
      return true;
    }
    fillFront(x,y,w,h,obj){
        const {context}=this;
        return new Promise((resolve,reject)=>{
            let imageElem = new Image();
            imageElem.src = Icon;
            imageElem.onload = function(){
                context.save();
                context.fillStyle = "#000";
                if(typeof obj.token === "string"){
                    context.fillText(obj.token,x+15,y+15,20);
                }
                context.restore();
                resolve();
            }
        });
    }
    //[x,y]start position
    //[w,h]width and height of the rect
    //r radius
    drawRoundReact(x,y,w,h,r,type){
        const {context}=this;
        return new Promise((resolve,reject)=>{
            let imageElem = new Image();
            imageElem.src = backImage;
            imageElem.onload = function(){
                context.save();
                context.beginPath();
                context.moveTo(x+r,y);
                context.arcTo(x+w,y,x+w,y+h,r);
                context.arcTo(x+w,y+h,x,y+h,r);
                context.arcTo(x,y+h,x,y,r);
                context.arcTo(x,y,x+w,y,r);
                context.stroke();
                if(type === 0){
                    context.fillStyle = context.createPattern(this,"repeat");
                }else{
                    context.fillStyle = "#fff";
                }
                context.fill();
                context.restore();
                resolve();
            }
        })  
    }
    [query](el) {
        if (typeof el === 'string') {
          var selected = document.querySelector(el);
          if (!selected) {
            console.warn(
              'Cannot find element: ' + el
            );
            return document.createElement('div')
          }
          return selected
        } else {
          return el
        }
    }
    initCards(){//创建纸牌
        var allCards = [];
        for(var i =0;i<pokerToken.length;i++){
            if(typeof pokerToken[i] === "string"){
                for(var j =0;j<=3;j++) allCards.push({
                    token:pokerToken[i],
                    rank:i,
                    type:j
                });
            }else{
                allCards.push({
                    token:pokerToken[i],
                    rank:i
                });
            }
        }
        return allCards;
    }
    dispatchCards(nums){//发牌
        let disorderCards = this.cards.sort(()=>Math.random()-0.5);
        for(let i=0;i<3;i++){
            this.remainArr.push(disorderCards.pop());
        }
        let dispatchArr = new Array(nums);
        while(disorderCards.length){
            for(let i = 0;i<nums;i++){
                let obj = {role:i,card:disorderCards.pop()};
                if(typeof dispatchArr[i] !== "object") dispatchArr[i] = new Array();
                dispatchArr[i].push(obj);
            }
        }
        this.dispatchArr = dispatchArr;
        return dispatchArr;
    }
} 