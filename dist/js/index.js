import Stage from "./modules/stage.js"

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
backgroundImage.handler("touchstart",function(){
    console.log(backgroundImage.name)
})
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
})

//控制层
let controlSprite={
    attachSprite:null,
    //删除按钮
    draw_delete_btn:stage.addImageSprite("../imgs/draw_delete_btn.png",{
        name:"control",
        zindex:100000
    }),
    //控制按钮
    draw_control_btn:stage.addImageSprite("../imgs/draw_control_btn.png",{
        name:"control",
        useDrag:true,
        zindex:100000
    }),
    //初始化
    init(){
        this.draw_delete_btn.handler("touchstart",()=>{
            console.log(this.draw_delete_btn.name)
            stage.removeSprite(this.attachSprite);
            this.reset();
        })
        this.draw_control_btn.handler("touchstart",()=>{
            console.log(this.draw_control_btn.name)
        })   
        this.reset();
    },
    reset(){
        this.draw_delete_btn.x=-100;
        this.draw_delete_btn.y=-100;
        this.draw_control_btn.x=-100;
        this.draw_control_btn.y=-100;
        stage.render();
    },
    //nie
    attach(sprite){
        this.attachSprite=sprite;
        let rtPoint={
            x: sprite.x+sprite.width-this.draw_delete_btn.width*.5,
            y: sprite.y-this.draw_delete_btn.height*.5
        }
        let lbPoint={
            x: sprite.x-this.draw_control_btn.width*.5,
            y: sprite.y+sprite.height-this.draw_control_btn.height*.5
        }
        //移动到左下方
        this.draw_control_btn.moveTo(lbPoint)
        //移动到右上方
        this.draw_delete_btn.moveTo(rtPoint)
    }
}
controlSprite.init();


window.stage=stage;
window.controlSprite=controlSprite;


