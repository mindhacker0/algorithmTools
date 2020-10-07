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
            <canvas ref="cav_gl" width="50%"></canvas>
        </div>
    </div>
</template>

<script>
import G3D from 'g3d';
export default {
    name: "login",
    components:{
        
    },
    data() {
        return {
            camera_bg:null
        }
    },
    beforeCreate() {
        
    },
    mounted:function(){
        console.log(this.$refs.cav_gl,G3D);
        let engine = new G3D.Engine(this.$refs.cav_gl);
        let scene = new G3D.Scene(engine);
        let camera = new G3D.RotatePerspectiveCamera(scene);
        camera.alpha = 0;
        camera.beta = 0;
        camera.radius = 8;
        let light1 = new G3D.DirectionalLight(scene);
        light1.color = {r: 255, g: 200, b: 200};
        light1.direction = {x: 1, y: 0, z: 1};
        light1.intensity = 0.8;
        let m1 = G3D.MeshBuilder.createPlane(
        scene, 6, 4
        );
        m1.position.z = -1;
        let m2 = G3D.MeshBuilder.createSphere(
        scene, 1
        );
        m2.position.z = 1;
        scene.render();
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
.loginTable>canvas{
    width: 800px;
    height: 600px;
}
</style>