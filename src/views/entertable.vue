<template>
    <div class='tableview'>
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
        <fileReader 
        v-if="showFileReader"
        width="300px"
        @execTrans="childCmd"
        ></fileReader>   
        <taskmenu></taskmenu>
    </div>
</template>

<script>
import taskmenu from '../components/view/taskmenu'
import vector from './datastruct/vector'
import meterEdit from './tools/meter-edit'
import fileReader from './applications/fileReader'
export default {
    name: "entertable",
    components:{
        meterEdit,
        vector,
        taskmenu,
        fileReader
    },
    computed: {
        appliction(){
            return this.$store.state.appliction;
        }
    },
    data() {
        return {
            showFileReader:false,
        }
    },
    beforeCreate() {
        
    },
    mounted:function(){
       console.log(Object.keys(document));
       console.log(this.appliction)
    },methods: {
        dispatchEvent(event){
            this.showFileReader=true;
        },childCmd(o){
           this[o.fnc](...o.param);
        },closeDialog(o){console.log(o)
            this[o]=false;
        }
    },
}
</script>
<style lang="scss" scoped>
.tableview{
    height:100vh;
    text-align: left;
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
</style>