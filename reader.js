var openFile = function(accept){//will not be call if user dont interact with browser.
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
    
};openFile("*.txt").then(res=>{
    let file = res.path[0].files[0];
    let page = 1850,pageSize = 2000;
    let reader=new FileReader();
    reader.readAsText(file,'GBK');
    reader.onload=function(){
        console.log(reader.result.substr(page*pageSize,pageSize));
    }
});