<template>
    <div class='bot_task'>
        <div class='begain'>所有任务</div>
    </div>
</template>

<script>
export default {
    name: "tasklist",
    components:{
      
    },
    data() {
        return {
            begainMenu:[
                {
                   label:'',
                   children:[]
                },
                {
                   label:'',
                   children:[]
                }
            ]
        }
    },
    mounted:function(){
       
    }
}
</script>
<style lang="scss" scoped>
    .bot_task{
        position:fixed;
        bottom:0;
        left:0;
        width:100%;
        border:1px solid rgba(23,24,25,.6);
        background:rgba(32,98,231,.6);
        .begain{
            max-width:120px;
            height:32px;
            line-height:32px;
            border-radius:4px;
            cursor:pointer;
            background:linear-gradient(-45deg, white,black);
            color:#fff;
        }
    }
</style>