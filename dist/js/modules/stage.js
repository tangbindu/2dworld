import ImageSprite from "./sprite_image.js";
import eventTarget from "./eventTarget.js";
import TouchEvent from "./touchEvent.js";
class Stage extends eventTarget{
    /**
     * 构造
     */
    constructor(){
        super();
        //指canvas组件
        this.view=null;
        //绘图上下文
        this.ctx=null;
        //stage的width
        this.width=400;
        //stage的高
        this.height=300;
        //render内容列表
        this.spriteList=[];
        //touch event
        this.touchEvent=null;
        //active sprite 
        this.activeSprite=null;
        //初始化舞台
        this.init();
    }
    /**
     * 初始化
     */
    init(){
        this.view=document.createElement("canvas");
        this.ctx = this.view.getContext("2d");
        this.resize(this.width,this.height);
        //initTouchEvent
        this.initTouchEvent(this.view);
    }
    /**
     * 初始化touchevent
     */
    initTouchEvent(view){
        this.touchEvent=new TouchEvent(view);
        this.touchEvent.handler("mixTouchEvent",()=>{
            if(this.touchEvent.eventType=="touchstart"){
                //选择精灵
                this.touchSprite(this.touchEvent.currentPos);
            }else if(this.touchEvent.eventType=="touchmove"){
                //drag精灵
                this.activeSprite && this.dragActiveSprite(this.activeSprite,this.touchEvent.moveVector);
            }else if(this.touchEvent.eventType=="touchend"){
                //释放精灵
                this.releaseSprite();
            }
        })
        // this.touchEvent.handler("click",()=>{
        //     this.clickSprite(this.touchEvent.currentPos);
        // })
    }
    /**
     * touch精灵
     */
    touchSprite(pos){
        this.spriteList.forEach(item=>{
            if(item.isInPath(this.ctx,pos) && item.allowClick){
                this.activeSprite=item;
            }
        })
        this.activeSprite && this.activeSprite.trigger("touchstart")
        this.render();
    }
    /**
     * click精灵
     */
    // clickSprite(pos){
    //     let clicksprite=null;
    //     this.spriteList.forEach(item=>{
    //         if(item.isInPath(this.ctx,pos) && item.allowClick){
    //             clicksprite=item;
    //         }
    //     })
    //     clicksprite && clicksprite.trigger("click");
    //     this.render();
    // }
    /**
     * drag精灵
     */
    dragActiveSprite(activeSprite,moveVector){
        if(activeSprite.useDrag){
            activeSprite.x+=moveVector[0]
            activeSprite.y+=moveVector[1]
            this.activeSprite.trigger("dragging")
            this.render();
        }
    }
    /**
     * 释放精灵
     */
    releaseSprite(){
        this.activeSprite=null;
    }
    /**
     * 重置尺寸
     * @param {node} container 
     * @param {number} ratio 
     */
    resize(width,height){
        this.width=width;
        this.height=height;
        this.view.width=this.width;
        this.view.height=this.height;
    }
    /**
     * 填充颜色
     * @param {color} color 
     */
    setBackgroundColor(color){
        this.ctx.fillStyle=color;
        this.ctx.fillRect(0,0,this.width,this.height)
    }
    /**
     * 添加图片精灵
     */
    addImageSprite(imagePath,config){
        let imgSprite=new ImageSprite(imagePath,config);
        this.spriteList.push(imgSprite)
        imgSprite.handler("imgLoaded",()=>{
            this.trigger("addSprite");
            this.render();
        })
        return imgSprite;
    }
    /**
     * 添加普通精灵
     */
    addSprite(sprite){
        this.spriteList.push(sprite)
        return sprite;
    }
    /**
     * 移除精灵
     */
    removeSprite(sprite){
        this.spriteList.forEach((item,index)=>{
            if(item==sprite){
                this.spriteList.splice(index,1);
                this.trigger("removeSprite");
                item.trigger("remove")
                this.render();
                sprite=null;
            }
        })
    }
    /**
     * 获取精灵byid
     */
    getSpriteById(id){
        return this.spriteList.filter(item=>{
            if(item.id==id){
                return item
            } 
        })[0]
    }
    /**
     * 获取精灵byname
     */
    getSpriteByName(name){
        return this.spriteList.filter(item=>{
            if(item.name==name){
                return item
            } 
        })
    }
    /**
     * 渲染舞台内容
     */
    render(){
        //清空画布
        this.ctx.clearRect( 0, 0, this.width, this.height);
        //排序
        this.spriteList.sort((a,b)=>{
            return a.zindex-b.zindex;
        })
        //绘制
        this.spriteList.forEach(sprite=>{
            //计算定位
            sprite.calculateRelativePosition();
            //计算旋转
            sprite.calculateRelativeRotate(this.ctx);
            sprite.visible && sprite.draw(this.ctx);
        })
    }
};
export default Stage;
