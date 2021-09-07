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