
import Stage from "./modules/stage.js"




//我要创建一个舞台
let stage=new Stage();
//我要把我的舞台放在页面厘
let stageContainer=document.getElementById("stageContainer");
    stageContainer.appendChild(stage.view)
//设置下舞台大小
stage.resize(1920,1080)
//设置舞台颜色
stage.setBackgroundColor("gray")


//添加一张图片精灵
let backgroundImage=stage.addImageSprite("../imgs/pattern1.png",{
    name:"../imgs/pattern1.png",
    x:0,
    y:0,
    width:stage.width,
    height:stage.height,
    zindex:-1,
    repeat:true,
    useDrag:false
})  

//再添加一张背景图
let backgroundImage2=stage.addImageSprite("../imgs/pattern2.png",{
    name:"../imgs/pattern2.png",
    x:100,
    y:100,
    width:stage.width*.5,
    height:stage.height*.5,
    zindex:0,
    repeat:true
})  
// useDrag
//移除精灵
// stage.removeSprite(backgroundImage2);


//添加一个事件
backgroundImage.handler("mousedown",function(){
    console.log(this.name)
})
backgroundImage2.handler("mousedown",function(){
    console.log(this.name)
})




//图片精灵加载相关
stage.handler("addSprite",()=>{
})
//删除精灵
stage.handler("removeSprite",()=>{
})
window.stage=stage;













// let img=new Image();
// img.onload=()=>{
//     stage.ctx.drawImage(img,0,0,100,100);
// }
// img.src="../imgs/img1.png";
