<!--
可以实现鼠标无限滚动数据
可以实现无缝轮播
鼠标移入可以立即停止动作，可以正常恢复
*使用方式
<swiper 
:listData="swiperData"
:page-perview="3"
>
    <template slot="swiper-item" slot-scope="{item}">
        <div class="swiper-item">
            <div class="img"><img :src="item.url"/></div>
            <div class="info">
                <div class="name">{{item.name}}</div>
                <div class="des">{{item.des}}</div>
            </div>
        </div>
    </template>
</swiper>
props列表:
listData:轮播的数据
pagePerview:一屏展示的项数
delay:轮播间隔
speed:动画的速度
direction:轮播方向 oneof[next,prev]
-->
<template>
    <div ref="swiper" class='govnet-swiper'>
        <div class='swiper-screen'>
            <div 
            v-for="(item,idx) in swiperData" 
            :key="`swiper-item-${idx}`"
            v-bind:[`item-index-${idx}`]="''"
            class='swiper-item-wrapper'>
                <slot name="swiper-item" :item="item"></slot>
            </div>
        </div>
    </div>
</template>

<script>
//改变dom实现无缝轮播
import {Timeline,Animation} from "./animation";
import {cubicBezier,ease,easeOut,easeInOut,easeIn} from "./timeFunction";
export default {
    name: "swiper",
    props:{
        listData:{//轮播的列表信息
            type: Array,
            required: true,
        },
        pagePerview:{//一屏展示的列数
            type: Number,
            default: 1
        },
        delay:{//轮播间隔毫秒
            type: Number,
            default: 3000
        },
        speed:{//动画速度毫秒
            type: Number,
            default: 1000
        },
        mouseWheelSpeed:{//越小，鼠标滚动一次移动的距离越大,滚动距离大于一屏将导致无限滚动失效
            type: Number,
            default: 10
        },
        direction:{
            default:"next",
            validator: function (value) {
                // 这个值必须匹配下列字符串中的一个
                return ~['next', 'prev'].indexOf(value);
            }
        }
    },
    watch: {
        listData:{//轮播数据变化
            handler(val){
                const list = JSON.parse(JSON.stringify(val));
                this.dataLen = list.length;
                this.swiperData = list;
                if(this.dataLen>this.pagePerview){
                    this.$nextTick(()=>{this.initSwiper();});
                }
            },
            deep:true,
            immediate:true
        },
    },
    components:{
      
    },
    data() {
        return {
           swiperData:[],
           dataLen:0,
           timeLine:null,
           currentIndex:0,//当前展示的项下标
           itemHeight:0,
           timerHandle:null,
           playState:"",
           primitiveDom:null,
           domHandle:null,//dom操作的提记录
        }
    },
    mounted:function(){},
    beforeDestroy:function(){
        this.timeLine.pause();
        clearTimeout(this.timerHandle);
        this.timerHandle = null;
    },
    methods: {
        initSwiper(){
            //初始化UI
            let Swiper = this.$refs.swiper;
            let itemNodeList = Swiper.querySelectorAll(".swiper-item-wrapper");
            let itemHeight = itemNodeList[0].offsetHeight;
            this.itemHeight = itemHeight;
            let screen = Swiper.querySelector(".swiper-screen");
            screen.style.height = `${itemHeight*this.pagePerview}px`;
            //初始化事件
            screen.addEventListener("mouseenter",this.onMouseEnter);
            screen.addEventListener("mouseleave",this.onMouseLeave);
            screen.addEventListener("mousewheel",this.onMouseSheel);
            // 初始化动画
            if(this.timeLine===null){
                this.timeLine = new Timeline();
                this.timeLine.start();
            }
            this.start();
        },
        copyContentToFragement(){//将所有的轮播项复制到fragment便于性能优化
            let Swiper = this.$refs.swiper;
            let itemWrap = document.createDocumentFragment();
            let itemNodeList = Swiper.querySelectorAll(".swiper-item-wrapper");
            Array.prototype.slice.call(itemNodeList).forEach((v,idx)=>{
                itemWrap.appendChild(v);
            });
            return itemWrap;
        },
        cloneFirstElementToLast({beforeClone,beforeAppend}={}){//将第一个元素添加到最后
            let Swiper = this.$refs.swiper;
            let screen = Swiper.querySelector(".swiper-screen");
            let itemWrap = this.copyContentToFragement();
            if(beforeClone && typeof beforeClone === "function") beforeClone(itemWrap);
            let realDom  = itemWrap.removeChild(itemWrap.firstChild);
            itemWrap.appendChild(realDom);
            if(beforeAppend && typeof beforeAppend === "function") beforeAppend(itemWrap);
            screen.appendChild(itemWrap);
            this.domHandle = Object.freeze({
                operate:"clone",
                fromTo:"firstToLast"
            });
        },
        cloneLastToFirst({beforeClone,beforeAppend}={}){//将最后一个元素添加到最前
            let Swiper = this.$refs.swiper;
            let screen = Swiper.querySelector(".swiper-screen");
            let itemWrap = this.copyContentToFragement();
            if(beforeClone && typeof beforeClone === "function") beforeClone(itemWrap);
            let realDom  = itemWrap.removeChild(itemWrap.lastChild);
            let range = document.createRange();
            range.setStart(itemWrap,0);
            range.setEnd(itemWrap,0);
            range.insertNode(realDom);
            if(beforeAppend && typeof beforeAppend === "function") beforeAppend(itemWrap);
            screen.appendChild(itemWrap);
            this.domHandle = Object.freeze({
                operate:"clone",
                fromTo:"lastToFirst"
            });
        },
        start(){
            this.playState = "runing";
            this.timerHandle = setTimeout(()=>{
                this.play();
                this.start();
            },this.delay);
        },
        pause(){
            if(this.playState === "runing"){
                this.timeLine.pause();
                clearTimeout(this.timerHandle);
                this.timerHandle = null;
                this.playState = "pause";
            }
        },
        resume(){
            if(this.timerHandle===null && this.playState === "pause"){
                this.timeLine.resume();
                this.start();
                this.playState = "runing";
            }
        },onMouseSheel(e){
            const {deltaY} = e;//拖动的距离
            let Swiper = this.$refs.swiper;
            let screen = Swiper.querySelector(".swiper-screen");
            let itemNodeList = Swiper.querySelectorAll(".swiper-item-wrapper");
            /translateY\(([\s\S]+)px\)/.exec(itemNodeList[0].style.transform);
            let tx = Number(RegExp.$1)||0;
            tx += -deltaY/this.mouseWheelSpeed;
            if(tx>0 || tx < -this.itemHeight){
                if(tx>0){//是next的话，头部已经具有尾部元素的克隆
                    console.log("up");
                    this.cloneLastToFirst({beforeAppend:itemWrap=>{
                        Array.prototype.slice.call(itemWrap.querySelectorAll(".swiper-item-wrapper")).forEach((v,idx)=>{
                            v.style.transform = `translateY(${tx - this.itemHeight}px)`;
                        });
                    }});
                }
                if(tx < -this.itemHeight){
                    console.log("down");
                    this.cloneFirstElementToLast({beforeAppend:itemWrap=>{
                        Array.prototype.slice.call(itemWrap.querySelectorAll(".swiper-item-wrapper")).forEach((v,idx)=>{
                            v.style.transform = `translateY(${tx+this.itemHeight}px)`;
                        });
                    }});
                }
            }else{
                Array.prototype.slice.call(screen.querySelectorAll(".swiper-item-wrapper")).forEach((v,idx)=>{
                    v.style.transform = `translateY(${tx}px)`;
                });
            }
            e.stopPropagation();
            e.preventDefault();
        },
        onMouseEnter(e){//鼠标进入轮播区域停止，即使轮播途中也可立即停止，可正常恢复
            this.pause();
        },
        onMouseLeave(e){//鼠标离开轮播区域
            if(this.timeLine){
                this.timeLine.animations = new Set(); 
                this.timeLine.finishedAnimaions = new Set(); 
            }
            this.resume();
        },play(){//轮播
            const type = this.direction;
            let nextPosition = (type==="next"?-1*this.itemHeight:0);
            let Swiper = this.$refs.swiper;
            let itemNodeList = Swiper.querySelectorAll(".swiper-item-wrapper");
            /translateY\(([\s\S]+)px\)/.exec(itemNodeList[0].style.transform);
            let tx = Number(RegExp.$1);
            if(type === "prev" && tx === 0){
                this.cloneLastToFirst({beforeAppend:itemWrap=>{
                    Array.prototype.slice.call(itemWrap.querySelectorAll(".swiper-item-wrapper")).forEach((v,idx)=>{
                        v.style.transform = `translateY(${-this.itemHeight}px)`;
                    });
                }});
            }
            Array.prototype.slice.call(Swiper.querySelectorAll(".swiper-item-wrapper")).forEach((v,idx)=>{
                /translateY\(([\s\S]+)px\)/.exec(v.style.transform);
                let tx = Number(RegExp.$1);
                let moveAnimation = new Animation(v.style,"transform",tx,nextPosition,this.speed,0,ease,v=>`translateY(${v}px)`);
                this.timeLine.add(moveAnimation);
            });
            this.timeLine.onFinishAll = ()=>{//该次动画完成
                if(type === "next"){//把第一个元素移除，并使位置改变以消除移除元素的影响
                    this.cloneFirstElementToLast({beforeAppend:itemWrap=>{
                        Array.prototype.slice.call(itemWrap.querySelectorAll(".swiper-item-wrapper")).forEach((v,idx)=>{
                            v.style.transform = `translateY(${0}px)`;
                        });
                    }});
                    this.currentIndex+=1;
                }
                if(type === "prev"){//把最后的元素移除，因为顶部已经有它的拷贝了
                    this.currentIndex-=1;
                }
                this.$emit(type,this.currentIndex);//抛出事件
            };
        }
    }
}
</script>
<style lang="scss" scoped>
   .govnet-swiper{
       .swiper-screen{
            overflow: hidden;
            .swiper-item-wrapper{
                overflow: hidden;
            }
       }
   }
</style>