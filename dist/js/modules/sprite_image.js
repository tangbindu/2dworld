import tools from "./tools.js";
import Sprite from "./Sprite.js";
// 绘图 
class Image extends Sprite{
    constructor(pos) {
        super(pos);
        this.img=null;
    }
    //更新点
    updatePoints(pos) {
    }
    //绘制图形精灵
    draw(ctx) {
        ctx.save();
        // if(this.active){
        //     ctx.globalAlpha = 0.9;
        // }
        ctx.drawImage(
            this.img,
            (this.x+this.translate.x)*this.scale,
            (this.y+this.translate.y)*this.scale,
            this.width*this.scale,
            this.height*this.scale
        );
        // if(this.active){
        //     ctx.globalAlpha = 1.0;
        // }
        ctx.restore();
    }
    //判断点击
    isInPath(ctx,pos) {
        ctx.beginPath();
        ctx.rect(
            (this.x+this.translate.x)*this.scale,
            (this.y+this.translate.y)*this.scale,
            this.width*this.scale,
            this.height*this.scale
        );
        ctx.closePath();
        if(ctx.isPointInPath(pos.x, pos.y)){
            return true;
        }
    }
}

export {Image};