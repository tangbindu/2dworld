import Stage from "./modules/stage.js"
import ImageSprite from "./modules/sprite_image.js";
import RectSprite from "./modules/sprite_rect.js";
import RoundRectSprite from "./modules/sprite_roundRect.js";
import TextSprite from "./modules/sprite_text.js";
//骨骼动画
import SpinePlus from "./modules/spinePlus.js";
import mock from "./mock.js"

//我要创建一个舞台
let stage=new Stage();
//我要把我的舞台放在页面厘
document.getElementById("stageContainer").appendChild(stage.view)
//设置下舞台大小
stage.resize(
    mock.photoTemplate.width,
    mock.photoTemplate.height
)
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
    // "ill3",
    // "ill4",
    // "ill5",
    // "ill6",
    // "ill7",
    // "ill8",
    // "ill9",
    // "ill9",
    // "ill9",
    // "ill10",
    // "ill11",
    // "ill12",
    // "ill13",
    // "ill14",
    // "ill15",
    // "ill16",
    // "ill17",
    // "ill18",
    // "ill27",
]
stickers.forEach(image=>{
    let sprite=stage.addImageSprite("../imgs/sticker/"+image+".png",{
        name:'sticker',
        x:stage.width*Math.random(),
        y:stage.height*.1*Math.random(),
        useDrag:true,
        zindex:Math.random()*100,
        zindex:10000
    })  
    sprite.handler("touchstart",()=>{
        if(sprite.name!="control"){
            controlSprite.attach(sprite)
            sprite.zindex=stage.getSpriteByName("sticker").sort((a,b)=>{return b.zindex-a.zindex})[0].zindex+1;
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
    "role8",
    "role2",
    "role6",
    "role3",
    "role4",
    "role5",
    "role7",
]
let rolesName=[
    "Fate-Soul",
    "半俗不雅 ヽ",
    "我忘不掉你！",
    "妹妹，哥哥保护你 哥哥，妹妹守护你"
];
roles.forEach((rolePath,index)=>{
    //角色
    let role=stage.addImageSprite("../imgs/role/"+rolePath+".png",{
        name:"role",
        x:stage.width/roles.length*index,
        y:stage.height-500,
        useDrag:true,
        zindex:500
    })  
    role.handler("touchstart",()=>{
        controlSprite.attach(role)
        //设置层级
        role.zindex=stage.getSpriteByName("role").sort((a,b)=>{return b.zindex-a.zindex})[0].zindex+1;
    })
    //铭牌
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
    stage.addSprite(namebrand)
    stage.addSprite(nametext)
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
                let vs={x:this.attachSprite.width*.5,y:-this.attachSprite.height*.5};
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

window.stage=stage;
window.controlSprite=controlSprite;






function Role(param){
    this.param = param || {};
    !this.param.png && console.log("缺少必要的角色png图片资源");
    !this.param.atlas && console.log("缺少必要的角色atlas材质地图资源")
    !this.param.json && console.log("缺少必要的角色json骨骼信息资源");
    !this.param.canvas && console.log("缺少承载骨骼动画的容器canvas");
    //角色信息
    this.roleSpinePlus=null;
    /**
     * 初始化角色对象
     * @return {null} 无返回
     */
    this.init=(function(){
      this.roleSpinePlus=new SpinePlus(
        this.param.canvas,
        {
          png:this.param.png,
          json:this.param.json,
          atlas:this.param.atlas,
          scale:this.param.scale || 1,
          debugRendering:false,
          usewebgl:this.param.usewebgl || false
        }
      );
    }).call(this);
  };
  Role.prototype ={
    /**
     * 添加蒙皮
     */
    dress:function(dressParam){
      var role=this;
      !dressParam.png && console.log("缺少必要的蒙皮png图片");
      !dressParam.atlas && console.log("缺少必要的蒙皮atlas材质地图")
      !dressParam.json && console.log("缺少必要的蒙皮json骨骼");
      this.roleSpinePlus._assetManager.loadText(dressParam.json);
      this.roleSpinePlus._assetManager.loadText(dressParam.atlas);
      this.roleSpinePlus._assetManager.loadTexture(dressParam.png);
      //等待资源加载完毕
      this.roleSpinePlus.loadComplete(function(){ 
        //混合插槽(把数据合并到role上进行，才能执行附件的初始化)
        function mixAttachmentsData(roleSkeletonStr,dressDataStr){
          var dressJson=JSON.parse(dressDataStr);
          var rolejson=JSON.parse(roleSkeletonStr);
          for(var j in dressJson.attachments){
            rolejson.skins["default"][j]=dressJson.attachments[j];
          }
          return JSON.stringify(rolejson)
        };
        //混合插槽（把插槽的附件数据附加在role上）
        function mixSkinToRole(roleSkin,dressSkin){
          for(var i=0;i<dressSkin.attachments.length;i++){
            if(dressSkin.attachments[i]){
              roleSkin.attachments[i]=dressSkin.attachments[i]
            }
          }
        };
        //
        var dress_atlas=this.getAtlas(dressParam.atlas);
        var dress_atlasLoader=new this.TextureAtlasAttachmentLoader(dress_atlas);
        var dress_skeletonJson=new this.SkeletonJson(dress_atlasLoader);
        dress_skeletonJson.scale=role.param.scale;
        var role_skeletonJsonData=this._assetManager.get(role.param.json);
        var dress_skeletonJsonData=this._assetManager.get(dressParam.json);
        //console.dir(role_skeletonJsonData)
        //console.dir(dress_skeletonJsonData)
        //合并附件attachments
        var role_skeletonJsonData=mixAttachmentsData(role_skeletonJsonData,dress_skeletonJsonData);
        var dress_skeletonData=dress_skeletonJson.readSkeletonData(role_skeletonJsonData);
        mixSkinToRole(this._skeletonData.findSkin("default"),dress_skeletonData.findSkin("default"));
        //this.skin=null;
        this._skeleton.skin=null;
        this._skeleton.setSkinByName("default");
        //暂时放在此处渲染
        try{
          this._skeleton.setAttachment("Eyes","Eye_Basicclose_00");
          this._skeleton.setAttachment("Mouth","Mouth_basic_00");
        }catch(e){}
        //渲染
        this.render(this._skeleton,{
          x:this._canvas.width/2,
          y:this._canvas.height/10
        })
      })
    },
    //添加动作
    action:function(actionParam){
      var role=this;
      !actionParam.png && console.log("缺少必要的蒙皮png图片");
      !actionParam.atlas && console.log("缺少必要的蒙皮atlas材质地图")
      !actionParam.json && console.log("缺少必要的蒙皮json骨骼");
      this.roleSpinePlus._assetManager.loadText(actionParam.json);
      this.roleSpinePlus._assetManager.loadText(actionParam.atlas);
      this.roleSpinePlus._assetManager.loadTexture(actionParam.png);
      //等待资源加载完毕
      this.roleSpinePlus.loadComplete(function(){
        var action_atlas=this.getAtlas(actionParam.atlas);
        var action_atlasLoader=new this.TextureAtlasAttachmentLoader(action_atlas);
        var action_skeletonJson=new this.SkeletonJson(action_atlasLoader);
        action_skeletonJson.scale=role.param.scale;
        //拿到json的文本数据
        var role_skeletonJsonData=this._assetManager.get(role.param.json);
        var action_skeletonJsonData=this._assetManager.get(actionParam.json);
        function mixActionData(roleJson,actionJson){  
          var roleJson=JSON.parse(roleJson);
          var actionJson=JSON.parse(actionJson);
          roleJson.animations=actionJson.animations;
          return JSON.stringify(roleJson)
        }
        //混合actionData
        var role_skeletonJsonData=mixActionData(role_skeletonJsonData,action_skeletonJsonData);
        var action_skeletonData=action_skeletonJson.readSkeletonData(role_skeletonJsonData);
        //把animation数据合并入role中
        this._skeleton.data.animations=action_skeletonData.animations;
        this._animationStateData=new this.AnimationStateData(this._skeleton.data);
        this._animationState = new this.AnimationState(this._animationStateData);
        this._animationState.setAnimation(0, "_sender_0", false);
        this.renderAnimation(this._skeleton,{
          x:this._canvas.width*Math.random(),
          y:350*Math.random()
        })
      })
    },
    /*
     *添加穿扮
     */
    addDress:function(param){
      this.dress(param)
    },
    /**
     *添加动作(加载道具)
     */
    addAction:function(param){
      this.action(param)
    },
    /**
     *渲染
     */
    render:function(canvas){
    }
  };
  
  
  
  
  //lmrole
  var offsetScreen=document.createElement("canvas");
  offsetScreen.width=800;
  offsetScreen.height=800;
  document.getElementById("stageContainer").appendChild(offsetScreen);
  var lmrole=new Role({
    png:"../imgs/spine/_skeleton/role.png",
    json:"../imgs/spine/_skeleton/role.json",
    atlas:"../imgs/spine/_skeleton/role.atlas",
    canvas:offsetScreen,
    usewebgl:false,
    scale:1
  })
  lmrole.roleSpinePlus.handler("ready",function(){
    lmrole.addDress({
      png:"../imgs/spine/roles/fmz/TopSuit/dress.png",
      json:"../imgs/spine/roles/fmz/TopSuit/dress.json",
      atlas:"../imgs/spine/roles/fmz/TopSuit/dress.atlas"
    }); 
    lmrole.addDress({
      png:"../imgs/spine/roles/fmz/BottomSuit/dress.png",
      json:"../imgs/spine/roles/fmz/BottomSuit/dress.json",
      atlas:"../imgs/spine/roles/fmz/BottomSuit/dress.atlas"
    });
    lmrole.addDress({
      png:"../imgs/spine/roles/fmz/FaceSuit/dress.png",
      json:"../imgs/spine/roles/fmz/FaceSuit/dress.json",
      atlas:"../imgs/spine/roles/fmz/FaceSuit/dress.atlas"
    });
    lmrole.addDress({
      png:"../imgs/spine/roles/fmz/HairType/dress.png",
      json:"../imgs/spine/roles/fmz/HairType/dress.json",
      atlas:"../imgs/spine/roles/fmz/HairType/dress.atlas"
    });
    lmrole.addAction({
      png:"../imgs/spine/_action/action.png",
      json:"../imgs/spine/_action/action.json",
      atlas:"../imgs/spine/_action/action.atlas"
    });
  });






















