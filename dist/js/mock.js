export default {
    //选模版
    photoTemplates: [{
        //模版宽度
        width: 1080,
        //模版高度
        height: 800,
        //默认动作，从线上拉动作id, 如果为空则不给动作了，绘制人物默认的第一帧
        defaultAction: "00001",
        //pose
        pose: [
            {
                x: 100,
                y: 700,
                //给动作名称，相对路径，没有的话就用defaultAction
                action: "action1"
            },
            {
                x: 100,
                y: 700,
                action: "action1"
            },
            {
                x: 100,
                y: 700,
                action: "action1"
            },
            {
                x: 100,
                y: 700,
                action: "action1"
            },
            {
                x: 100,
                y: 700,
                action: "action1"
            },
        ]
        //action
    }],
    //选角色
    roles: [
        { 
            avatar: { 
                dressids: ["0001", "0002", "0003", "0004"], 
                roleid: '' 
            }, 
            head: "", 
            nick: '半俗不雅', 
            uin: '2323223' 
        }
    ]
}

// http://i.gtimg.cn/qqshow/admindata/comdata/vipApollo_item_${装扮id}/d.zip
        // 合照好友列表 [{avatar: {dressids: [112233， 2222], roleid} , head, nick, uin}]