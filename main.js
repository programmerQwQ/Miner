const mineflayer = require("mineflayer")
const pathfinder = require("mineflayer-pathfinder")

const bot = mineflayer.createBot({
    host: "mc4.weeaxe.cn",
    username: "aO_Oa"
})

bot.loadPlugin(pathfinder.pathfinder)
bot.once("spawn", () => {
    bot.chat("/login aooa2217")
})

var mode
var target

function mine(block) {
    const mcData = require("minecraft-data")(bot.version)
    block = mcData.blocksByName[block]
    if (block == undefined) {
        //取消注释可能会刷屏
        //bot.chat("I can't find " + block.displayName + "!")
        return
    }
    //取消注释可能会刷屏
    //bot.chat("Mining " + block.displayName + "...")
    const targetBlock = bot.findBlock({
        matching: block.id,
        maxDistance: 64
    })
    if (!targetBlock) {
        //取消注释可能会刷屏
        //bot.chat("I can't find " + block.displayName + "!")
        console.log("I can't find " + block.displayName + "!")
        return
    }
    const x = targetBlock.position.x
    const y = targetBlock.position.y
    const z = targetBlock.position.z
    const goal = new pathfinder.goals.GoalBlock(x, y, z)
    const movements = new pathfinder.Movements(bot, mcData)
    bot.pathfinder.setMovements(movements)
    bot.pathfinder.setGoal(goal)
}

bot.on("physicTick", () => {
    switch (mode) {
        case "mine":
            if (bot.pathfinder.goal == null) {
                mine(target)
                console.log(bot.pathfinder.goal)
            }
    }
})

bot.on("chat", (username, message) => {
    params = message.split(" ")
    switch (params[0]) {
        case "!!mine":
            mode = "mine"
            target = params[1]
    }
})

bot.on("kicked", (reason) => {
    console.log(reason)
})