<template>
    <div class='tableview'>
        <vue-particles
        id="particles-js" 
        color="#dedede"
        :particleOpacity="0.7"
        :particlesNumber="80"
        shapeType="circle"
        :particleSize="4"
        linesColor="#dedede"
        :linesWidth="1"
        :lineLinked="true"
        :lineOpacity="0.4"
        :linesDistance="150"
        :moveSpeed="3"
        :hoverEffect="true"
        hoverMode="grab"
        :clickEffect="true"
        clickMode="push">
        </vue-particles>
        <div class="loginTable">
            
        </div>
    </div>
</template>

<script>
export default {
    name: "login",
    components:{
        
    },
    data() {
        return {
            
        }
    },
    beforeCreate() {
        
    },
    mounted:function(){
       
    }
}
</script>
<style lang="scss" scoped>
#particles-js{background: #676a6c;}
.loginTable{
    position: absolute;
    top:0;
    left:0;
}
</style>