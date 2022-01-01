<template>

    <el-card shadow="never"
             class="aui-card--fill">
        <div style="margin: 0 0 10px 50px;">
            <h1>添加关联材料</h1>
        </div>
        <div class="content">
            <el-row style="height:100%">
                <el-col :span="12"
                        class="material-col border">
                    <div class="grid-content bg-purple"
                         style="padding:10px 30px;border-right:1px soild #000">
                        <div class="title">材料库</div>
                        <div class="searchBox">
                            <el-form label-width="80px">
                                <el-form-item label="材料名:">
                                    <el-input v-model="name"
                                              style="width:300px"></el-input>
                                </el-form-item>
                                <el-form-item label="材料类型:">
                                    <el-select v-model="type"
                                               clearable
                                               style="height: 30px">
                                        <el-option v-for="item in typeList"
                                                   :key="item.id"
                                                   :label="item.label"
                                                   :value="item.value"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary"
                                               style="margin-left:30%;margin-top:0px"
                                               @click="search">查询</el-button>
                                </el-form-item>
                            </el-form>
                        </div>
                        <!-- 列表 -->
                        <template>
                            <div style="overflow:auto;height:430px;">
                                <el-table :data="showTableData"
                                          border
                                          :row-class-name="tableRowClassName"
                                          style="width: 100%">
                                    <el-table-column header-align="center"
                                                     prop="name"
                                                     label="材料名"
                                                     width="400">
                                    </el-table-column>
                                    <el-table-column header-align="center"
                                                     prop="type"
                                                     label="类型">
                                        <template slot-scope="scope">
                                            <span v-if="scope.row.type == 1">doc</span>
                                            <span v-else-if="scope.row.type == 2">ppt</span>
                                            <span v-else-if="scope.row.type == 3">pdf</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column header-align="center"
                                                     prop="address"
                                                     label="操作">
                                        <template slot-scope="scope">
                                            <div class="add-icon disable"
                                                 v-if="disable(scope.row.id)"></div>
                                            <div v-else
                                                 @click="addMaterial(scope.row)"
                                                 class="add-icon">+</div>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </template>
                    </div>
                </el-col>
                <el-col :span="12"
                        class="material-col">
                    <div class="grid-content bg-purple-light"
                         style="padding:10px 30px;border-right:1px soild #000">
                        <div class="title">添加材料</div>
                        <!-- 添加的数据 -->
                        <div ref="rightBox">
                            <div class="right-item"
                                :class="{empty:item.id===null}"
                                 v-for="(item,index) in addData"
                                 @mousedown="handleMouseDown($event,index)"
                                 :key="item.id">
                                <div class="item-title" v-if="item.id">
                                    材料{{index+1}}
                                </div>
                                <div class="item-content" v-if="item.id">
                                    <div class="material-name">{{item.name}}</div>
                                    <div class="cancel-icon"
                                         @click="cancelMaterial(index)">✖</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
        <el-button type="primary"
                   style="margin-left:65%;width:120px;margin-top:30px"
                   @click="submit()">确 定</el-button>
    </el-card>
</template>
<script>
import { cloneDeep } from "lodash";
export default {
    data() {
        return {
            // 材料查询
            name: "",
            type: "",
            showTableData: [],
            tableData: [
                {
                    id: 1,
                    name: "01网络招聘会链接需求.doc",
                    sort: 1,
                    type: "1",
                },
                {
                    id: 2,
                    name: "02网络招聘会链接需求.doc",
                    sort: 2,
                    type: "1",
                },
                {
                    id: 3,
                    name: "03网络招聘会链接需求.pdf",
                    sort: 3,
                    type: "3",
                },
                {
                    id: 4,
                    name: "04网络招聘会链接需求.doc",
                    sort: 4,
                    type: "1",
                },
                {
                    id: 5,
                    name: "05网络招聘会链接需求.pdf",
                    sort: 5,
                    type: "3",
                },
                {
                    id: 6,
                    name: "06网络招聘会链接需求.doc",
                    sort: 6,
                    type: "1",
                },
                {
                    id: 7,
                    name: "07网络招聘会链接需求.doc",
                    sort: 7,
                    type: "1",
                },
                {
                    id: 8,
                    name: "08网络招聘会链接需求.doc",
                    sort: 8,
                    type: "1",
                },
                {
                    id: 9,
                    name: "09网络招聘会链接需求.ppt",
                    sort: 9,
                    type: "2",
                },
                {
                    id: 10,
                    name: "10网络招聘会链接需求.ppt",
                    sort: 10,
                    type: "2",
                },
            ],
            addData: [],
            //材料类型列表
            typeList: [
                { id: 1, label: "doc", value: 1 },
                { id: 2, label: "ppt", value: 2 },
                { id: 3, label: "pdf", value: 3 },
            ],
        };
    },
    computed: {
        disable() {
            return (id) => this.addData.filter((v) => v.id == id).length;
        },
    },
    activated() {
        console.log("activated调用了");
        console.log(this.$route.query.id);
        let query = this.$route.query;
        if (query.id) {
            console.log("编辑", query.id);
            this.pageTitle = "编辑应用";
        } else {
            console.log("新增");
            this.pageTitle = "新增应用";
        }
    },
    created() {
        this.showTableData = cloneDeep(this.tableData);
    },
    mounted() {},
    methods: {
        handleMouseDown(event,index){
            let _this = this;
            let {position,elem} = this.calcItemPosition(this.$refs.rightBox,index);
            let direction = 0;
            let handleMove = null;
            let handleUp = null;
            let emptyBox = null;//第几个元素是空元素
            let width = elem.offsetWidth;
            let posx = event.pageX - elem.offsetLeft,posy = event.pageY - elem.offsetTop;
            document.body.addEventListener("mousemove",handleMove = function(e){
                let posx_new = e.pageX - posx;
                let posy_new = e.pageY - posy;
                elem.style.transform="rotate(30deg)";
                elem.style.position="absolute";
                elem.style.width=`${width}px`;
                elem.style.left = posx_new + "px";//使得被拖放元素跟随鼠标移动
                elem.style.top = posy_new + "px";
                let {pageY} = e;
                for(let {top,height,index} of position){
                    if(top < pageY && pageY < top+height){//高度在某个盒子范围内
                        if(emptyBox === null){
                            if(index!==position.length-1){
                                _this.addData.splice(index,0,{id:null});
                            }else{
                                _this.addData.push({id:null});
                            }
                            emptyBox = index+1;
                        }else if(index!==(emptyBox-1)){
                            if(index === emptyBox){index++;direction = -1;}
                            let temp = _this.addData[emptyBox];
                            _this.addData[emptyBox] = _this.addData[index];
                            _this.addData[index] = temp;
                            emptyBox = index;
                        }
                    }
                }
                document.body.addEventListener("mouseup",handleUp = function(e){
                    elem.removeAttribute("style");
                    _this.addData = _this.addData.filter(({id})=>id!==null);
                    emptyBox = null;
                    document.body.removeEventListener("mousemove",handleMove);
                    document.body.removeEventListener("mouseup",handleUp);
                });
            });
        },
        calcItemPosition(parent,index){
           let itemList = parent.getElementsByClassName("right-item");
           let position = [];
           for(let i=0;i<itemList.length;i++){
                position.push({
                    left:itemList[i].offsetLeft,
                    top:itemList[i].offsetTop,
                    height:itemList[i].offsetWidth,
                    index:i
                });
           }
           return {position,elem:itemList[index]};
        },
        tableRowClassName({ row, rowIndex }) {
            if (this.addData.filter((v) => v.id == row.id).length) {
                return "disable-row";
            }
            return "";
        },
        //搜索材料
        search() {
            let data = cloneDeep(this.tableData);
            if (this.type !== "") {
                data = data.filter((v) => v.type == this.type);
            }
            if (this.name !== "") {
                data = data.filter((v) => ~v.name.indexOf(this.name));
            }
            this.showTableData = data;
            console.log("搜索材料");
        },
        //单个材料添加
        addMaterial(obj) {
            this.addData.push(obj);
            console.log("单个材料添加", obj);
        },
        //取消材料
        cancelMaterial(index) {
            this.addData.splice(index, 1);
            console.log("取消材料");
        },
        //确定
        submit() {
            console.log("确定");
        },
    },
};
</script>
<style>
.el-table .disable-row {
    background-color: #e4e4e4;
}
</style>
<style scoped>
.content {
    width: 85%;
    height: 765px;
    margin: 0 auto;
    border: 2px solid #e4e4e4;
}
.title {
    text-indent: 30px;
    color: #17b3a3;
    font-size: 26px;
    height: 60px;
    line-height: 60px;
    border-bottom: 2px solid #e4e4e4;
}
.material-col {
    height: 100%;
}
.material-col.border {
    border-right: 2px solid #e4e4e4;
}
.searchBox {
    margin-top: 15px;
    padding: 20px 50px 5px 70px;
    margin-bottom: 15px;
    background-color: rgba(242, 242, 242, 0.85);
}
.add-icon {
    width: 26px;
    height: 26px;
    background-color: #17b3a3;
    color: #fff;
    line-height: 26px;
    text-align: center;
    border-radius: 13px;
    font-size: 30px;
    margin: 0 auto;
    cursor: pointer;
}
.add-icon.disable {
    background-color: transparent;
}
.right-item {
    height: 120px;
    /* border: 5px solid #e4e4e4; */
    /* border-radius: 15px; */
    margin-top: 15px;
}
.item-title {
    width: 100%;
    height: 35px;
    background-color: #e4e4e4;
    border-radius: 15px 15px 0px 0px;
    line-height: 42px;
    font-size: 20px;
    text-indent: 20px;
}
.item-content {
    width: 100%;
    height: 75px;
    /* background-color: #e4e4e4; */
    border: 5px solid #e4e4e4;
    border-radius: 0px 0px 15px 15px;
    display: flex;
}
.material-name {
    width: 80%;
    font-size: 22px;
    padding: 15px 20px;
}
.cancel-icon {
    width: 26px;
    height: 26px;
    color: red;
    line-height: 60px;
    font-size: 30px;
    margin: 0 auto;
    cursor: pointer;
}
.empty{
    background: #e4e4e4;
}
</style>

