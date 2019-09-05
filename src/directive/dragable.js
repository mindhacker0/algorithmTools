let dragable={//实现元素的拖拽
    inserted:function(el,val,node){
        let ismove=false;
        el.parentNode.setAttribute('position','relative');
        el.onmousedown=function(event){
            var posx = event.pageX - el.offsetLeft;//按下时鼠标在元素内部的偏移
            var posy = event.pageY - el.offsetTop;
            ismove=true;
            el.onmousemove=function(event){
                var posx_new = event.pageX - posx;
                //计算出新的left值，实际上是新的pagex-旧的pagex+元素的offset的值，就是新的left值
                var posy_new = event.pageY - posy;
                if(ismove){
                    el.style.position='absolute';
                    el.style.left = posx_new + "px";//使得被拖放元素跟随鼠标移动
                    el.style.top = posy_new + "px";
                }
            }
            el.onmouseup=function(){
                ismove=false;
            }
        };
        el.onmouseleave=function(){
            ismove=false;
        }
    }
}
const install=Vue=>{
    Vue.directive('dragable',dragable);
}
dragable.install=install;
export default dragable