import tools from "./tools.js";
//依赖的动画
import SpinePlus from "./spinePlus.js";
//角色封装
function Role(param) {
    this.param = param || {};
    !this.param.png && console.log("缺少必要的角色png图片资源");
    !this.param.atlas && console.log("缺少必要的角色atlas材质地图资源")
    !this.param.json && console.log("缺少必要的角色json骨骼信息资源");
    !this.param.canvas && console.log("缺少承载骨骼动画的容器canvas");
    //角色信息
    this.roleSpinePlus = null;
    /**
     * 初始化角色对象
     * @return {null} 无返回
     */
    this.init = (function () {
        this.roleSpinePlus = new SpinePlus(
            this.param.canvas,
            {
                png: this.param.png,
                json: this.param.json,
                atlas: this.param.atlas,
                scale: this.param.scale || 1,
                debugRendering: false,
                usewebgl: this.param.usewebgl || false
            }
        );
    }).call(this);
};
Role.prototype = {
    /**
     * 添加蒙皮
     */
    dress: function (dressParam) {
        var role = this;
        !dressParam.png && console.log("缺少必要的蒙皮png图片");
        !dressParam.atlas && console.log("缺少必要的蒙皮atlas材质地图")
        !dressParam.json && console.log("缺少必要的蒙皮json骨骼");
        this.roleSpinePlus._assetManager.loadText(dressParam.json);
        this.roleSpinePlus._assetManager.loadText(dressParam.atlas);
        this.roleSpinePlus._assetManager.loadTexture(dressParam.png);
        //等待资源加载完毕
        this.roleSpinePlus.loadComplete(function () {
            //混合插槽(把数据合并到role上进行，才能执行附件的初始化)
            function mixAttachmentsData(roleSkeletonStr, dressDataStr) {
                var dressJson = JSON.parse(dressDataStr);
                var rolejson = JSON.parse(roleSkeletonStr);
                for (var j in dressJson.attachments) {
                    rolejson.skins["default"][j] = dressJson.attachments[j];
                }
                return JSON.stringify(rolejson)
            };
            //混合插槽（把插槽的附件数据附加在role上）
            function mixSkinToRole(roleSkin, dressSkin) {
                for (var i = 0; i < dressSkin.attachments.length; i++) {
                    if (dressSkin.attachments[i]) {
                        roleSkin.attachments[i] = dressSkin.attachments[i]
                    }
                }
            };
            //
            var dress_atlas = this.getAtlas(dressParam.atlas);
            var dress_atlasLoader = new this.TextureAtlasAttachmentLoader(dress_atlas);
            var dress_skeletonJson = new this.SkeletonJson(dress_atlasLoader);
            dress_skeletonJson.scale = role.param.scale;
            var role_skeletonJsonData = this._assetManager.get(role.param.json);
            var dress_skeletonJsonData = this._assetManager.get(dressParam.json);
            //console.dir(role_skeletonJsonData)
            //console.dir(dress_skeletonJsonData)
            //合并附件attachments
            var role_skeletonJsonData = mixAttachmentsData(role_skeletonJsonData, dress_skeletonJsonData);
            var dress_skeletonData = dress_skeletonJson.readSkeletonData(role_skeletonJsonData);
            mixSkinToRole(this._skeletonData.findSkin("default"), dress_skeletonData.findSkin("default"));
            //this.skin=null;
            this._skeleton.skin = null;
            this._skeleton.setSkinByName("default");
            //暂时放在此处渲染
            try {
                this._skeleton.setAttachment("Eyes", "Eye_Basicclose_00");
                this._skeleton.setAttachment("Mouth", "Mouth_basic_00");
            } catch (e) { }
            //渲染
            this.render(this._skeleton, {
                x: this._canvas.width/2,
                y: 0
            })
        })
    },
    //添加动作
    action: function (actionParam) {
        var role = this;
        !actionParam.png && console.log("缺少必要的蒙皮png图片");
        !actionParam.atlas && console.log("缺少必要的蒙皮atlas材质地图")
        !actionParam.json && console.log("缺少必要的蒙皮json骨骼");
        this.roleSpinePlus._assetManager.loadText(actionParam.json);
        this.roleSpinePlus._assetManager.loadText(actionParam.atlas);
        this.roleSpinePlus._assetManager.loadTexture(actionParam.png);
        //等待资源加载完毕
        this.roleSpinePlus.loadComplete(function () {
            var action_atlas = this.getAtlas(actionParam.atlas);
            var action_atlasLoader = new this.TextureAtlasAttachmentLoader(action_atlas);
            var action_skeletonJson = new this.SkeletonJson(action_atlasLoader);
            action_skeletonJson.scale = role.param.scale;
            //拿到json的文本数据
            var role_skeletonJsonData = this._assetManager.get(role.param.json);
            var action_skeletonJsonData = this._assetManager.get(actionParam.json);
            function mixActionData(roleJson, actionJson) {
                var roleJson = JSON.parse(roleJson);
                var actionJson = JSON.parse(actionJson);
                roleJson.animations = actionJson.animations;
                return JSON.stringify(roleJson)
            }
            //混合actionData
            var role_skeletonJsonData = mixActionData(role_skeletonJsonData, action_skeletonJsonData);
            var action_skeletonData = action_skeletonJson.readSkeletonData(role_skeletonJsonData);
            //把animation数据合并入role中
            this._skeleton.data.animations = action_skeletonData.animations;
            this._animationStateData = new this.AnimationStateData(this._skeleton.data);
            this._animationState = new this.AnimationState(this._animationStateData);
            this._animationState.setAnimation(0, "_sender_0", false);
            this.renderAnimation(this._skeleton, {
                x: this._canvas.width/2,
                y: 0
            })
        })
    },
    /*
      *添加穿扮
      */
    addDress: function (param) {
        this.dress(param)
    },
    /**
     *添加动作(加载道具)
      */
    addAction: function (param) {
        this.action(param)
    },
    /**
     *渲染
      */
    render: function (canvas) {
    }
};


let lmrole = {
    //其他
    offsetScreen:document.createElement("canvas"),
    role:null,
    //初始化
    init(){
        this.offsetScreen.width=1200;
        this.offsetScreen.height=400;
        //角色
        this.role=new Role({
            png:"../imgs/spine/_skeleton/role.png",
            json:"../imgs/spine/_skeleton/role.json",
            atlas:"../imgs/spine/_skeleton/role.atlas",
            canvas:this.offsetScreen,
            usewebgl:false,
            scale:1
        })
        //监听role基础骨架加载完毕
        this.role.roleSpinePlus.handler("ready",function(){
            console.log("role加载完毕")
        })
    },
    /**
     * 加载一套装扮
     * @param {number} id
     */
    loadDress(id){
        // let zipPath=http://i.gtimg.cn/qqshow/admindata/comdata/vipApollo_item_${装扮id}/d.zip
        let atlas=`../imgs/spine/roles/data/${id}/dress.atlas`
        let json=`../imgs/spine/roles/data/${id}/dress.json`
        let png=`../imgs/spine/roles/data/${id}/dress.png`
        this.role.addDress({
            png:png,
            json:json,
            atlas:atlas
        });
    },
    /**
     * 加载一套动作
     * @param {number} id
     */
    loadAction(id){
        // let zipPath=http://i.gtimg.cn/qqshow/admindata/comdata/vipApollo_item_${装扮id}/d.zip
        let atlas=`../imgs/spine/_action/action.atlas`
        let json=`../imgs/spine/_action/action.json`
        let png=`../imgs/spine/_action/action.png`
        this.role.addAction({
            png:png,
            json:json,
            atlas:atlas
        });
    },
    addRole(dressids){
        return new Promise((resolve, reject)=>{
            dressids.forEach(id => {
                this.loadDress(id)
                this.loadAction(id)
            });
            setTimeout(()=>{
                resolve(
                    tools.imgTirm(
                        this.offsetScreen,
                        this.offsetScreen.getContext("2d")
                    )
                )
            },1630)
        })
    }
    
}
lmrole.init();
export default lmrole;


