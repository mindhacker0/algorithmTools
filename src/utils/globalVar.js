export default{
    install(Vue){
        Vue.prototype.russia_block=[//俄罗斯方块的模型 name相同是同一种模型 key标识旋转变形 center是旋转中心（不知道到时候有用不）
            {name:"model1",arr:[[1,0],[1,1],[0,1]],key:0b00,center:[1,0]},
            {name:"model1",arr:[[0,1,1],[1,1,0]],key:0b01,center:[0,1]},
            {name:"model2",arr:[[0,1],[1,1],[1,0]],key:0b00,center:[1,1]},
            {name:"model2",arr:[[1,1,0],[0,1,1]],key:0b01,center:[1,1]},
            {name:"model3",arr:[[1,0],[1,1],[1,1]],key:0b00,center:[1,1]},
            {name:"model3",arr:[[1,1,1],[1,1,0]],key:0b01,center:[1,1]},
            {name:"model3",arr:[[1,1],[1,1],[0,1]],key:0b10,center:[0,1]},
            {name:"model3",arr:[[0,1,1],[1,1,1]],key:0b11,center:[1,0]},
            {name:"model4",arr:[[0,1],[1,1],[1,1]],key:0b00,center:[0,1]},
            {name:"model4",arr:[[1,1,0],[1,1,1]],key:0b01,center:[1,0]},
            {name:"model4",arr:[[1,1],[1,1],[1,0]],key:0b10,center:[1,1]},
            {name:"model4",arr:[[1,1,1],[0,1,1]],key:0b11,center:[1,1]},
            {name:"model5",arr:[[0,1],[1,1],[0,1]],key:0b00,center:[1,1]},
            {name:"model5",arr:[[0,1,0],[1,1,1]],key:0b01,center:[1,1]},
            {name:"model5",arr:[[1,0],[1,1],[1,0]],key:0b10,center:[0,1]},
            {name:"model5",arr:[[1,1,1],[0,1,0]],key:0b11,center:[1,0]},
            {name:"model6",arr:[[1],[1],[1],[1]],key:0b00,center:[0,2]},
            {name:"model6",arr:[[1,1,1,1]],key:0b01,center:[1,0]},
            {name:"model7",arr:[[1,1],[1,1]],key:0b00,center:[0,1]},
        ]
    }
}
class DefaultArray extends Array{
    constructor(...args){
       super(...args);
    }
    makeAsyncName(str){console.log("call asyncIterator:"+str);
        return new Promise((rs,rj)=>{
            setTimeout(()=>{rs(str)},5000);
        });
    }
    *[Symbol.asyncIterator](){
        let i=0;
        while (this[i] != undefined) {
            yield this.makeAsyncName(this[i]);
            ++i;
        }
    }
}
let arr=new DefaultArray(1,2,3);
async function run() {
    for await (const value of arr) {
        console.log("async::"+value);
    }
}
run();