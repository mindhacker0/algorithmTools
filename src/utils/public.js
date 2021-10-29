export const openFile = function(accept){//will not be call if user dont interact with browser.
    return new Promise((resolve,reject)=>{
        let fileInput = document.createElement("input");
        fileInput.setAttribute("display","none");
        fileInput.setAttribute("type","file");
        fileInput.setAttribute("accept",accept);
        fileInput.addEventListener("change",(e)=>{
            resolve(e);
        });
        fileInput.click();
    })
    
}
let wmap = new WeakMap();
function tranverse(obj,path=''){
    for(var i in obj){
        if(typeof obj[i] === 'object' && obj[i]!==null && !wmap.get(obj[i])){
            wmap.set(obj[i],true);
            tranverse(obj[i],path+'/'+i);
        }else if(deviceType.includes(obj[i])){
            console.log(i,obj[i],path);
        }
    }
}