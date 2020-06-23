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
        //旋转点
        this.rotationOrigin=[0.5,0.5]
        //旋转点
        this._rotationOriginPositon=[0,0]
        //位移
        this.translate=this.config.translate || [0,0];
        //zindex
        this.zindex=this.config.zindex || 0;
        //useDrag
        this.useDrag=this.config.useDrag || false;
        //allowClick
        this.allowClick=this.config.allowClick!=undefined? this.config.allowClick : true;
        //click event
        //parent 只支持一级
        this.parent=this.config.parent || null;
        //相对父元素的定位
        this.relativePosition=[.5,.5]
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
    /**
     * 计算相对位置
     */
    calculateRelativePosition(){
        if(this.parent){
            this.x=this.parent.x+this.parent.width*this.relativePosition[0]-this.width*.5;
            this.y=this.parent.y+this.parent.height*this.relativePosition[1]-this.height*.5;
        }
    }
    /**
     * 计算相对旋转
     */
    calculateRelativeRotate(ctx){
        //跟随父节点
        if(this.parent && this.parent.rotate){
            this._rotationOriginPositon[0]=this.parent.x+this.parent.width*this.parent.rotationOrigin[0];
            this._rotationOriginPositon[1]=this.parent.y+this.parent.height*this.parent.rotationOrigin[1];
            this.rotate=this.parent.rotate;
        }else if(this.rotate){
            this._rotationOriginPositon[0]= this.x+this.width*this.rotationOrigin[0];
            this._rotationOriginPositon[1]= this.y+this.height*this.rotationOrigin[1];
        }
    }
    /**
     * 设置缩放
     * @param {numner} scaleVal
     */
    setScale(scaleVal){
        //考虑缩放点
        this.scale=scaleVal;
        let ow=this.width;
        let oh=this.height;
        this.width=this.width*scaleVal;
        this.height=this.height*scaleVal;
        this.x-=((this.width-ow)*this.rotationOrigin[0])
        this.y-=((this.height-oh)*this.rotationOrigin[1])
    }
}
export default Sprite;
