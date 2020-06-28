import tools from "./tools.js";
import Sprite from "./Sprite.js";
// 绘图 
class TextSprite extends Sprite{
    constructor(text,config) {
        super(config);
        this.text=text;
        this.config=config || {};
        this.textAlign=this.config.textAlign || "center"//left right center
        this.textBaseline=this.config.textBaseline || "alphabetic" //top,middle,bottom
        this.strokeStyle=this.config.strokeStyle || "#ffffff"
        this.strokeWidth=this.config.strokeWidth || 2
        this.fontSize=this.config.fontSize || 24
        this.fillStyle=this.config.fillStyle || "#ffffff"
        this.init();
    }
    //初始化
    init(){
       //计算文本宽度和高度
    }
    //绘制图形精灵
    draw(ctx) {
        ctx.save();
        if(this.rotate){
            ctx.translate(this._rotationOriginPositon[0], this._rotationOriginPositon[1]);
            ctx.rotate(this.rotate);
            ctx.translate(-this._rotationOriginPositon[0], -this._rotationOriginPositon[1]);
        }
        ctx.textAlign = this.textAlign;
        ctx.textBaseline = this.textBaseline;
        ctx.strokeStyle =  this.strokeStyle;
        ctx.strokeWidth= this.strokeWidth;
        ctx.font = this.fontSize+'px PingFangSC-Regular';
        ctx.fillStyle = this.fillStyle;  
        this.strokeWidth && ctx.strokeText(this.text, this.x, this.y);    
        ctx.fillText(this.text, this.x, this.y);         
        ctx.restore();
    }
    //点击
    isInPath(ctx,pos) {
        ctx.save();
        if(this.rotate){
            ctx.translate(this._rotationOriginPositon[0], this._rotationOriginPositon[1]);
            ctx.rotate(this.rotate);
            ctx.translate(-this._rotationOriginPositon[0], -this._rotationOriginPositon[1]);
        }
        ctx.beginPath();
        ctx.rect(
            this.x,
            this.y,
            this.width*this.scale,
            this.height*this.scale
        );
        ctx.closePath();
        ctx.restore();
        if(ctx.isPointInPath(pos.x, pos.y)){
            return true;
        }else{
            return false
        }
    }
}

export default TextSprite;