<template>
   <div>
        <canvas id='circle'></canvas>
        <video width="300px" height="300px"></video>
   </div>
</template>


<script>
export default {
    data() {
        return {}
    },
    mounted(){
        this.drawBounce();
    },
    methods: {
        drawBounce(){//碰撞圈
            let canvas = document.getElementById("circle");
            canvas.width  = 200;
            canvas.height = 200;
            let ctx = canvas.getContext("2d");
            let radius = 50;
            let x=radius+Math.random()*(200-radius*2);
            let y=radius+Math.random()*(200-radius*2);
            //初始方向
            let dx=(Math.random()-0.5)*4;
            let dy=(Math.random()-0.5)*4;
            function bounce(){
                requestAnimationFrame(bounce);
                ctx.clearRect(0,0,200,200);
                if(x+radius > 200 || x-radius <0){
                    dx=-dx;
                }
                if(y+radius > 200 || y-radius <0){
                    dy=-dy;
                }
                x+=dx;
                y+=dy;
                ctx.beginPath();
                ctx.strokeStyle = "blue";
                ctx.arc(x,y,radius,0,2*Math.PI,false);
                ctx.stroke();
            }
            bounce();
            this.recordCanvas();
        },
        recordCanvas(){
            let canvas = document.getElementById("circle");
            let allChunks=[];
            let isFinished = false;
            let stream=canvas.captureStream(60); // 60 FPS recording
            let recorder=new MediaRecorder(stream, {
                mimeType:'video/webm;codecs=vp9',
            });
            // canvas 录制回调
            recorder.ondataavailable = e => {
                console.log("TCL: e", e)
                allChunks.push(e.data);
                if(isFinished){
                    const link = document.createElement('a');
                    link.style.display = 'none';
                    const fullBlob = new Blob(allChunks);
                    const downloadUrl = window.URL.createObjectURL(fullBlob);
                    link.href = downloadUrl;
                    link.download = `test${Math.random()}.webm`;
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                }
            }
            recorder.start(10);
            setTimeout(()=>{
                isFinished = true;
                recorder.stop();
            },5000);
        }
    },
};
</script>