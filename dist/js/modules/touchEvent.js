import tools from "./tools.js";
import eventTarget from "./eventTarget.js";

//event
class TouchEvent extends eventTarget{
    /**
     * 构造
     * @param {html node} element
     */
    constructor(element){
        super();
        //元素
        this.element=element;
        //通用
        this.startPos=null;//开始point
        this.previousPos=null;//上一个point
        this.currentPos={x:0,y:0};//当前point
        this.moveVector=[0,0];//vector
        this.totalMoveVector=[0,0];//总移动vector
        this.eventType=null;
        this.isMoving=false;
        //初始化
        this.init();
    }
    /**
     * init
     */
    init(){
        //常规鼠标事件
        this.element.addEventListener("mousedown",(event)=>{
            this.eventType="mousedown";
            this.mousedown(event)
        })
        this.element.addEventListener("mousemove",(event)=>{
            this.eventType="mousemove"
            this.mousemove(event)
        })
        this.element.addEventListener("mouseup",(event)=>{
            this.eventType="mouseup"
            this.mouseup(event);
        })
    }
    /**
     * 工具方法，转换clientX到canvas pixel
     */
    toCanvasPixel(pos){
        return {
            x:pos.x/this.element.clientWidth*this.element.width,
            y:pos.y/this.element.clientHeight*this.element.height
        }
    }
    /**
     * mousedown
     */
    mousedown(event){
        this.currentPos={x:event.clientX,y:event.clientY};
        this.currentPos=this.toCanvasPixel(this.currentPos);
        this.startPos=this.currentPos;
        this.previousPos = this.currentPos;
        this.trigger("mousedown");
        this.detailMixEvent("mousedown");
    }
    /**
     * mousemove
     */
    mousemove(event){
        this.currentPos={x:event.clientX,y:event.clientY};
        this.currentPos=this.toCanvasPixel(this.currentPos);
        this.trigger("mousemove");
        this.detailMixEvent("mousemove");
        this.previousPos=this.currentPos;
    }
    /**
     * mouseup
     */
    mouseup(event){
        this.currentPos={x:event.clientX,y:event.clientY};
        this.currentPos=this.toCanvasPixel(this.currentPos);
        this.trigger("mouseup");
        this.detailMixEvent("mouseup");
        this.startPos=null;
        this.previousPos=null;
        this.currentPos=null;
        event.preventDefault();
    }
    /**
     * 处理混合情况
     */
    detailMixEvent(type){
        if(type=="mousedown"){
            this.isMoving=true;
        }else if(type=="mousemove" && this.isMoving){
            this.moveVector=[
                this.currentPos.x-this.previousPos.x,
                this.currentPos.y-this.previousPos.y
            ];
        }else if( type=="mouseup"){
            this.totalMoveVector=[
                this.currentPos.x-this.startPos.x,
                this.currentPos.y-this.startPos.y
            ];
            this.isMoving=false;
        }
        this.trigger("mixTouchEvent");
    }
}
export default TouchEvent;