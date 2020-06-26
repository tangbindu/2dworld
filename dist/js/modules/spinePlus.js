window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame   || 
    window.webkitRequestAnimationFrame || 
    window.mozRequestAnimationFrame    || 
    window.oRequestAnimationFrame      || 
    window.msRequestAnimationFrame     || 
    function(callback, element){
        return window.setTimeout(callback, 1000 / 30);
    };
})();
window.cancelRequestAnimFrame = ( function() {
  return window.cancelAnimationFrame             ||
    window.webkitCancelRequestAnimationFrame   ||
    window.mozCancelRequestAnimationFrame      ||
    window.oCancelRequestAnimationFrame        ||
    window.msCancelRequestAnimationFrame       ||
    clearTimeout
} )();


import spine from "./spine.js";
/**
 * spineworld继承自spine
 * <p>spineworld是基于spine的骨骼动画<p>
 * <p>丰富的api<p>
 * <p>canvas,webgl全支持</p>
 * <p>完全兼容移动端</p>
 * <p>提供厘米秀换装，动作等api<p>
 * @module spineworld
 */
/**
 * SpinePlus继承自spine对象
 * @class SpinePlus
 * @param  {dom}  canvas  canvas的dom节点
 * @param  {object}  config  初始化对象配置
 * @param  {boolean} config.retina 支持retina屏幕
 * @param  {boolean} config.usewebgl 是否使用webgl，默认智能选择
 * @param  {number} config.scale 骨骼缩放值，默认为1
 * @param  {number} config.png 骨骼缩放值，默认为1
 * @param  {string} config.json 骨骼json文件路径
 * @param  {string} config.atlas 骨骼atlas材质地图文件路径
 * @param  {string} config.png 骨骼皮肤文件路径
 * @constructor
 * @example    
 * <script>
    var lty=new SpinePlus(canvas,{
      png:"../img/bone-skin/lty/Girl_Vocaloid.png",
      json:"../img/bone-skin/lty/Girl_Vocaloid.json",
      atlas:"../img/bone-skin/lty/Girl_Vocaloid.atlas",
      scale:3
    });
    lty.handler("ready",function(){
      this._animationState.setAnimation(0, "luotianyi_sender_0", false);
      this.renderAnimation(this._skeleton,{
        x:this._canvas.width/2,
        y:this._canvas.height/100
      })
    })
  </script>
*/

function SpinePlus(canvas,config){
  this.entryTime=new Date().getTime();
  /**
   * canvas 绘制的载体
   * @param {dom} canvas
   */
  this._canvas=canvas;
  this._canvas.height=this._canvas.clientHeight;
  this._canvas.width=this._canvas.clientWidth;
  config=config || {};
  !canvas && console.error("缺少canvas");
  !config.json && console.error("缺少必要骨骼数据.json");
  !config.atlas && console.error("缺少必要骨骼材质地图.atlas");
  !config.png && console.error("缺少必要骨骼材质图片.png");
  this._config={
    png:config.png,//纹理图片
    atlas:config.atlas,//纹理地图
    json:config.json, //骨骼文件
    ratina:typeof config.ratina=="undefined" ? true : config.ratina,//使用ratina
    usewebgl:typeof config.usewebgl=="undefined" ? true : config.usewebgl,//使用webgl
    scale:config.scale || 1, //缩放
    triangleRendering:typeof config.triangleRendering=="undefined" ? true : config.triangleRendering, //多边形绘制
    debugRendering:typeof config.debugRendering=="undefined" ? false : config.debugRendering //debug模式
  }
  /**
   * usewebgl 是否使用webl
   * @property assetManager
   * @type {boolean}
   * @default true
   */
  this._usewebgl=this._config.usewebgl && this.checkWebgl();
  /**
   * _isRatina 是否为_isRatina
   * @property _isRatina
   * @type {boolean}
   */
  this._isRatina=this._config.ratina;// && this.util.setRatina(this.canvas);
  /**
   * _ctx canvas的content，“2d" or "webgl"
   * @property _ctx
   * @type {content}
   */
  this._ctx=null;
  /**
   * _atlas纹理地图
   * @property _atlas
   * @type {atlas}
   * @default null
   */
  this._atlas=null;
  /**
   * _atlasLoader 纹理地图装载器(实例化atlas，并携带一个资源加载器assetManager)
   * @property _atlasLoader
   * @type {atlasLoader}
   * @default null
   */
  this._atlasLoader=null;
  /**
   * _skeletonData 骨骼json文件数据
   * @property _skeletonData
   * @type {skeletonData}
   * @default null
   */
  this._skeletonData=null;
  /**
   * _roleSkeletonJson骨骼json数据控制集合
   * @property _roleSkeletonJson
   * @type {roleSkeletonJson}
   * @default null
   */
  this._skeletonJsonData=null;
  /**
   * _skeletonData 骨骼数据
   * @property _skeletonData
   * @type {skeletonData}
   * @default null
   */
  this._skeletonJson=null;
  /**
   * _skeleton 骨骼对象
   * @property _skeleton
   * @type {skeleton}
   * @default null
   */
  this._skeleton=null;
  /**
   * _skeletonRenderer 骨骼渲染对象
   * @property _skeletonRenderer
   * @type {skeletonRenderer}
   * @default null
   */
  this._skeletonRenderer=null;
  /**
   * _animationStateData 骨骼动画数据封装
   * @property _animationStateData
   * @type {animationStateData}
   * @default null
   */
  this._animationStateData=null;
  /**
   * _animationState 骨骼动画对象封装
   * @property _animationState
   * @type {_animationState}
   * @default null
   */
  this._animationState = null;
  this.timmer=null;
  this.initTime=0;

  this.init=(function(){
    this._config.ratina && this.setRatina(this._canvas);
    this._ctx=this.getContext(this._canvas);
    this._assetManager= this._usewebgl ? new this.webgl.AssetManager(this._ctx) : new this.canvas.AssetManager(this._ctx);
    this._assetManager.loadText(this._config.json);
    this._assetManager.loadText(this._config.atlas);
    this._assetManager.loadTexture(this._config.png);
    this.loadComplete(function(){
      this._atlas=this.getAtlas(this._config.atlas);
      this._atlasLoader=new this.TextureAtlasAttachmentLoader(this._atlas);
      //skeletonJson管理skeleton的相关数据
      this._skeletonJson=new this.SkeletonJson(this._atlasLoader);
      this._skeletonJson.scale=this._config.scale;
      this._skeletonJsonData=this._assetManager.get(this._config.json);
      this._skeletonData=this._skeletonJson.readSkeletonData(this._skeletonJsonData);
      this._skeleton=new this.Skeleton(this._skeletonData);
      //console.dir(this._skeleton)
      this._skeletonRenderer=this.getSkeletonRenderer();
      this._skeletonRenderer.triangleRendering = this._config.triangleRendering;
      this._skeletonRenderer.debugRendering = this._config.debugRendering;
      this._animationStateData=new this.AnimationStateData(this._skeleton.data);
      this._animationState = new this.AnimationState(this._animationStateData);
      this.initTime=new Date().getTime()-this.entryTime;
      this.trigger("ready")
    });
  }).call(this)
}
SpinePlus.prototype=spine;

/**
 * checkWebgl 检查是否支持webgl
 * @method checkWebgl
 * @return  {boolean} 
 */
SpinePlus.prototype.checkWebgl=function(){
  var canvas=document.createElement("canvas");
  var webgl=canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  return webgl ? true : false;
}
/**
 * getContext 获取canvas的context
 * @method getContext
 * @return  {context} 
 */
SpinePlus.prototype.getContext=function(){
  if(this._usewebgl){
    //return this._canvas.getContext('webgl',{ alpha: true ,preserveDrawingBuffer: true}) || this._canvas.getContext('experimental-webgl',{ alpha: true ,preserveDrawingBuffer: true});
    return this._canvas.getContext("webgl",{alpha:true})||e.getContext("experimental-webgl",{alpha:true});
  }else{
    return this._canvas.getContext("2d");
  }
}


/**
 * getAtlas 获取地图
 * @method getAtlas
 * @param {string} atlas文件完整路径
 * @return  {object}
 */
SpinePlus.prototype.getAtlas=function(filepath){
  var path=filepath.slice(0,filepath.lastIndexOf("/")+1);
  var filename=filepath.slice(filepath.lastIndexOf("/")+1);
  var self=this;
  return new this.TextureAtlas(
    this._assetManager.get(path+filename),
    function(filename){
      return self._assetManager.get(path+filename);
    }
  );
}
/**
 * setRatina 获取canvas的context
 * @method setRatina
 * @param {dom} canvas 
 */
SpinePlus.prototype.setRatina=function(canvas){
  canvas.width = canvas.clientWidth*window.devicePixelRatio;
  canvas.height = canvas.clientHeight*window.devicePixelRatio;
}


/**
 * setRatina 获取canvas的context
 * @method setRatina
 * @param {dom} canvas 
 */
SpinePlus.prototype.loadComplete=function(callback){
  var self=this;
  function check(){
    if(self._assetManager.isLoadingComplete()){
      callback && callback.call(self)
      check=null;
      self.trigger("loadComplete")
    }else{
      requestAnimFrame(check)
    }   
  };
  requestAnimFrame(check)
}

SpinePlus.prototype.getSkeletonRenderer=function(callback){
  var skeletonRenderer=this._usewebgl ? new this.webgl.SkeletonRenderer(this._ctx) : new this.canvas.SkeletonRenderer(this._ctx);
  skeletonRenderer.debugRendering=this._config.debugRendering ? true : false;
  var self=this;
  skeletonRenderer.clean=function(){
    if(self._usewebgl){
      //self.ctx.clearColor(1, 1, 1, 1);
      self._ctx.clear(self._ctx.COLOR_BUFFER_BIT);
    }else{
      //self._ctx.fillStyle = "rgba(255,255,255,1)";
      //self._ctx.fillRect(0, 0, self.canvas.width, self.canvas.height);
      self._ctx.clearRect(0,0,self._canvas.width,self._canvas.height)
    }
  }
  return skeletonRenderer;
}

/**
 * render 渲染骨骼
 * @method render
 * @param {skeleton} skeleton骨骼
 * @param {object} option 
 */
SpinePlus.prototype.render=function(skeleton,option){
  var option=option || {};
  var pos={
    x:option.x || 0,
    y:option.y || 0 
  }
  skeleton.x=0+pos.x;
  if(this._usewebgl){
    skeleton.y=0+pos.y ;
    skeleton.flipY=false;
    var mvp = new this.webgl.Matrix4();
    var shader = this.webgl.Shader.newColoredTextured(this._ctx);
    var batcher = new this.webgl.PolygonBatcher(this._ctx);
    mvp.ortho2d(0,0,this._canvas.width,this._canvas.height);
    this._skeletonRenderer.clean();
    skeleton.updateWorldTransform();
    shader.bind();
    shader.setUniformi(this.webgl.Shader.SAMPLER, 0);
    shader.setUniform4x4f(this.webgl.Shader.MVP_MATRIX, mvp.values);
    batcher.begin(shader);
    this._skeletonRenderer.premultipliedAlpha = true;
    this._skeletonRenderer.draw(batcher, skeleton);
    batcher.end();
    shader.unbind();
  }else{
    skeleton.y=this._canvas.height-pos.y;
    skeleton.flipY=true;
    skeleton.updateWorldTransform();
    this._skeletonRenderer.clean();
    this._skeletonRenderer.draw(skeleton);
  }
};





/**
 * handler 事件机制
 * @method handler
 * @return  {context}
 * @param   {string} 自定义事件名称
 * @param   {function} 自定义事件
 */
SpinePlus.prototype.handler=function(type, handler) {
    //添加事件对象
    if (typeof this.handlers == "undefined") { this.handlers = {} }
    if (typeof this.handlers[type] == 'undefined') {
        this.handlers[type] = new Array();
    }
    this.handlers[type] = this.handlers[type].concat(handler);
},

/**
 * trigger 触发事件
 * @method trigger
 * @return  {context}
 * @param   {string} 事件名称
 */
SpinePlus.prototype.trigger=function(type) {
    if (typeof this.handlers == "undefined") { this.handlers = {} }
    if (this.handlers[type] instanceof Array) {
        var handlers = this.handlers[type];
        for (var i = 0, len = handlers.length; i < len; i++) {
            handlers[i].call(this, this);
        }
    }
}


/**
 * renderAnimation 触发事件
 * @method renderAnimation
 * @param {skeleton} 骨骼对象
 * @param {object} option渲染参数
 */
SpinePlus.prototype.renderAnimation=function(skeleton,option){
  var self=this;
  var lastFrameTime = Date.now() / 1000;
  var timmer=null;
  this.timmer && cancelRequestAnimFrame(this.timmer);
  this.timmer=null;
  function anima() {
    var now = Date.now() / 1000;
    var delta = now - lastFrameTime;
    lastFrameTime = now;
    self._animationState.update(delta);
    self._animationState.apply(skeleton);
    self.render(skeleton,option);
    if(!self._animationState.tracks[0]){
      self.trigger("animationEnd")
      return false;
    }
    now=delta=null;
    self.timmer=requestAnimFrame(anima);
  }
  self.timmer=requestAnimFrame(anima);
}

export default SpinePlus;


















