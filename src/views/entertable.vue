<template>
    <div class='tableview'>
       <meterEdit></meterEdit>
       <vector></vector>
       <taskmenu></taskmenu>
    </div>
</template>

<script>
import taskmenu from '../components/view/taskmenu'
import vector from './datastruct/vector'
import meterEdit from './tools/meter-edit'
export default {
    name: "entertable",
    components:{
        meterEdit,
        vector,
        taskmenu
    },
    data() {
        return {
            
        }
    },
    beforeCreate() {
        
    },
    mounted:function(){
       console.log(Object.keys(document));
    }
}
</script>
<style lang="scss" scoped>
.tableview{
    height:100vh;
}
</style>