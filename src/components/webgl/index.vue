<template>
  <div class="gl-container">
    <canvas width="400" height="400" id="glTest"></canvas>
  </div>
</template>

<script>
export default {
  name: "webgl",
  components: {},
  data() {
    return {
      gl: null,
    };
  },
  mounted: function () {
    this.gl = document.getElementById("glTest").getContext("webgl");
    this.draw3D();
  },
  methods: {
    drawPoint() {
      const { gl } = this;
      //顶点着色器
      var vertexShaderSource =
        "" +
        "void main(){" +
        "gl_PointSize = 20.0;" +
        "gl_Position = vec4(0.0,0.0,0.0,1.0);" +
        "}";
      //片段着色器
      var fragShaderSource =
        "" + "void main(){" + "gl_FragColor = vec4(1.0,1.0,0.0,0.5);" + "}";
      var program = this.initShader(vertexShaderSource, fragShaderSource);
      gl.drawArrays(gl.POINTS, 0, 1);
    },
    drawRect() {
      const { gl } = this;
      //矩形四个顶点坐标的数据
      // var data = new Float32Array([0.5,0.5,-0.5,0.5,-0.5,-0.5,0.5,-0.5]);
      // 数组里9个元素，每间隔3个为一组，分别代表zyx轴上的坐标值
      var data = new Float32Array([
        0.0,
        0.0,
        1.0, //三角形顶点1坐标
        0.0,
        0.5,
        0.0, //三角形顶点2坐标
        1.0,
        0.0,
        0.0, //三角形顶点3坐标
      ]);
      //顶点着色器
      var vertexShaderSource =
        "" +
        "attribute vec4 apos;" +
        "void main(){" +
        "mat4 m4 = mat4(1,0,0,0, 0,1,0,0, 0,0,1,0, 0.5,0,0,1);" +
        "gl_Position = m4*apos;" +
        "}";
      //片段着色器
      var fragShaderSource =
        "" + "void main(){" + "gl_FragColor = vec4(1.0,1.0,0.0,0.5);" + "}";
      var program = this.initShader(vertexShaderSource, fragShaderSource);
      //获取顶点着色器的位置变量apos，即aposLocation指向apos变量。
      var aposLocation = gl.getAttribLocation(program, "apos");
      //创建缓冲区对象
      var buffer = gl.createBuffer();
      //绑定缓冲区对象,激活buffer
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      //顶点数组传入buffer缓冲区
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
      //缓冲区中的数据按照一定的规律传递给位置变量apos
      gl.vertexAttribPointer(aposLocation, 3, gl.FLOAT, false, 0, 0);
      //允许数据传递
      gl.enableVertexAttribArray(aposLocation);
      //开始绘制图形
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
    draw3D() {
      //绘制立方体
      const { gl } = this;
      var data = new Float32Array([
        //z为0.5时，xOy平面上的四个点坐标
        0.5,  0.5,  0.5,
        -0.5,  0.5,  0.5,
        -0.5, -0.5,  0.5,
        0.5, -0.5,  0.5,
        //z为-0.5时，xOy平面上的四个点坐标
        0.5,  0.5, -0.5,
        -0.5,  0.5, -0.5,
        -0.5, -0.5, -0.5,
        0.5, -0.5, -0.5,
        //上面两组坐标分别对应起来组成一一对
        0.5,  0.5,  0.5,
        0.5,  0.5,  -0.5,

        -0.5,  0.5,  0.5,
        -0.5,  0.5,  -0.5,

        -0.5, -0.5,  0.5,
        -0.5, -0.5,  -0.5,

        0.5, -0.5,  0.5,
        0.5, -0.5,  -0.5,
      ]);
      //顶点着色器
      var vertexShaderSource =
        "" +
        "attribute vec4 apos;" +
        "void main(){" +
        //设置几何体轴旋转角度为30度，并把角度值转化为浮点值
        "float radian = radians(60.0);" +
        //求解旋转角度余弦值
        "float cos = cos(radian);" +
        //求解旋转角度正弦值
        "float sin = sin(radian);" +
       //引用上面的计算数据，创建绕x轴旋转矩阵
           // 1      0      0   0
           // 0   cosα   sinα   0
           // 0  -sinα   cosα   0
           // 0      0      0   1
           'mat4 mx = mat4(1,0,0,0,  0,cos,-sin,0,  0,sin,cos,0,  0,0,0,1);'+
           //引用上面的计算数据，创建绕y轴旋转矩阵
           // cosβ   0   sinβ    0
           //    0   1   0       0
           //-sinβ   0   cosβ    0
           //    0   0   0       1
           'mat4 my = mat4(cos,0,-sin,0,  0,1,0,0,  sin,0,cos,0,  0,0,0,1);'+
           "gl_Position = mx*my*apos;" +
        "}";
      //片段着色器
      var fragShaderSource =
        "" + "void main(){" + "gl_FragColor = vec4(1.0,1.0,0.0,0.5);" + "}";
      var program = this.initShader(vertexShaderSource, fragShaderSource);
      //获取顶点着色器的位置变量apos，即aposLocation指向apos变量。
      var aposLocation = gl.getAttribLocation(program, "apos");
      //创建缓冲区对象
      var buffer = gl.createBuffer();
      //绑定缓冲区对象,激活buffer
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      //顶点数组传入buffer缓冲区
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
      //缓冲区中的数据按照一定的规律传递给位置变量apos
      gl.vertexAttribPointer(aposLocation, 3, gl.FLOAT, false, 0, 0);
      //允许数据传递
      gl.enableVertexAttribArray(aposLocation);
      //开始绘制图形
       //LINE_LOOP模式绘制前四个点
       //LINE_LOOP绘制闭合的点
       gl.drawArrays(gl.LINE_LOOP,0,4);
      //LINE_LOOP模式从第五个点开始绘制四个点
       gl.drawArrays(gl.LINE_LOOP,4,4);
       //LINES模式绘制后8个点
       gl.drawArrays(gl.LINES,8,8);
    },
    draw3DWithIndex(){
        const { gl } = this;
        var data = new Float32Array([
          0.5,  0.5,  0.5,//顶点0
          -0.5,  0.5,  0.5,//顶点1
          -0.5, -0.5,  0.5,//顶点2
          0.5, -0.5,  0.5,//顶点3
          0.5,  0.5, -0.5,//顶点4
          -0.5,  0.5, -0.5,//顶点5
          -0.5, -0.5, -0.5,//顶点6
          0.5, -0.5, -0.5,//顶点7
        ]);
        //        顶点索引数组
        var indexes = new Uint8Array([
    //        前四个点
            0,1,2,3,
    //        后四个顶点
            4,5,6,7,
    //        前后对应点
            0,4,
            1,5,
            2,6,
            3,7
        ]);
        //创建缓冲区对象
        var indexesBuffer=gl.createBuffer();
        //绑定缓冲区对象
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexesBuffer);
        //索引数组indexes数据传入缓冲区
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,indexes,gl.STATIC_DRAW);
        //LINE_LOOP模式绘制前四个点
        gl.drawElements(gl.LINE_LOOP,4,gl.UNSIGNED_BYTE,0);
        //LINE_LOOP模式从第五个点开始绘制四个点
        gl.drawElements(gl.LINE_LOOP,4,gl.UNSIGNED_BYTE,4);
        //LINES模式绘制后8个点
        gl.drawElements(gl.LINES, 8, gl.UNSIGNED_BYTE, 8);
    },
    initShader(vertexShaderSource, fragShaderSource) {
      const { gl } = this;
      var vertexShader = gl.createShader(gl.VERTEX_SHADER);
      var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
      gl.shaderSource(vertexShader, vertexShaderSource);
      gl.shaderSource(fragShader, fragShaderSource);
      gl.compileShader(vertexShader);
      gl.compileShader(fragShader);
      var program = gl.createProgram();
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragShader);
      gl.linkProgram(program);
      gl.useProgram(program);
      return program;
    },
  },
};
</script>
<style lang="scss" scoped>
</style>