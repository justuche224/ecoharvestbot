import { Telegraf } from "telegraf";
import config, { allCommands } from "./config";
import { registerHandlers } from "./src/handlers";

if (!config.botToken) {
    throw new Error("BOT_TOKEN is not defined in environment variables");
}

const bot = new Telegraf(config.botToken);

bot.telegram.setMyCommands(allCommands);

bot.use(async (ctx, next) => {
    const start = new Date().getTime();
    await next();
    const ms = new Date().getTime() - start;
    console.log("Response time: %sms", ms);
});

registerHandlers(bot);