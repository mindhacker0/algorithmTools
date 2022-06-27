<template>
    <div class='g6test_cnt'>
       <div id="board" style="width:600px;height:600px;"></div>
    </div>
</template>
<script>
import G6Map from "./graph";
export default {
    name:'g6-test',
    comments:{
        
    },
    data() {
        return {
          
        }
    },
    mounted() {
        new G6Map("board");
    },
    methods: {
        
    },
}
</script>
<style lang="scss" scoped>
.g6test_cnt{
    padding: 30px;
}
</style>
