<template>
    <div class='gl-container'>
       <canvas width="400" height="400" id="glTest"></canvas>
    </div>
</template>

<script>
export default {
    name: "webgl",
    components:{
      
    },
    data() {
        return {
           gl:null
        }
    },
    mounted:function(){
        this.gl = document.getElementById("glTest").getContext("webgl");
        this.drawPoint();
    },
    methods:{
        drawPoint(){
            const {gl} = this;
            //顶点着色器
            var  vertexShaderSource = ''+
            'void main(){' +
            'gl_PointSize = 20.0;' +
            'gl_Position = vec4(0.0,0.0,0.0,1.0);' +
            '}';
            //片段着色器
            var fragShaderSource = '' +
            'void main(){' +
            'gl_FragColor = vec4(1.0,0.0,0.0,1.0);'+
            '}';
            var program = this.initShader(vertexShaderSource,fragShaderSource);
            gl.drawArrays(gl.POINTS,0,1);
        },
        initShader(vertexShaderSource,fragShaderSource){
            const {gl} = this;
            var vertexShader = gl.createShader(gl.VERTEX_SHADER);
            var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
            gl.shaderSource(vertexShader,vertexShaderSource);
            gl.shaderSource(fragShader,fragShaderSource);
            gl.compileShader(vertexShader);
            gl.compileShader(fragShader);
            var program = gl.createProgram();
            gl.attachShader(program,vertexShader);
            gl.attachShader(program,fragShader);
            gl.linkProgram(program);
            gl.useProgram(program);
            return program;
        }
    }
}
</script>
<style lang="scss" scoped>
    
</style>