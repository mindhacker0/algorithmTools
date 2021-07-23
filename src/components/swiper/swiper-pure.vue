<!--
*使用方式
<swiper 
:listData="swiperData"
:page-perview="3"
>
    <template slot="swiper-item" slot-scope="{item}">
        <div class="swiper-item">
            <div class="img"><img :src="data.url"/></div>
            <div class="info">
                <div class="name">{{data.name}}</div>
                <div class="des">{{data.des}}</div>
            </div>
        </div>
    </template>
</swiper>
-->
<template>
    <div ref="swiper" class='swiper'>
        <div class='swiper-screen'>
            <div 
            v-for="(item,idx) in swiperData" 
            :key="`swiper-item-${idx}`"
            class='swiper-item-wrapper'>
                <slot name="swiper-item" :item="item"></slot>
            </div>
        </div>
    </div>
</template>

<script>
// 单纯使用html5移动，期间无dom改变
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
    },
    watch: {
        listData:{//轮播数据变化
            handler(val){
                const list = JSON.parse(JSON.stringify(val));
                this.dataLen = list.length;
                list.unshift(val[this.dataLen-1]);
                for(let i = 0;i<this.pagePerview;i++){
                    list.push(val[i]);
                }
                this.swiperData = list;
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
           itemNodeList:null,
           playState:"",
           timerHanle:null
        }
    },
    mounted(){
        console.log(this.dataLen);
        if(this.dataLen>this.pagePerview){
            this.initSwiper();
        }
    },
    methods: {
        initSwiper(){
            //初始化UI
            let Swiper = this.$refs.swiper;
            let itemNodeList = Swiper.querySelectorAll(".swiper-item-wrapper");
            this.itemNodeList = itemNodeList;
            let itemHeight = itemNodeList[0].offsetHeight;
            this.itemHeight = itemHeight;
            Array.prototype.slice.call(this.itemNodeList).forEach((v,index)=>{
                v.style.transform = `translateY(${-this.itemHeight}px)`;
            });
            let screen = Swiper.querySelector(".swiper-screen");
            screen.style.height = `${itemHeight*this.pagePerview}px`;
            //初始化事件
            screen.addEventListener("mouseenter",this.onMouseEnter);
            screen.addEventListener("mouseleave",this.onMouseLeave);
            // 初始化动画
            if(this.timeLine===null){
                this.timeLine = new Timeline();
                this.timeLine.start();
            }
            this.start();
        },start(){
            this.timerHanle = setInterval(()=>{
                this.next();
            },this.delay);
            this.playState = "runing";
        },
        prev(){
            this.jumpTo(this.currentIndex-1,"prev");
        },
        next(){
            this.jumpTo(this.currentIndex+1,"next");
        },pause(){
            if(this.playState === "runing"){
                this.timeLine.pause();
                clearInterval(this.timerHanle);
                this.timerHanle = null;
                this.playState = "pause";
            }
        },resume(){
            if(this.timerHanle === null && this.playState === "pause"){
                this.timeLine.resume();
                this.start();
                this.playState = "runing";
            }
        },
        onMouseEnter(e){//鼠标进入轮播区域
           this.pause();
        },
        onMouseLeave(e){//鼠标离开轮播区域
            this.resume();
        },
        jumpTo(index,type){//轮播到某个位置
            console.log("jump to",index);
            let currentPosition = -(this.currentIndex+1)*this.itemHeight;
            let nextPosition = -(index+1)*this.itemHeight;
            Array.prototype.slice.call(this.itemNodeList).forEach((v,idx)=>{
                let moveAnimation = new Animation(v.style,"transform",currentPosition,nextPosition,1000,0,easeInOut,v=>`translateY(${v}px)`);
                this.timeLine.add(moveAnimation);
                if(index === this.dataLen){//到了下限,归位实现无缝轮播
                    let resumeAnimation = new Animation(v.style,"transform",currentPosition,-this.itemHeight,0,1000,v=>v,v=>`translateY(${v}px)`);
                    this.timeLine.add(resumeAnimation);
                }
                if(index === -1){//到了上限
                    let resumeAnimation = new Animation(v.style,"transform",currentPosition,-this.dataLen*this.itemHeight,0,1000,v=>v,v=>`translateY(${v}px)`);
                    this.timeLine.add(resumeAnimation);
                }
            });
            this.timeLine.onFinishAll = ()=>{//该次动画完成
                if(index === this.dataLen) index = 0;
                if(index === -1) index = this.dataLen-1;
                this.currentIndex = index;
                this.$emit(type,this.currentIndex);//抛出事件
            };
        }
    }
}
</script>
<style lang="scss" scoped>
   .swiper{
       .swiper-screen{
           overflow: hidden;
           .swiper-item-wrapper{
               overflow: hidden;
           }
       }
   }
</style>