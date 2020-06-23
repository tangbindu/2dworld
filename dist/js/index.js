import Stage from "./modules/stage.js"
import ImageSprite from "./modules/sprite_image.js";
import RectSprite from "./modules/sprite_rect.js";
import RoundRectSprite from "./modules/sprite_roundRect.js";
import TextSprite from "./modules/sprite_text.js";

//我要创建一个舞台
let stage=new Stage();
//我要把我的舞台放在页面厘
document.getElementById("stageContainer").appendChild(stage.view)
//设置下舞台大小
stage.resize(1080,1080)
//设置舞台颜色
stage.setBackgroundColor("gray")

//背景图片
let backgroundImage=stage.addImageSprite("../imgs/pattern1.png",{
    width:stage.width,
    height:stage.height,
    zindex:-1,
    repeat:true
})  
backgroundImage.handler("touchstart",()=>{
    controlSprite.unAttach();
    controlSprite.reset();
})
/** 
 * 贴纸
*/
let stickers=[
    "ill3",
    "ill4",
    "ill5",
    "ill6",
    "ill7",
    "ill8",
    "ill9",
    "ill9",
    "ill9",
    "ill10",
    "ill11",
    "ill12",
    "ill13",
    "ill14",
    "ill15",
    "ill16",
    "ill17",
    "ill18",
    "ill19",
]
stickers.forEach(image=>{
    let sprite=stage.addImageSprite("../imgs/sticker/"+image+".png",{
        x:stage.width*Math.random(),
        y:stage.height*Math.random()*.3+100,
        useDrag:true,
        zindex:Math.random()*100
    })  
    sprite.handler("touchstart",()=>{
        if(sprite.name!="control"){
            controlSprite.attach(sprite)
        }
    })
    sprite.handler("imgLoaded",function(){
        sprite.width=sprite.width*.6;
        sprite.height=sprite.height*.6;
    })
})
/** 
 * 角色
*/
let roles=[
    "role1",
    "role2",
    "role3",
    "role4"
]
let rolesName=[
    "Fate-Soul",
    "半俗不雅 ヽ",
    "我忘不掉你！",
    "妹妹，哥哥保护你 哥哥，妹妹守护你"
]
roles.forEach((rolePath,index)=>{
    let role=stage.addImageSprite("../imgs/role/"+rolePath+".png",{
        name:"role",
        x:stage.width*Math.random()*.5+200,
        y:stage.height*Math.random()*.1+stage.height*.5,
        useDrag:true,
        zindex:Math.random()*100
    })  
    role.handler("touchstart",()=>{
        if(role.name!="control"){
            controlSprite.attach(role)
        }
    })
    //动态计算宽度
    stage.ctx.font = 20+'px palatino';
    let bandWidth=stage.ctx.measureText(rolesName[index]).width+40;

    let namebrand=new RoundRectSprite(
        {
            radius:20,
            height:40,
            width:bandWidth,
            relativePosition:[.5,0],
            zindex:100001
        }
    );
    namebrand.parent=role;

    let nametext=new TextSprite(rolesName[index],{
        name:"studentName",
        height:40,
        width:bandWidth,
        textAlign:"start",//left right center
        fontSize:20,
        relativePosition:[.5,0,20,25],
        zindex:100002
    });
    nametext.parent=role;
    role.handler("remove",function(){
        stage.removeSprite(namebrand)
        stage.removeSprite(nametext)
    })
    //名字
    stage.addSprite(namebrand)
    stage.addSprite(nametext)
    //重写点击区
    // role.isInPath=function(ctx,pos) {
    //     ctx.save();
    //     if(this.rotate){
    //         ctx.translate(this._rotationOriginPositon[0], this._rotationOriginPositon[1]);
    //         ctx.rotate(this.rotate);
    //         ctx.translate(-this._rotationOriginPositon[0], -this._rotationOriginPositon[1]);
    //     }
    //     ctx.beginPath();
    //     ctx.rect(
    //         this.x+this.width*.2,
    //         this.y,
    //         this.width*.6,
    //         this.height
    //     );
    //     ctx.closePath();
    //     ctx.restore();
    //     if(ctx.isPointInPath(pos.x, pos.y)){
    //         return true;
    //     }else{
    //         return false
    //     }
    // }
})




//控制层
let controlSprite={
    //按下了touch按钮
    touchDownControlBtn:false,
    //关联sprite
    attachSprite:null,
    //删除按钮
    draw_delete_btn:stage.addImageSprite("../imgs/draw_delete_btn.png",{
        name:"control",
        zindex:100010
    }),
    //控制按钮
    draw_control_btn:stage.addImageSprite("../imgs/draw_control_btn.png",{
        name:"control",
        zindex:100010
    }),
    //矩形框
    draw_control_border:stage.addSprite(new RectSprite({
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
            stage.removeSprite(this.attachSprite);
            this.unAttach();
            this.reset();
        })
        this.draw_control_btn.handler("touchstart",()=>{
            this.touchDownControlBtn=true;
        })
        stage.touchEvent.handler("touchend",()=>{
            this.touchDownControlBtn=false;
        })
        stage.touchEvent.handler("touchmove",()=>{
            if(this.touchDownControlBtn){
                this.draw_control_border.width=this.attachSprite.width;
                this.draw_control_border.height=this.attachSprite.height;
                //开始点 左下方
                let vs={x:-this.attachSprite.width*.5,y:-this.attachSprite.height*.5};
                //移动点
                let ve={
                    x:stage.touchEvent.currentPos.x-(this.attachSprite.x+this.attachSprite.width*.5),
                    y:-stage.touchEvent.currentPos.y-(-this.attachSprite.y-this.attachSprite.height*.5)
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
            stage.render();
            
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
        stage.render();
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
        this.draw_control_btn.relativePosition=[0,1];
        this.draw_delete_btn.relativePosition=[1,0];
        this.draw_control_border.relativePosition=[.5,.5];
        //旋转
        this.draw_control_btn.rotate=this.draw_control_btn.parent.rotate;
        this.draw_delete_btn.rotate=this.draw_delete_btn.parent.rotate;
        this.draw_control_border.rotate=this.draw_control_border.parent.rotate;
        if(sprite.name=="role"){
            this.draw_delete_btn.visible=false
            // this.draw_control_border.visible=false;
        }else{
            this.draw_delete_btn.visible=true
            // this.draw_control_border.visible=true;
        }
    }
}
controlSprite.init();


window.stage=stage;
window.controlSprite=controlSprite;
window.sprite1=stage.getSpriteByName("../imgs/sticker/ill1.png")[0];
