class stage{
    /**
     * @param {node} container 
     * @param {number} ratio 
     */
    constructor(container,ratio){
        this.ratio=ratio;
        this.container=container;
        this.view=null;
        this.ctx=null;
        this.init();
    }
    /**
     * 初始化
     */
    init(){
        this.view=document.createElement("canvas");
        this.ctx = this.view.getContext("2d");
        document.getElementById("container").appendChild(this.view);
        this.resize(this.container,this.ratio);
    }
    /**
     * 缩放舞台
     * @param {number} scale
     * @param {object} app
     */
    scale(scale,app){
        //缩放后，逻辑像素不能变
        let newScale=app.scale*scale;
        if(newScale>app.scaleLimit || newScale<1/app.scaleLimit){
            return;
        }else{
            app.scale=newScale;
        }
        //current LogicPos
        app.mouseEvent.refresh();
        let lastCurLogicPosX=app.mouseEvent.curLogicPos.x;
        let lastCurLogicPosY=app.mouseEvent.curLogicPos.y;
        //new LogicPos
        app.mouseEvent.scale=newScale;
        app.mouseEvent.refresh();
        let newCurLogicPosX=app.mouseEvent.curLogicPos.x;
        let newCurLogicPosY=app.mouseEvent.curLogicPos.y;
        //新坐标
        app.coordinateOrigin.x+=(newCurLogicPosX-lastCurLogicPosX);
        app.coordinateOrigin.y+=(newCurLogicPosY-lastCurLogicPosY);
    }
    /**
     * 重置尺寸
     * @param {node} container 
     * @param {number} ratio 
     */
    resize(container,ratio){
        this.view.width=this.container.clientWidth*this.ratio;
        this.view.height=this.container.clientHeight*this.ratio;
        this.view.style.zoom=1/this.ratio;
    }
};
export default stage;