import tools from "./tools.js";
import Sprite from "./Sprite.js";
// 绘图 
class ImageSprite extends Sprite{
    constructor(config) {
        super(config);
        this.config=config || {};
    }
    //绘制图形精灵
    draw(ctx) {
        ctx.save();
        if(this.rotate){
            ctx.translate(this._rotationOriginPositon[0], this._rotationOriginPositon[1]);
            ctx.rotate(this.rotate);
            ctx.translate(-this._rotationOriginPositon[0], -this._rotationOriginPositon[1]);
        }
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#fff';
        ctx.shadowBlur=2;
        ctx.shadowColor="black";
        ctx.setLineDash([10, 10])
        ctx.strokeRect(this.x,this.y,this.width*this.scale,this.height*this.scale);
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

export default ImageSprite;