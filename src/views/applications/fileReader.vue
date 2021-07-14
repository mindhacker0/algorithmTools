<template>
    <div class='fileReader_cnt' :style="{'width':width||'320px'}" v-dragable>
        <div class='head clear-float'>fileReader<span class='el-icon-close icon' @click="close"></span></div>
        <div class="main">
            <div class="view">
                <textarea v-model="content" cols="40" rows="32"></textarea>
            </div>
            <div class="control">
                <div class="fileInput">
                    <input type="file" @change="getFileObj"></input>
                    <div class=cover>{{files.length>0?files[0].name:'请选择文件'}}</div>
                </div>
                <div style="text-align: center;margin-top: 10px;">
                    <el-button type="primary" size="small" @click="prevPage">prev</el-button>
                    <el-button type="primary" size="small" @click="nextPage">next</el-button>
                </div>
                <div class="info">
                    <div>第{{pageNum}}页</div>
                    <div><el-input @blur="changePage" v-model="pageNum" size="small" style="width:200px"/></div>
                    <div>当前文件指针开始：{{start}},当前页面大小:{{pageSize}}Byte</div>
                    <div>{{printAll}}</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name:'file-reader',
    comments:{
        
    },
    props: ['width'],
    data() {
        return {
            content:"",
            pageNum:0,
            start:0,//起始指针
            pageSize:0,//当前页面字节
            files:[],
            MaxPage:1024,
            name:""
        }
    },
    mounted() {},
    methods: {
        printAll(){
           return '2222'
        },
        changePage(){
            localStorage.setItem(this.name,this.pageNum);
             this.calPageSize().then(res=>{
                this.showContent();
            });
        },
        close(){
            this.$emit("execTrans",{fnc:"closeDialog",param:['showFileReader']})
        },getFileObj(event){//onchange事件获取file
            console.log(event);//\n
            this.files=event.target.files;
            if(this.files.length >0){
                let name = this.files[0].name;
                this.name = name;
                if(localStorage.getItem(name) === null){
                    localStorage.setItem(name,0);
                }else{
                    this.pageNum = localStorage.getItem(name);
                    console.log(this.pageNum);
                }
            }
            this.calPageSize().then(res=>{
                this.showContent();
            })
        },prevPage(){//前一页
            this.pageNum--;
            this.pageNum<0 && (this.pageNum=0);
            localStorage.setItem(this.name,this.pageNum);
            this.calPageSize().then(res=>{
                this.showContent();
            })
        },nextPage(){//下一页
            this.pageNum++;
            localStorage.setItem(this.name,this.pageNum);
            this.calPageSize().then(res=>{
                this.showContent();
            })
        },showContent(){//读取文件
            if(this.files.length===0){return this.$message.info("请选择文件");}
            let reader=new FileReader(),that=this;
            reader.readAsText(this.files[0].slice(this.start,this.start+this.pageSize),'UTF-8');
            reader.onload=function(){that.content=reader.result;}
        },calPageSize(){//判断开始结束的指针位置
            let reader=new FileReader(),that=this,preindex=0;
            that.start=that.pageNum*that.MaxPage;
            return new Promise((reslove,reject)=>{
                reader.readAsArrayBuffer(that.files[0].slice(that.start,that.start+that.MaxPage));
                reader.onload=function(){
                    let binaryArr=that.arrayBufferToString(reader.result);
                    if(binaryArr[0].slice(0,2)==='10'&&that.start-6>=0){//如果前面不是标准开头
                        reader.readAsArrayBuffer(that.files[0].slice(that.start-6,that.start));//最长的编码为6个字节
                        reader.onload=function(){
                           let exBinaryArr=that.arrayBufferToString(reader.result);
                           preindex=that.lastIndex(exBinaryArr,/^(?!10).*/);//查找标准开头
                           preindex!==-1 && (that.start=that.start-(6-preindex));//找到了正确的起始位置
                           //console.log(exBinaryArr,preindex,that.start);
                           tail();
                        }
                    }else{
                        tail();   
                    }
                    function tail(){
                        //尾部多余部分处理
                        let tailindex=that.lastIndex(binaryArr,/^(?!10).*/);
                        //尾部可能是正常结束
                        let str=/^(1*)0.*/g.exec(binaryArr[tailindex])[1];
                        if(str.length+tailindex===binaryArr.length){tailindex=that.MaxPage;}
                        that.pageSize=preindex>0?tailindex+(6-preindex):tailindex;
                        console.log(binaryArr,binaryArr[tailindex],str.length);
                        reslove(true);
                    } 
                } 
            })
        },arrayBufferToString(buffer){
            return Array.prototype.slice.call(new Uint8Array(buffer)).map(i=>"00000000".substring(i.toString(2).length)+i.toString(2))
        },lastIndex(arr,reg){//正则匹配
           for(let i=arr.length-1;i>0;i--){
               if(reg.test(arr[i])){
                   return i;
               }
           }
           return -1;
        }
    },
}
</script>
<style lang="scss" scoped>
 .fileReader_cnt{
        background:#efefef;
        text-align:left;
        border:3px solid #efefef;
        left:20%;
        top:20%;
        position: absolute;
        .head{
            text-align:center;
            padding:10px 0;
            .icon{
                float:right;
                cursor: pointer;
            }
        }
        .main{
            font-size: 0;
            .view{
                vertical-align: top;
                width: 50%;
                display: inline-block;
                textarea{
                    // background: #e6fc65;
                    color: #555;
                }
            }
            .control{
                vertical-align: top;
                width: 50%;
                display: inline-block;
                .fileInput{
                    position: relative;
                    input{width: 100%;cursor: pointer;}
                    .cover{
                        text-align: center;
                        background:#fff;
                        position: absolute;
                        width: 100%;
                        height: 100%;
                        line-height: 20px;
                        top:0;
                        left:0;
                        font-size: 14px;
                        pointer-events: none;
                    }
                }
                .info{
                    font-size: 14px;
                    color: #666;
                    text-align: center;
                    margin-top: 20px;
                }
            }
        }
 }
</style>
