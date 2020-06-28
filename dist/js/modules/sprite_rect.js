import tools from "./tools.js";
import Sprite from "./Sprite.js";
// 绘图 
class RectSprite extends Sprite{
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
        ctx.strokeStyle = '#6346ff';
        // ctx.fillStyle = 'rgba(0,233,0,.1)';
        ctx.shadowBlur=3;
        ctx.shadowColor="#000000";
        // ctx.setLineDash([10, 10])
        // ctx.fillRect(this.x,this.y,this.width,this.height);
        ctx.strokeRect(this.x,this.y,this.width,this.height);
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
            this.width,
            this.height
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

export default RectSprite;