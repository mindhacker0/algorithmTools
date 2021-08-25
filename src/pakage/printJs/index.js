import styleEnum from "./styleEnum";
function GUUID(prefix){//random key,to generate class names
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";
    var uuid = s.join("");
    return prefix+uuid;
}
const standards = {
    strict: 'strict',
    loose: 'loose',
    html5: 'html5'
};
class DomNode{//dom node
    constructor(element){
        if(!(element instanceof HTMLElement)) return new Error(element+"is not a HTMLElement");
        this.style = this.getStaticStyle(element);
        this.className = GUUID("print-");
        this.nodeType = element.nodeType;
        this.nodeName = element.nodeName.toLowerCase();
        this.childNodes = [];
    }
    getStaticStyle(element){//compute element styles
       const allStyles =  window.getComputedStyle(element);
       const style = new Map();
       for(var i of styleEnum){
            if(typeof allStyles[i]!=="undefined" && allStyles[i]!==''){
                style.set(i.replace(/[A-Z]/g,function(value){ return "-"+value.toLocaleLowerCase()}),allStyles[i]);
            }
       }
       console.log(allStyles);
       return style;
    }
}
class textNode{//text node
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
        this.standard = standards.html5;
        this.styleSheets = new Map();
        this.makeCloneDomWithStyle();
        this.docType = this.getDocType();
        this.head = this.getHead();
        this.body = this.getBody();
        this.makeFrame();
    }
    makeCloneDomWithStyle(){//拷贝所有需要克隆的元素的样式
        const vm =this;
        function copyELements(parent){//tranvers all elements and resolve their styles inoder to copy to new frame.
            if(parent instanceof Element){//plain html elements
                const dom = new DomNode(parent);
                vm.styleSheets.set(dom.className,dom.style);
                let children = parent.childNodes;
                if(typeof children === "object" && children.length){
                    for(var i = 0;i<children.length;i++){
                        dom.childNodes.push(copyELements(children[i]));
                    }
                }
                return dom;
            }else if(parent instanceof Text){//text nodes
               return new textNode(parent);
            }
            //console.log(parent.__proto__,parent);
            //comments or other invalid token
            return parent;
        }
        this.domTree = copyELements(this.printDom);//ananlyse dom struct and trans into Object.
    }
    makeFrame(){//make iframe
        let iframe = document.createElement('iframe');
        iframe.style.border = '0px';
        iframe.style.position = 'absolute';
        iframe.style.width = '100%';
        iframe.style.height = '400px';
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
    getDocType(){//make doctype,how to decode this document
        if (this.standard === standards.html5) {
            return '<!DOCTYPE html>';
        }
        var transitional = this.standard === standards.loose ? ' Transitional' : '';
        var dtd = this.standard === standards.loose ? 'loose' : 'strict';
        return `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01${transitional}//EN" "http://www.w3.org/TR/html4/${dtd}.dtd">`;
    }
    getHead() {//resolve dom style to generate class
        let links = '';
        let style = '';
        // 复制所有link标签
        [].forEach.call(document.querySelectorAll('link'), function (item) {
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
    getBody(){//render dm tree.
        let wrapper = document.createDocumentFragment();
        function renderElement(vNode,root){
            if(vNode instanceof DomNode){
                let elem = document.createElement(vNode.nodeName);
                elem.classList.add(vNode.className);
                const children = vNode.childNodes;
                if(children.length){
                    for(var i = 0;i<children.length;i++){
                        renderElement(children[i],elem);
                    }
                }
                root.appendChild(elem);
            }else if(vNode instanceof textNode){//text nodes
                root.appendChild(document.createTextNode(vNode.content));
            }
        }
        renderElement(this.domTree,wrapper);
        return wrapper;
    }
    
}
export default Print;