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
        this.element.addEventListener("touchstart",(event)=>{
            this.eventType="touchstart";
            this.touchstart(event)
        })
        this.element.addEventListener("touchmove",(event)=>{
            this.eventType="touchmove"
            this.touchmove(event)
        })
        this.element.addEventListener("touchend",(event)=>{
            this.eventType="touchend"
            this.touchend(event);
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
     * touchstart
     */
    touchstart(event){
        this.currentPos={x:event.touches[0].clientX,y:event.touches[0].clientY};
        this.currentPos=this.toCanvasPixel(this.currentPos);
        this.startPos=this.currentPos;
        this.previousPos = this.currentPos;
        this.trigger("touchstart");
        this.detailMixEvent("touchstart");
    }
    /**
     * touchmove
     */
    touchmove(event){
        this.currentPos={x:event.touches[0].clientX,y:event.touches[0].clientY};
        this.currentPos=this.toCanvasPixel(this.currentPos);
        this.trigger("touchmove");
        this.detailMixEvent("touchmove");
        this.previousPos=this.currentPos;
    }
    /**
     * touchend
     */
    touchend(event){
        // this.currentPos={x:event.touches[0].clientX,y:event.touches[0].clientY};
        // this.currentPos=this.toCanvasPixel(this.currentPos);
        this.trigger("touchend");
        this.detailMixEvent("touchend");
        this.startPos=null;
        this.previousPos=null;
        this.currentPos=null;
        event.preventDefault();
    }
    /**
     * 处理混合情况
     */
    detailMixEvent(type){
        if(type=="touchstart"){
            this.isMoving=true;
        }else if(type=="touchmove" && this.isMoving){
            this.moveVector=[
                this.currentPos.x-this.previousPos.x,
                this.currentPos.y-this.previousPos.y
            ];
        }else if( type=="touchend"){
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