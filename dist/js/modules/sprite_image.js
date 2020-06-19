import tools from "./tools.js";
import Sprite from "./Sprite.js";
// 绘图 
class ImageSprite extends Sprite{
    constructor(imagePath,config) {
        super(config);
        this.imagePath=imagePath || "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
        this.config=config || {};
        this.img=null;
        this.name = this.config.name || imagePath || "";
        this.repeat=this.config.repeat || false;
        this.init();
    }
    //初始化
    init(){
        let img=new Image();
        img.onload=()=>{
            this.img=img;
            this.width=this.config.width || img.width;
            this.height=this.config.height || img.height;
            this.trigger("imgLoaded");
        }
        img.src=this.imagePath;
    }
    //绘制图形精灵
    draw(ctx) {
        if(!this.img){
            return;
        }
        //是否重复填充背景
        if(this.repeat){
            //模型
            let pattern = ctx.createPattern(this.img, "repeat");
            ctx.fillStyle=pattern;
            ctx.fillRect(this.x,this.y,this.width,this.height);
        }else{
            //普通绘制
            ctx.drawImage(
                this.img,
                this.x,
                this.y,
                this.width*this.scale,
                this.height*this.scale
            );
        }
    }
    //点击
    isInPath(ctx,pos) {
        ctx.beginPath();
        ctx.rect(
            this.x,
            this.y,
            this.width*this.scale,
            this.height*this.scale
        );
        ctx.closePath();
        if(ctx.isPointInPath(pos.x, pos.y)){
            return true;
        }else{
            return false
        }
    }
}

export default ImageSprite;