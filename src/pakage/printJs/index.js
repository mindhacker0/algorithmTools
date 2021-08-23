function GUUID(prefix){//产生GUUID(一个随机字符串),作为类名
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
    s[8] = s[13] = s[18] = s[23] = "-";
    var uuid = s.join("");
    return prefix+uuid;
}
const standards = {//文档类型
    strict: 'strict',
    loose: 'loose',
    html5: 'html5'
};
class DomNode{//dom 节点类
    constructor(element){
        if(!element instanceof HTMLElement) return new Error(element+"is not a HTMLElement");
        this.style = this.getStaticStyle(element);
        this.className = GUUID("print-");
        this.nodeType = element.nodeType;
        this.nodeName = element.nodeName.toLowerCase();
        this.standard = standards.html5;
        this.childNodes = [];
    }
    getStaticStyle(element){//计算元素的样式，存储起来以生成样式列表。
       const allStyles =  window.getComputedStyle(element);
       const style = new Map();
       for(var i in allStyles){
           if(isNaN(i) && allStyles[i]){
               style.set(i.replace(/[A-Z]/g,function(value){ return "-"+value}),allStyles[i]);
           }
       }
       return style;
    }
}
class textNode{//文本节点
    constructor(element){
        this.content = element.textContent;
    }
}
class Print{
    constructor(configs){
        const {el,title} = configs;
        this.printDom = el instanceof HTMLElement?el:document.querySelector(el);
        this.domTree = null;
        this.title = title||"打印标题";
        this.frame = null;
        this.styleSheets = new Map();
        this.makeCloneDomWithStyle();
        this.docType = this.getDocType();
        this.head = this.getHead();
        this.body = this.getBody();
        this.makeFrame();
    }
    makeCloneDomWithStyle(){//拷贝所有需要克隆的元素的样式生并成dom树
        const vm =this;
        function copyELements(parent){//遍历dom树，解析它们的当前样式。
            if(parent instanceof Element){//元素节点
                const dom = new DomNode(parent);
                vm.styleSheets.set(dom.className,dom.style);
                let children = parent.childNodes;
                if(typeof children === "object" && children.length){
                    for(var i = 0;i<children.length;i++){
                        dom.childNodes.push(copyELements(children[i]));
                    }
                }
                return dom;
            }else if(parent instanceof Text){//文本节点
               return new textNode(parent);
            }
            //console.log(parent.__proto__,parent);
            //包含注释和其他的字符被过滤掉，如果需要后面可以处理
            return parent;
        }
        this.domTree = copyELements(this.printDom);
    }
    makeFrame(){//构造iframe,使我们构造的页面放进去调用window.print()打印。
        let iframe = document.createElement('iframe');
        iframe.style.border = '0px';
        iframe.style.position = 'absolute';
        // iframe.style.width = '0px';
        // iframe.style.height = '0px';
        iframe.style.right = '0px';
        iframe.style.top = '0px';
        iframe.setAttribute('id', "printjs-iframe");
        iframe.setAttribute('src',new Date().getTime());
        document.body.append(iframe);
        iframe.onload = ()=>{
            iframe.contentDocument.write(`${this.docType}<html>${this.head}<body></body></html>`);
            iframe.contentDocument.body.append(this.body);
            iframe.contentWindow.print();
            console.log(iframe);
        }
        this.frame = iframe;
    }
    getDocType(){//构造文档声明，如何解析文档
        if (this.standard === standards.html5) {
            return '<!DOCTYPE html>';
        }
        var transitional = this.standard === standards.loose ? ' Transitional' : '';
        var dtd = this.standard === standards.loose ? 'loose' : 'strict';
        return `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01${transitional}//EN" "http://www.w3.org/TR/html4/${dtd}.dtd">`;
    }
    getHead() {//构造头部，样式也将构造存放在这儿
        let links = '';
        let style = '';
        // 复制所有link标签
        [].forEach.call(document.querySelectorAll('link'), function(item) {
          if(item.href.indexOf('.css') >= 0){
            links += `<link type="text/css" rel="stylesheet" href="${item.href}" >`;
          }
        });
        this.styleSheets.forEach((val,key)=>{//解析收集的样式
            style+=`.${key}{`;
            val.forEach((value,name)=>{
                style+=`${name}:${value};`
            });
            style+=`}`;
        });
        return `<head><title>${this.title}</title>${links}<style type="text/css">${style}</style></head>`;
    }
    getBody(){//构造body，遍历之前创建的Dom树并添加样式，存放在fragment中
        let wrapper = document.createDocumentFragment();
        function renderElement(vNode,root){
            if(vNode instanceof DomNode){//还原元素节点
                let elem = document.createElement(vNode.nodeName);
                elem.classList.add(vNode.className);
                const children = vNode.childNodes;
                if(children.length){
                    for(var i = 0;i<children.length;i++){
                        renderElement(children[i],elem);
                    }
                }
                root.appendChild(elem);
            }else if(vNode instanceof textNode){//还原文本节点
                root.appendChild(document.createTextNode(vNode.content));
            }
        }
        renderElement(this.domTree,wrapper);
        return wrapper;
    }
    
}
export default Print;