import Stage from "./stage.js"
import ImageSprite from "./sprite_image.js";
import RectSprite from "./sprite_rect.js";
import RoundRectSprite from "./sprite_roundRect.js";
import TextSprite from "./sprite_text.js";
let backgroundImage;
// 绘图 
let photo={
    stage:new Stage(),
    /**
     * 添加贴纸
     */
    addSticker(stickerData){
        let sprite=this.stage.addImageSprite(stickerData,{
            name:'sticker',
            x:this.stage.width*Math.random(),
            y:this.stage.height*.1*Math.random(),
            useDrag:true,
            zindex:Math.random()*100,
            zindex:10000
        })  
        sprite.handler("touchstart",()=>{
            if(sprite.name!="control"){
                controlSprite.attach(sprite)
                sprite.zindex=this.stage.getSpriteByName("sticker").sort((a,b)=>{return b.zindex-a.zindex})[0].zindex+1;
            }
        })
        sprite.handler("imgLoaded",function(){
            sprite.width=sprite.width*.6;
            sprite.height=sprite.height*.6;
        })
    },
    /**
     * 添加角色精灵图片
     */
    addRoleSprite(imgData,roleName,x,y){
        //角色
        let role=this.stage.addImageSprite(imgData,{
            name:"role",
            x:x,
            y:y,
            useDrag:true,
            zindex:500
        })  
        role.handler("touchstart",()=>{
        controlSprite.attach(role)
        //设置层级
        role.zindex=this.stage.getSpriteByName("role").sort((a,b)=>{return b.zindex-a.zindex})[0].zindex+1;
        })
        //铭牌
        this.stage.ctx.font = 18+'px PingFangSC-Regular';
        let bandWidth=this.stage.ctx.measureText(roleName).width+40;
        let namebrand=new RoundRectSprite(
            {
                radius:18,
                height:36,
                width:bandWidth,
                relativePosition:[.5,0],
                zindex:100001
            }
        );
        namebrand.parent=role;
        let nametext=new TextSprite(roleName,{
            name:"studentName",
            height:40,
            width:bandWidth,
            textAlign:"start",//left right center
            fontSize:18,
            relativePosition:[.5,0,20,27],
            zindex:100002
        });
        nametext.parent=role;
        role.handler("remove",function(){
            this.stage.removeSprite(namebrand)
            this.stage.removeSprite(nametext)
        })
        this.stage.addSprite(namebrand)
        this.stage.addSprite(nametext)
        //重写点击区
        role.isInPath=function(ctx,pos) {
            ctx.save();
            if(this.rotate){
                ctx.translate(this._rotationOriginPositon[0], this._rotationOriginPositon[1]);
                ctx.rotate(this.rotate);
                ctx.translate(-this._rotationOriginPositon[0], -this._rotationOriginPositon[1]);
            }
            ctx.beginPath();
            ctx.rect(
                this.x+(this.width-200)/2,
                this.y,
                200,
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
    },
    resize(width,height){
        this.stage.resize(width,height);
        backgroundImage && backgroundImage.handler("imgLoaded",()=>{
            backgroundImage.width=width;
            backgroundImage.height=height;
        })
    }
}

//控制层
let controlSprite={
    //按下了touch按钮
    touchDownControlBtn:false,
    //关联sprite
    attachSprite:null,
    //删除按钮
    draw_delete_btn:photo.stage.addImageSprite("../imgs/draw_delete_btn.png",{
        name:"control",
        zindex:100010
    }),
    //控制按钮
    draw_control_btn:photo.stage.addImageSprite("../imgs/draw_control_btn.png",{
        name:"control",
        zindex:100010
    }),
    //矩形框
    draw_control_border:photo.stage.addSprite(new RectSprite({
        name:"border",
        allowClick:false,
        zindex:99999
    })),
    //旋转
    rotateShape(vs,ve){
        //点积
        function getDot(v1,v2){
            return v1.x*v2.x+v1.y*v2.y;
        }
        function thanPi(v1,v2){
            return (v1.x * v2.y - v2.x* v1.y)>0;
        }
        function getLength(v){
            return Math.sqrt(v.x*v.x+v.y*v.y)
        }
        //旋转角的cos值
        var cosVal=getDot(vs,ve)/(getLength(vs)*getLength(ve));
        //旋转角
        var angle=Math.acos(cosVal)*180/Math.PI;
        if(thanPi(vs,ve)){
            angle=360-angle;
        }
        return angle;
    },
    //初始化
    init(){
        this.draw_delete_btn.handler("touchstart",()=>{
            photo.stage.removeSprite(this.attachSprite);
            this.unAttach();
            this.reset();
        })
        this.draw_control_btn.handler("touchstart",()=>{
            this.touchDownControlBtn=true;
        })
        photo.stage.touchEvent.handler("touchend",()=>{
            this.touchDownControlBtn=false;
        })
        photo.stage.touchEvent.handler("touchmove",()=>{
            if(this.touchDownControlBtn){
                this.draw_control_border.width=this.attachSprite.width;
                this.draw_control_border.height=this.attachSprite.height;
                //开始点 左下方
                let vs={x:this.attachSprite.width*.5,y:-this.attachSprite.height*.5};
                //移动点
                let ve={
                    x:photo.stage.touchEvent.currentPos.x-(this.attachSprite.x+this.attachSprite.width*.5),
                    y:-photo.stage.touchEvent.currentPos.y-(-this.attachSprite.y-this.attachSprite.height*.5)
                }
                //更新spite尺寸
                let imgRatio=this.attachSprite.height/this.attachSprite.width;
                let w=Math.cos(Math.atan(imgRatio))*Math.sqrt(ve.x*ve.x+ve.y*ve.y)*2;
                let h=w*imgRatio;
                this.attachSprite.x=this.attachSprite.x-(w-this.attachSprite.width)*.5;
                this.attachSprite.y=this.attachSprite.y-(h-this.attachSprite.height)*.5;
                this.attachSprite.width=w;
                this.attachSprite.height=h;
                //旋转
                this.attachSprite.rotate=this.rotateShape(vs,ve)/180*Math.PI;
            }
            photo.stage.render();
            
        }) 
        this.reset();
    },
    unAttach(){
        this.draw_delete_btn.parent=null;
        this.draw_control_btn.parent=null;
        this.draw_control_border.parent=null;
    },
    reset(){
        this.draw_delete_btn.x=-1000;
        this.draw_delete_btn.y=-1000;
        this.draw_control_btn.x=-1000;
        this.draw_control_btn.y=-1000;
        this.draw_control_border.x=-1000;
        this.draw_control_border.y=-1000;
        photo.stage.render();
    },
    //附着到sprite
    attach(sprite){
        this.attachSprite=sprite;
        //父级
        this.draw_control_btn.parent=sprite;
        this.draw_delete_btn.parent=sprite;
        this.draw_control_border.parent=sprite;
        //border特殊绘制
        this.draw_control_border.width=sprite.width;
        this.draw_control_border.height=sprite.height;
        //位置
        this.draw_control_btn.relativePosition=[1,1];
        this.draw_delete_btn.relativePosition=[0,0];
        this.draw_control_border.relativePosition=[.5,.5];
        //旋转
        this.draw_control_btn.rotate=this.draw_control_btn.parent.rotate;
        this.draw_delete_btn.rotate=this.draw_delete_btn.parent.rotate;
        this.draw_control_border.rotate=this.draw_control_border.parent.rotate;
        if(sprite.name=="role"){
            // this.draw_delete_btn.visible=false
            // this.draw_control_border.visible=false;
        }else{
            // this.draw_delete_btn.visible=true
            // this.draw_control_border.visible=true;
        }
    }
}
controlSprite.init();
//共有交互逻辑
/**
 * 取消操作标识
*/
backgroundImage=photo.stage.addImageSprite("../imgs/opacity.png",{
    name:"opacity",
    zindex:-1,
    repeat:true
})
backgroundImage.handler("touchstart",()=>{
    controlSprite.unAttach();
    controlSprite.reset();
})

export default photo;