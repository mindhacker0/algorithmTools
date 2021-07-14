<!--
*使用方式
<swiper 
:listData="swiperData"
:page-perview="3"
>
    <template slot="swiper-item" slot-scope="{data}">
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
            v-for="(item,idx) in listData" 
            :key="`swiper-item-${idx}`"
            class='swiper-item-wrapper'>
                <slot name="swiper-item" :data="item"></slot>
            </div>
        </div>
    </div>
</template>

<script>
import {Timeline,Animation} from "./animation";
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
        speed:{//轮播速度，间隔毫秒
            type: Number,
            default: 2000
        },
    },
    components:{
      
    },
    data() {
        return {
           timeLine:null,
           currentIndex:0,//当前展示的项下标
           itemHeight:0,
           itemNodeList:null,
        }
    },
    mounted:function(){
       this.initSwiper();
    },
    methods: {
        initSwiper(){
            //初始化UI
            let Swiper = this.$refs.swiper;
            let itemNodeList = Swiper.querySelectorAll(".swiper-item-wrapper");
            this.itemNodeList = itemNodeList;
            let itemHeight = itemNodeList[0].offsetHeight;
            this.itemHeight = itemHeight;
            let screen = Swiper.querySelector(".swiper-screen");
            screen.style.height = `${itemHeight*this.pagePerview}px`;
            //初始化事件
            screen.addEventListener("mousewheel",this.onMouseSheel)
            // 初始化动画
            this.timeLine = new Timeline();
            this.timeLine.start();
            this.start();
        },start(){
            this.next();
        },next(){
            Array.prototype.slice.call(this.itemNodeList).forEach((v,index)=>{
                let itemAnimation = new Animation(v.style,"transform",-this.itemHeight,0,this.speed,1000,v=>v,v=>`translateY(${v}px)`);
                this.timeLine.add(itemAnimation);
            });
        },onMouseSheel(e){
            const {deltaY} = e;
            Array.prototype.slice.call(this.itemNodeList).forEach((v,index)=>{
                /translateY\(([\s\S]+)px\)/.exec(v.style.transform);
                let tx = Number(RegExp.$1);
                tx += deltaY/10;
                v.style.transform = `translateY(${tx}px)`;
            });
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