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

if (config.webhookDomain) {
    bot.launch({
        webhook: {
            domain: config.webhookDomain,
            port: config.webhookPort,
            path: config.webhookPath,
            secretToken: config.webhookSecretToken,
        },
        dropPendingUpdates: true,
    });
    console.log("Bot started in WEBHOOK mode");
    console.log(`Webhook: ${config.webhookDomain}${config.webhookPath ?? ""}`);
    console.log(`Listening on port: ${config.webhookPort}`);
} else {
    bot.launch({ dropPendingUpdates: true });
    console.log("Bot started in POLLING mode (dev)");
}

process.once("SIGINT", () => {
    console.log("SIGINT received, stopping bot...");
    bot.stop("SIGINT");
});

process.once("SIGTERM", () => {
    console.log("SIGTERM received, stopping bot...");
    bot.stop("SIGTERM");
});

process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
});