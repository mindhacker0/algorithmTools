const path = "http://192.168.3.200:8090";
class G6Map{
    constructor(id){
        this.container = document.getElementById(id);
        this.width = this.container.scrollWidth;
        this.height = (this.container.scrollHeight || 500) - 20;
        this.init();
    }
    init(){
        const {container,width,height} = this;
        const graph = new window.G6.Graph({
            container,
            width,
            height,
            modes: {
              default: ['drag-canvas', 'drag-node'],
            },
            layout: {
              type: 'fruchterman',
              maxIteration: 8000,
              gravity: 1,
              workerEnabled: true,
            },
            animate: true,
            defaultNode: {
                shape: 'circle',
                //color: 'transparent',
                size:20,
                style: {
                  //fill: 'rgb(184, 220, 254)',
                  cursor: 'pointer',
                  lineWidth: 0,
                  stroke: 'transparent'
                },
                labelCfg: {
                  position: 'bottom',
                  style: {
                    fontSize: 14
                  }
                },
                linkPoints: {
                  top: false,
                  bottom: false,
                  left: false,
                  right: false,
                  fill: '#fff',
                  size: 3
                }
            },
            defaultEdge: {
                type: 'quadratic',
                style: {
                  /* endArrow:  {
                    path: G6.Arrow.vee(10, 10, 7),
                    d: 0
                  }, */
                  stroke: '#ccc',
                  lineAppendWidth: 3,
                  cursor: 'pointer',
                  lineWidth: 1
                },
                labelCfg: {
                  refY: 5,
                  autoRotate: true, // 边上的标签文本根据边的方向旋转
                  style: {
                    fontSize: 14,
                    fill: '#333'
                  }
                },
            },
        });
        if (typeof window !== 'undefined')
        window.onresize = () => {
            if (!graph || graph.get('destroyed')) return;
            if (!container || !container.scrollWidth || !container.scrollHeight) return;
            graph.changeSize(container.scrollWidth, container.scrollHeight - 20);
        };
        this.defineNode();
        fetch('http://192.168.3.200:7052/social-network/phoneAnalysis/phoneMapping?objId=4437994861548042064')
        .then((res) => res.json())
        .then((data) => {
            let {links,nodes} = data;
            nodes = nodes.map(({key,...others})=>({id:key,...others}));
            let edges = links.map(({from,to,...others})=>({source:from,target:to,...others}));
            console.log(nodes,edges);
            graph.data({
                nodes,
                edges
            });
            graph.render();
        });
    }
    defineNode(){
        window.G6.registerNode('circle', {
            afterDraw(cfg, group) {
              console.log(cfg,group);
              //头像
              let size = cfg.size;
              const avatar = group.addShape('image', {
                attrs: {
                  x: cfg.type === '0102' && cfg.businessId ? size/(-2) : (size - 4)/(-2),
                  y:  cfg.type === '0102' && cfg.businessId ? size/(-2) : (size - 4)/(-2),
                  width: cfg.type === '0102' && cfg.businessId ? size : size - 4,
                  height: cfg.type === '0102' && cfg.businessId ? size : size - 4,
                  img: G6Map.backImgFunc(cfg)
                },
                draggable: true,
                name: 'avatar'
              });
              avatar.setClip({
                type: 'circle',
                attrs: {
                  r: size/2 - 2,
                  x: 0,
                  y: 0
                }
              });
            }
          }, 'circle');
    }
    static backImgFunc({type, businessId, backImg}) {
        if(['01', '0102'].includes(type) && backImg && backImg.length){
          if(backImg.startsWith('http')) return backImg;
          return `${path}/ceye_api/ceye_demo_web/photo/img?key=${backImg}&defaultImg=risk`;
        }
        if(process.env.NODE_ENV === 'production' && type === '0102' && businessId){
          let head_img = businessId.split('').reverse().join('') + '_0001';
          return `${path}/ceye_api/ceye_demo_web/photo/img?key=${head_img}&defaultImg=risk`;
        }
        try{
          return require(`./img/objectType/${type}.png`);
        }catch(err){
          try{
            return require(`./img/objectType/${type.substring(0, 2)}.png`);
          }catch(err){
            return require('./img/objectType/node-default.png');
          }
        }
  
    }
}
export default G6Map;