export default{
    appliction:[{
        name:"fileReader",//unique
        icon:require("../static/icons/fileReader.jpg"),
        title:"电子书阅读器",
        event:"handleFileReader",
        decoration:"",//a dom that append to icon
    },{
        name:"Game_snake",//unique
        icon:require("../static/icons/Game_snake.jpg"),
        title:"贪吃蛇",
        event:"handleSnake",
        decoration:"",//a dom that append to icon
    },{
        name:"Game_RussiaBlocks",//unique
        icon:require("../static/icons/Game_RussiaBlocks.jpg"),
        title:"俄罗斯方块",
        event:"handleRussiaBlocks",
        decoration:"",//a dom that append to icon
    },
    // {
    //     name:"Game_chinesePoker",//unique
    //     icon:require("../static/icons/Game_RussiaBlocks.jpg"),
    //     title:"中国斗地主",
    //     event:"handleChinesePoker",
    //     decoration:"",//a dom that append to icon
    // }
]
}