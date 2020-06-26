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
var lmrole=new Role({
  png:"../../img/spine/_skeleton/role.png",
  json:"../../img/spine/_skeleton/role.json",
  atlas:"../../img/spine/_skeleton/role.atlas",
  canvas:$("#canvas1")[0],
  usewebgl:false,
  scale:1
})
lmrole.roleSpinePlus.handler("ready",function(){
  lmrole.addDress({
    png:"../../img/spine/roles/fmz/TopSuit/dress.png",
    json:"../../img/spine/roles/fmz/TopSuit/dress.json",
    atlas:"../../img/spine/roles/fmz/TopSuit/dress.atlas"
  }); 
  lmrole.addDress({
    png:"../../img/spine/roles/fmz/BottomSuit/dress.png",
    json:"../../img/spine/roles/fmz/BottomSuit/dress.json",
    atlas:"../../img/spine/roles/fmz/BottomSuit/dress.atlas"
  });
  lmrole.addDress({
    png:"../../img/spine/roles/fmz/FaceSuit/dress.png",
    json:"../../img/spine/roles/fmz/FaceSuit/dress.json",
    atlas:"../../img/spine/roles/fmz/FaceSuit/dress.atlas"
  });
  lmrole.addDress({
    png:"../../img/spine/roles/fmz/HairType/dress.png",
    json:"../../img/spine/roles/fmz/HairType/dress.json",
    atlas:"../../img/spine/roles/fmz/HairType/dress.atlas"
  });
  lmrole.addAction({
    png:"../../img/spine/_action/action.png",
    json:"../../img/spine/_action/action.json",
    atlas:"../../img/spine/_action/action.atlas"
  });
});


setTimeout(function(){
  let testimg=document.createElement("img");
  testimg.setAttribute("src",lmrole.roleSpinePlus._canvas.toDataURL());
  document.body.appendChild(testimg)
},1000)













