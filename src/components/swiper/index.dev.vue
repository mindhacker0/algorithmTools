<!--
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
    <div ref="swiper" class='gov-swiper'>
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
           playState:"",
           domHandle:null,//dom操作的锁，当一个添加操作没被释放不能再次执行添加。
        }
    },
    mounted(){
        if(this.dataLen>this.pagePerview){
            this.initSwiper();
        }
    },
    beforeDestroy:function(){
        this.timeLine.pause();
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
            this.playState = "runing";
            this.play();
        },
        copyContentToFragement(){//将所有的轮播项复制到fragment便于优化
            let Swiper = this.$refs.swiper;
            let itemWrap = document.createDocumentFragment();
            let itemNodeList = Swiper.querySelectorAll(".swiper-item-wrapper");
            Array.prototype.slice.call(itemNodeList).forEach((v,idx)=>{
                itemWrap.appendChild(v);
            });
            return itemWrap;
        },
        cloneFirstElementToLast({beforeClone,beforeAppend}={}){//将第一个元素拷贝添加到最后
            if(this.domHandle!==null) return;
            let Swiper = this.$refs.swiper;
            let screen = Swiper.querySelector(".swiper-screen");
            let itemWrap = this.copyContentToFragement();
            if(beforeClone && typeof beforeClone === "function") beforeClone(itemWrap);
            let firstChild = itemWrap.firstChild.cloneNode(true);
            itemWrap.appendChild(firstChild);
            if(beforeAppend && typeof beforeAppend === "function") beforeAppend(itemWrap);
            screen.appendChild(itemWrap);
            this.domHandle = Object.freeze({
                operate:"clone",
                fromTo:"firstToLast"
            });
        },
        cloneLastToFirst({beforeClone,beforeAppend}={}){//将最后一个元素拷贝到最前
            if(this.domHandle!==null) return;
            let Swiper = this.$refs.swiper;
            let screen = Swiper.querySelector(".swiper-screen");
            let itemWrap = this.copyContentToFragement();
            if(beforeClone && typeof beforeClone === "function") beforeClone(itemWrap);
            let lastChild = itemWrap.lastChild.cloneNode(true);
            let range = document.createRange();
            range.setStart(itemWrap,0);
            range.setEnd(itemWrap,0);
            range.insertNode(lastChild);
            if(beforeAppend && typeof beforeAppend === "function") beforeAppend(itemWrap);
            screen.appendChild(itemWrap);
            this.domHandle = Object.freeze({
                operate:"clone",
                fromTo:"lastToFirst"
            });
        },
        pause(){
            if(this.playState === "runing"){
                this.timeLine.pause();
                this.playState = "pause";
            }
        },resume(){
            if(this.playState === "pause"){
                this.timeLine.resume();
                this.playState = "runing";
            }
        },onMouseSheel(e){
            const {deltaY} = e;//拖动的距离
            let Swiper = this.$refs.swiper;
            let screen = Swiper.querySelector(".swiper-screen");
            let itemNodeList = Swiper.querySelectorAll(".swiper-item-wrapper");
            /translateY\(([\s\S]+)px\)/.exec(itemNodeList[0].style.transform);
            let tx = Number(RegExp.$1)||0;
            if(tx === 0 && itemNodeList.length===this.dataLen){//等于0时，此时没有额外的dom元素,需要添加
                tx += -deltaY/20;
                if(deltaY<0){
                    this.cloneLastToFirst({beforeAppend:itemWrap=>{
                        Array.prototype.slice.call(itemWrap.querySelectorAll(".swiper-item-wrapper")).forEach((v,idx)=>{
                            v.style.transform = `translateY(${tx - this.itemHeight}px)`;
                        });
                    }});
                }else{
                    this.cloneFirstElementToLast({beforeAppend:itemWrap=>{
                        Array.prototype.slice.call(itemWrap.querySelectorAll(".swiper-item-wrapper")).forEach((v,idx)=>{
                            v.style.transform = `translateY(${tx}px)`;
                        });
                    }});
                }
            }else{
                //不为0时，此时正在动画过程中，dom带有额外的元素
                tx += -deltaY/20;
                if(tx>0 || tx < -this.itemHeight){
                    if(tx>0){//是next的话，头部已经具有尾部元素的克隆
                        console.log("up");
                        this.cloneLastToFirst({beforeClone:itemWrap=>{
                            itemWrap.lastChild.remove(1);
                        },beforeAppend:itemWrap=>{
                            Array.prototype.slice.call(itemWrap.querySelectorAll(".swiper-item-wrapper")).forEach((v,idx)=>{
                                v.style.transform = `translateY(${tx - this.itemHeight}px)`;
                            });
                        }});
                    }
                    if(tx < -this.itemHeight){
                        console.log("down");
                        this.cloneFirstElementToLast({beforeClone:itemWrap=>{
                            itemWrap.firstChild.remove(1);
                        },beforeAppend:itemWrap=>{
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
            }
            e.stopPropagation();
        },
        onMouseEnter(e){//鼠标进入轮播区域停止，即使轮播途中也可立即停止，可正常恢复
            this.pause();
        },
        onMouseLeave(e){//鼠标离开轮播区域
            this.timeLine.animations = new Set(); 
            this.finishedAnimaions = new Set(); 
            this.play();
        },play(){//轮播
            const type = this.direction;
            let nextPosition = (type==="next"?-1*this.itemHeight:0);
            let Swiper = this.$refs.swiper;
            let screen = Swiper.querySelector(".swiper-screen");
            if(type === "next"){//动画前进行dom
                this.cloneFirstElementToLast();
            }
            if(type === "prev"){
                this.cloneLastToFirst({beforeAppend:itemWrap=>{
                    Array.prototype.slice.call(itemWrap.querySelectorAll(".swiper-item-wrapper")).forEach((v,idx)=>{
                        v.style.transform = `translateY(${-this.itemHeight}px)`;
                    });
                }});
            }
            Array.prototype.slice.call(Swiper.querySelectorAll(".swiper-item-wrapper")).forEach((v,idx)=>{
                /translateY\(([\s\S]+)px\)/.exec(v.style.transform);
                let tx = Number(RegExp.$1)||0;
                let moveAnimation = new Animation(v.style,"transform",tx,nextPosition,this.speed,this.delay,easeInOut,v=>`translateY(${v}px)`);
                this.timeLine.add(moveAnimation);
            });
            this.timeLine.onFinishAll = ()=>{//该次动画完成
                if(this.domHandle === null) return;//没有dom操作此次动画失败，不能再次删除元素
                if(type === "next"){//把第一个元素移除，并使位置改变以消除移除元素的影响
                    screen.firstChild.remove(1);
                    this.domHandle = null;
                    this.currentIndex+=1;
                    Array.prototype.slice.call(Swiper.querySelectorAll(".swiper-item-wrapper")).forEach((v,idx)=>{
                        v.style.transform = `translateY(${0}px)`;
                    });
                }
                if(type === "prev"){//把最后的元素移除，因为顶部已经有它的拷贝了
                    screen.lastChild.remove(1);
                    this.domHandle = null;
                    this.currentIndex-=1;
                }
                this.$emit(type,this.currentIndex);//抛出事件
                this.play();//递归循环轮播
            };
        }
    }
}
</script>
<style lang="less" scoped>
   .gov-swiper{
       .swiper-screen{
            overflow: hidden;
            .swiper-item-wrapper{
                overflow: hidden;
            }
       }
   }
</style>