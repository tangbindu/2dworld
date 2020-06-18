let tools={
    //整数策略
    toInt(val){
        return Math.floor(val);
    },
    //绘制策略
    toDrawVal(val){
        return Math.floor(val)+.5;
    }
};
export default tools;