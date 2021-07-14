<template>
    <div class='tableview'>
        <div class="backImage">
            <canvas ref="backImg" :height="cavHeight" :width="cavWidth"></canvas>
        </div>
        <div class="tabCover"><!--快捷方式-->
            <div v-for="item in appliction"
            @click="dispatchEvent(item.event)"
            class="app_item">
             <div class="pic"><img :src="item.icon" alt=""/></div>
             <div class="text"><span>{{item.title}}</span></div>
            </div>
        </div>
        <!-- <meterEdit></meterEdit>
        <vector></vector> -->
        <file-reader 
        v-if="showFileReader"
        width="720px"
        @execTrans="childCmd"
        ></file-reader>   
        <snake
        v-if="showSnake"
        width="720px"
        @execTrans="childCmd"></snake>
        <RussiaBlocks
        v-if="showRussiaBlocks"
        width="480px"
        @execTrans="childCmd"></RussiaBlocks>
        <component :is="'poker'" v-if="showCHinesePoker"></component>
        <taskmenu></taskmenu>
        <div class="swiper-view">
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
        </div>
    </div>
</template>

<script>
import taskmenu from '../components/view/taskmenu';
import swiper from '../components/swiper';
import vector from './datastruct/vector'
import meterEdit from './tools/meter-edit'
import fileReader from './applications/fileReader'
import snake from './applications/snake'
import RussiaBlocks from './applications/RussiaBlocks'
import Poker from './applications/chinesePoker'
import md5 from 'js-md5';
//import skulpt from 'skulpt';
import JSEncrypt from 'jsencrypt';
import "../pakage/InnerAction";
export default {
    name: "entertable",
    components:{
        meterEdit,
        vector,
        taskmenu,
        fileReader,
        snake,
        RussiaBlocks,
        Poker,
        swiper
    },computed: {
        appliction(){
            return this.$store.state.appliction;
        },
    },
    data() {
        return {
            showFileReader:false,
            showSnake:false,
            showRussiaBlocks:false,
            showCHinesePoker:false,
            cavWidth:document.body.offsetWidth,
            cavHeight:document.body.offsetHeight||800, 
            scale:5,//比例
            rightMenu:[{//右键菜单
                id:0,
                icon:"",
                label:"更换桌面背景",
                event:"changeTableBackground",
                decoration:""
            }],
            rightMenuShow:false,
            preMenu:[],
            cont:null,
            swiperData:[{
               url:"https://img2.baidu.com/it/u=4094910853,32052811&fm=26&fmt=auto&gp=0.jpg",
               name:"官网抢购",
               des:"过去玩官网抢购"
            },{
               url:"https://img2.baidu.com/it/u=3186302442,2514831303&fm=26&fmt=auto&gp=0.jpg",
               name:"我去过我去过",
               des:"个我去过我去过问问"
            },{
               url:"https://img0.baidu.com/it/u=1611975237,1522940013&fm=26&fmt=auto&gp=0.jpg",
               name:"给我给我钱",
               des:"给我过千万个全国全文"
            },{
               url:"https://img0.baidu.com/it/u=1611975237,1522940013&fm=26&fmt=auto&gp=0.jpg",
               name:"服务方式",
               des:"过千万个呵呵呵"
            },]
        }
    },
    beforeCreate() {
        
    },
    mounted:function(){
        let that=this;
        console.log(Object.keys(document));
        console.log(this.appliction);
        this.cont=this.$refs.backImg.getContext("2d");
        setTimeout(()=>{
            that.drawImg(that.cont);//绘制默认桌面背景
        });
        this.$refs.backImg.addEventListener("mousedown",(e)=>{//鼠标点击事件
            console.log(e);
            if(e.button===2){//右键菜单
               that.drawRightMenu({x:e.offsetX,y:e.offsetY});
               e.preventDefault();
               e.stopPropagation();
            }
            if(e.button===0){//左键单击清除菜单
                that.drawRightMenu({x:e.offsetX,y:e.offsetY},undefined,true);
                e.preventDefault();
                e.stopPropagation();
            }
        });
        document.body.addEventListener("contextmenu",(e)=>{e.preventDefault();});//组织鼠标右键的菜单
        let CalcuMD5 = function (str) {
            //str = str.toUpperCase();
            str = md5(str);
            return str.toUpperCase();
        }
        console.log(CalcuMD5("appid=f2e47fddecf1428da87f1b0fd056c320&random=512250&timestamp=1597733641234&token=dab6845186784de689899d9cee5b932c"));
        console.log("code",CalcuMD5("dfmnqje4"))
        function  RSADecode(str,key){ // 注册方法
            let pubKey = `-----BEGIN PUBLIC KEY-----${key}-----END PUBLIC KEY-----`;// ES6 模板字符串 引用 rsa 公钥
            let encryptStr = new JSEncrypt();
            encryptStr.setPublicKey(pubKey); // 设置 加密公钥
            let  data = encryptStr.encrypt(str);  // 进行加密
            return data;
        }
        console.log(RSADecode("080003","dab6845186784de689899d9cee5b932c"));
    },methods: {
        dispatchEvent(event){
           event&&this[event]();
        },childCmd(o){
           this[o.fnc](...o.param);
        },closeDialog(o){
            this[o]=false;
        },handleFileReader(){
            this.showFileReader=true;
        },handleSnake(){
            this.showSnake=true;
        },handleRussiaBlocks(){
            this.showRussiaBlocks=true;
        },handleChinesePoker(){
            console.log('open','poker');
            this.showCHinesePoker=true;
        },sleep(time){
            return new Promise(function(rs,rj){
                setTimeout(rs,time);
            })
        },async drawImg(cont){//默认的背景
             let vm=this;
            cont.save();
            cont.translate(800,500);
			async function creat_rect(w){
                await vm.sleep(1);
                cont.fillStyle="RGB(230,"+(200+parseInt(Math.random()*56))+","+(55+w*2)+")";
                cont.fillRect(0,0,w,w);
                if(w<2){return 0;}//宽度小于2像素停止
                //右边绘制
                cont.save();
                cont.rotate(37*2*Math.PI/360);
                cont.translate(0,-w/5*3-w/5*4);
                await creat_rect(w*4/5);
                cont.restore();       
                //左边绘制
                cont.save();
                cont.rotate(-53*2*Math.PI/360);
                cont.translate(0,-w/5*3);
                await creat_rect(w*3/5);
                cont.restore();          		      
            }
			await creat_rect(100);
            cont.restore();  
        },drawRightMenu(o,active,clear){//绘制右键菜单 active
           console.log("绘制右键菜单",o,active);
           let that=this;
           that.cont.save();
           that.cont.globalCompositeOperation="source-over";
            if(that.rightMenuShow&&that.preMenu.length>0){
                that.cont.fillStyle="#fff";
                that.cont.fillRect(that.preMenu[0].x,that.preMenu[0].y,100,20*that.rightMenu.length);
                that.preMenu=[];
                that.rightMenuShow=false;
            }
            if(!clear){
                that.cont.fillStyle="#efefef";
                that.cont.fillRect(o.x,o.y,100,20*that.rightMenu.length);
                if(active!==undefined){
                    that.cont.fillStyle="#392eca";
                    that.cont.fillRect(o.x,o.y,100,20*(active+1));
                }
                that.rightMenu.forEach((item,index)=>{
                        if(active!==undefined&&active===index){
                            that.cont.fillStyle="#fff";
                        }else{
                            that.cont.fillStyle="#000";
                        }
                        that.cont.font="16px";
                        that.cont.fillText(item.label,o.x+10,o.y+20*(index+0.6),80);
                });
                that.rightMenuShow=true;
                that.preMenu.push(o);
            }
           that.cont.restore(); 
        },changeTableBackground(){

        }
    },
}
</script>
<style lang="scss" scoped>
.tableview{
    height:100vh;
    text-align: left;
    .swiper-view{
        position:absolute;
        left: 0;
        top: 300px;
        .swiper-item{
            margin: 10px 0 0;
            border:1px solid rgba(0,150,255,.5);
            .img {
                display: inline-block;
                vertical-align: top;
                img{
                    width: 60px;
                    height: 60px;
                    display: block;
                }
            }
            .info{
                min-width: 200px;
                padding: 0 5px;
                display: inline-block;
                vertical-align: top;
                .name{
                    font-weight: bold;
                    padding: 10px 0;
                }
            }
        }
    }
    .backImage{
        height:inherit;
        overflow: hidden;
    }
    .tabCover{
        position: absolute;
        top:0;
        left:0;
        padding: 10px;
        .app_item{
            padding: 10px;
            width: 100px;
            height: 140px;
            display: inline-block;
            vertical-align:top;
            cursor: pointer;
            .pic{
                width: 100%;
                height: 80px;
                img{
                    width: 100%;
                    height: 80px;
                }
            }
            .text{
                text-align: center;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                line-clamp: 2;
                -webkit-box-orient: vertical;
                line-height: 20px;
            }
            &:hover{background:rgba(0,0,0,.1);}
        }
    }
}
</style>