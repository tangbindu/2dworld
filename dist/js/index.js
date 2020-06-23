import Stage from "./modules/stage.js"
import ImageSprite from "./modules/sprite_image.js";
import RectSprite from "./modules/sprite_rect.js";
import Sprite from "./modules/Sprite.js";

//我要创建一个舞台
let stage=new Stage();
//我要把我的舞台放在页面厘
document.getElementById("stageContainer").appendChild(stage.view)
//设置下舞台大小
stage.resize(1920,1080)
//设置舞台颜色
stage.setBackgroundColor("gray")

//背景图片
let backgroundImage=stage.addImageSprite("../imgs/pattern1.png",{
    width:stage.width,
    height:stage.height,
    zindex:-1,
    repeat:true
})  
// backgroundImage.handler("touchstart",function(){
//     console.log(backgroundImage.name)
// })
//普通图片
let images=[
    "ill1",
    "ill2",
    "ill3",
    "ill4",
    "ill5",
    "ill6",
    "ill7",
    "ill8",
    "ill9",
    "ill10",
    "ill11",
    "pattern2"
]
images.forEach(image=>{
    let imgSprite=stage.addImageSprite("../imgs/illustration/"+image+".png",{
        x:stage.width*Math.random()*.6+200,
        y:stage.height*Math.random()*.6+100,
        useDrag:true,
        zindex:Math.random()*100
    })  
    imgSprite.handler("touchstart",()=>{
        if(imgSprite.name!="control"){
            controlSprite.attach(imgSprite)
        }
    })
    imgSprite.handler("dragging",()=>{
        if(imgSprite.name!="control"){
            controlSprite.attach(imgSprite)
        }
    })
    //test
    // imgSprite.rotate=Math.random()*360* Math.PI / 180;
    // setInterval(()=>{
    //     imgSprite.rotate+=.1;
    //     stage.render()
    // },17)
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
        zindex:100000
    }),
    //控制按钮
    draw_control_btn:stage.addImageSprite("../imgs/draw_control_btn.png",{
        name:"control",
        zindex:100000
    }),
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
            this.draw_delete_btn.parent=null;
            this.draw_control_btn.parent=null;
            this.draw_control_border.parent=null;
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
    }
}
controlSprite.init();


window.stage=stage;
window.controlSprite=controlSprite;
window.sprite1=stage.getSpriteByName("../imgs/illustration/ill1.png")[0];
