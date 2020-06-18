import tools from "./tools.js";
import eventTarget from "./eventTarget.js";

// 绘图 
class Sprite extends eventTarget{
    //构造
    constructor(pos) {
        super();
        //类型，默认sprite
        this.type="default";
        //id
        this.id=null;
        //name
        this.name="";
        //类名
        this.className=[];
        //样式
        this.style=null;
        //x坐标
        this.x = pos.x;
        //y坐标
        this.y = pos.y;
        //宽
        this.width=0;
        //高
        this.height=0;
        //层级
        this.index=100;
        //选中
        this.active=false;
        //缩放
        this.scale=1.0;
        //位移
        this.translate={x:0,y:0};
        //可见性
        this.visible=true;
        //zindex
        this.zindex=0;
        //allowClick
        this.allowClick=true;
        //click event
    }
    /**
     * 移动
     * @param {vector} vector 
     */
    move(vector){
        this.x+=vector[0];
        this.y+=vector[1];
    }
    /**
     * 绘制
     * @param {ctx} ctx 
     */
    draw(ctx){
        //是否可绘制'
        if(!this.visible){
            return;
        }
    }
    toggleActive(){
        this.active=!this.active;
    }
}
export default Sprite;