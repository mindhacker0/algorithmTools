<template>
    <div class='tableview'>
       <vector></vector>
    </div>
</template>

<script>
import vector from './datastruct/vector'
export default {
    name: "entertable",
    components:{
      vector
    },
    data() {
        return {
            
        }
    },
    mounted:function(){
       console.log(this);
    }
}
</script>
<style lang="scss" scoped>
.tableview{
    height:100vh;
}
</style>