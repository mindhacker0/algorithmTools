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
        this.drawRect();
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
            'gl_FragColor = vec4(1.0,1.0,0.0,0.5);'+
            '}';
            var program = this.initShader(vertexShaderSource,fragShaderSource);
            gl.drawArrays(gl.POINTS,0,1);
        },
        drawRect(){
            const {gl} = this;
            //矩形四个顶点坐标的数据
            // var data = new Float32Array([0.5,0.5,-0.5,0.5,-0.5,-0.5,0.5,-0.5]);
            // 数组里9个元素，每间隔3个为一组，分别代表zyx轴上的坐标值
            var data=new Float32Array([
                0.0, 0.0, 1.0,//三角形顶点1坐标
                0.0, 0.5, 0.0,//三角形顶点2坐标
                1.0, 0.0, 0.0//三角形顶点3坐标
            ]);
            //顶点着色器
            var  vertexShaderSource = ''+
            'attribute vec4 apos;'+
            'void main(){' +
                'gl_Position = apos;' +
            '}';
            //片段着色器
            var fragShaderSource = '' +
            'void main(){' +
            'gl_FragColor = vec4(1.0,1.0,0.0,0.5);'+
            '}';
            var program = this.initShader(vertexShaderSource,fragShaderSource);
            //获取顶点着色器的位置变量apos，即aposLocation指向apos变量。
            var aposLocation = gl.getAttribLocation(program,'apos');
            //创建缓冲区对象
            var buffer = gl.createBuffer();
            //绑定缓冲区对象,激活buffer
            gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
            //顶点数组传入buffer缓冲区
            gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);
            //缓冲区中的数据按照一定的规律传递给位置变量apos
            gl.vertexAttribPointer(aposLocation,3,gl.FLOAT,false,0,0);
            //允许数据传递
            gl.enableVertexAttribArray(aposLocation);
            //开始绘制图形
            gl.drawArrays(gl.TRIANGLES,0,3);
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