import tools from "./tools.js";
import eventTarget from "./eventTarget.js";

// 绘图 
class Sprite extends eventTarget{
    //构造
    constructor(config) {
        super();
        this.config=config || {};
        //类型，默认sprite
        this.type=this.config || "default";
        //id
        this.id=this.config.id || "";
        //name
        this.name=this.config.name || "";
        //x坐标
        this.x = this.config.x || 0;
        //y坐标
        this.y = this.config.y || 0;
        //width
        this.width=this.config.width || 0;
        //height
        this.height=this.config.height || 0;
        //层级
        this.index=this.config.index || 100;
        //选中
        this.active=this.config.active || false;
        //缩放
        this.scale=this.config.scale || 1.0;
        //旋转
        this.rotate=this.config.rotate || 0.0;
        //位移
        this.translate=this.config.translate || [0,0];
        //zindex
        this.zindex=this.config.zindex || 0;
        //useDrag
        this.useDrag=this.config.useDrag || false;
        //allowClick
        this.allowClick=this.config.allowClick!=undefined? this.config.allowClick : true;
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
     * 移动到一个点
     */
    moveTo(point){
        this.x=point.x;
        this.y=point.y;
    }
    /**
     * 旋转
     */
    rotate(deg){
        this.rotate=deg;
    }
}
export default Sprite;
