//相片
import photo from "./modules/photo.js"
//role
import lmrole from "./modules/lmrole.js"
//mock数据
import mock from "./mock.js"

//step1 get舞台
let stage=photo.stage;
//step2 舞台放在页面中
document.getElementById("stageContainer").appendChild(stage.view);
document.getElementById("stageContainer").appendChild(lmrole.offsetScreen);
//step3 选模版-模版0
let photoTemplate=mock.photoTemplates[0];
//step4 设置下舞台大小
photo.resize(photoTemplate.width,photoTemplate.height)
//step5 添加贴纸
photo.addSticker("../imgs/sticker/ill3.png");
//添加角色
photo.addRoleSprite(
  "../imgs/role/role1.png",
  "半俗不雅",
  photoTemplate.pose[0].x,
  photoTemplate.pose[0].y
);
//拉线上素材
lmrole.addRole(mock.roles[0].avatar.dressids).then((res)=>{
  photo.addRoleSprite(
    res,
    mock.roles[0].nick,
    photoTemplate.pose[1].x,
    photoTemplate.pose[1].y,
  );
})

