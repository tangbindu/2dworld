export default {
    //活动模版
    photoTemplate:{
        //模版宽度
        width:1080,
        //模版高度
        height:800,
        //默认动作，从线上拉动作id, 如果为空则不给动作了，绘制人物默认的第一帧
        defaultAction:"00001",
        //pose
        pose:[
            {
                x:100,
                y:700,
                //给动作名称，相对路径，没有的话就用defaultAction
                action:"action1"
            },
            {
                x:100,
                y:700,
                action:"action1"
            },
            {
                x:100,
                y:700,
                action:"action1"
            },
            {
                x:100,
                y:700,
                action:"action1"
            },
            {
                x:100,
                y:700,
                action:"action1"
            },
        ]
        //action
    },
    roleList:[
        {
            dressList:[2323,2323,2323],
            name:"Fate-Soul",
        },
        {
            dressList:[2323,2323,2323],
            name:"半俗不雅 ヽ",
        },
        {
            dressList:[2323,2323,2323],
            name:"我忘不掉你！",
        },
        {
            dressList:[2323,2323,2323],
            name:"妹妹，哥哥保护你 哥哥，妹妹守护你",
        },
    ]
    
}