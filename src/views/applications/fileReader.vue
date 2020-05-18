<template>
    <div class='fileReader_cnt' :style="{'width':width||'320px'}" v-dragable>
        <div class='head clear-float'>fileReader<span class='el-icon-close icon' @click="close"></span></div>
        <div>

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
            
        }
    },
    mounted() {
        setTimeout(()=>{
        var Hand_Dom=document.getElementById('file_list');
                Hand_Dom.addEventListener('change',function(event){
                    console.log(event);
                    var files=event.target.files,i=0,len=files.length;
                    while(i<len){
                        console.log(files[i].name+'('+files[i].type+','+files[i].size+'bytes)');
                        i++;
                    }
                    var reader = new FileReader(),start=100000;
                    document.getElementById('file_next').addEventListener('click',function(){
                        console.clear();
                        start+=1024;
                        reader.readAsText(files[0].slice(start,start+1024),'UTF-8');
                        reader.onload=function()
                        {
                console.log(reader.result);		
                console.log(start);
                        } 
                    });
                    document.getElementById('file_pre').addEventListener('click',function(){
                        console.clear();
                        start-=1024;
                        reader.readAsText(files[0].slice(start,start+1024),'UTF-8');
                        reader.onload=function()
                        {
                console.log(reader.result);		
                console.log(start);
                        } 
                    });
                });
        },3000);
    },
    methods: {
        close(){
            this.$emit("execTrans",{fnc:"closeDialog",param:['showFileReader']})
        }
    },
}
</script>
<style lang="scss" scoped>
 .fileReader_cnt{
        min-width:1240px;
        background:#efefef;
        text-align:left;
        border:3px solid #efefef;
        .head{
            text-align:center;
            .icon{
                float:right;
                cursor: pointer;
            }
        }
 }
</style>
