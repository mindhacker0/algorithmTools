class DefaultArray extends Array{
    constructor(...args){
       super(...args);
    }
    // [Symbol.unscopables](){//使用width时从对象中排除
      
    // }
    // [Symbol.hasInstance](RightParam){//对象的Symbol.hasInstance属性，指向内部方法，当其他对象使用instanceOf运算符，判断是否为该对象的实例时，会调用这个方法。
    //     return RightParam instanceof DefaultArray;
    // }
    // get [Symbol.isConcatSpreadable](){//对象的Symbol.isConcatSpreadable属性等于一个布尔值，表示该对象用于Array.prototype.concat()时，是否可以展开
    //    return false;
    // }
    //static get [Symbol.species](){
        //A function valued property that is the constructor function that is used to create derived objects.
        //对象的Symbol.species属性，指向一个构造函数。创建衍生对象时，会使用该属性。
       //return this;//默认this也就是本身的构造函数
    //}
    // *[Symbol.iterator](){//对象的Symbol.iterator属性，指向该对象的默认遍历器方法
    //     let i = 0;console.log("call iterator");
    //     while (this[i] != undefined) {
    //         yield this[i];
    //         ++i;
    //     }
    // }
    // [Symbol.toPrimitive](hint){
    // //对象的Symbol.toPrimitive属性，指向一个方法。该对象被转为原始类型的值时，会调用这个方法，返回该对象对应的原始值类型值。
    // //Symbol.toPrimitive被调用时，会接受一个字符串参数，表示当前运算的模式，一共有三种模式:
    // // Number：该场合需要转换为数值。
    // // String：该场合需要转成字符串。
    // // Default：该场合可以转成数值，也可以转成字符串。
    //     console.log(hint);
    //     switch(hint){
    //         case "number" :
    //             return NaN;
    //         case "string" :
    //             return "[DefaultArray Array]";
    //         case "default" :
    //             return "default";
    //         default :
    //             throw new Error();
    //     }
    // }
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
    // toString(){
    //     console.log("get string");
    //     return "[DefaultArray Array]";
    // }
    // valueOf(){
    //     console.log("get value");
    //     return NaN;
    // }
}
class DefaultString extends String{
    constructor(str){
        let newStr=super(str);
        this.realValue=newStr;
    }
    [Symbol.match](str){//对象的Symbol.match属性，指向一个函数。当执行str.match(myObject)时，如果该属性存在，会调用它，返回该方法的返回值。
        return this.indexOf(str);
    }
    [Symbol.replace](...s){//对象的Symbol.replace属性，指向一个方法，当该对象被String.prototype.replace方法调用时，会返回该方法的返回值。
        return console.log(s);
    }
    [Symbol.search](str){//对象的Symbol.search属性，指向一个方法，当该对象被String.prototype.search方法调用时，会返回该方法的返回值
        return str.includes(this.value);
    }
    [Symbol.split](str) {//对象的Symbol.split属性，指向一个方法，当该对象被String.prototype.split方法调用时返回该方法的返回值。
        let index = str.indexOf(this.value);
        if(index === -1){
            return str;
        }
        return [
            str.substr(0,index),
            str.substr(index + this.value.length),
        ]
    }
    get [Symbol.toStringTag](){
        console.log("call tagString");
        return "0000"
    }
    toString(){
        console.log("call toString");
        return this.realValue;
    }
}
let arr=new DefaultArray(1,2,3);
// with(arr){
//     console.log(arr);
// }
// console.log(arr);
// console.log(arr instanceof Array);
// let extendArr=arr.concat([4,5,6]);
// console.log(extendArr);
// console.log([...extendArr]);
// console.log(Number(arr));//NaN
// console.log(String(arr));//[DefaultArray Array]
// console.log(`${arr}::es6string`);//[DefaultArray Array]::es6string
// console.log(Boolean(arr));//true 没有经过调用
// console.log(+arr);//NaN
// console.log(""+arr);//default
// console.log(1+arr);//default
// console.log(!arr);//false 没有经过调用
// console.log(extendArr instanceof DefaultArray);
// for(let i of arr){
//     console.log(i);
// }
// function *Iterator(arr){
//     for(let i=0;i<arr.length;i++){
//        yield arr[i];
//     }
//     return true;
// }
// let myarr=Iterator([5,4,3,2,1]);
// console.log(myarr.next())
// for(let i of myarr){
//     console.log(i);
// }
async function run() {
    for await (const value of arr) {
        console.log("async::"+value);
    }
}
run();
// let newstr=new DefaultString("122344");
// console.log(newstr.split("2"));