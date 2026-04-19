import type { Telegraf } from "telegraf";
import { ask } from "../utils/ai";

const TELEGRAM_MAX_LENGTH = 4096;
const COOLDOWN_MS = 3_000;
const lastReply = new Map<number, number>();

const FALLBACK =
    "Sorry, I could not generate a reply right now. Try /contact or visit https://ecohavest.org for help.";

export function registerDmAiHandler(bot: Telegraf) {
    bot.on("text", async (ctx, next) => {
        if (ctx.chat.type !== "private") return next();
        if (ctx.message.text.startsWith("/")) return next();

        const userId = ctx.from.id;
        const now = Date.now();
        const last = lastReply.get(userId) ?? 0;
        if (now - last < COOLDOWN_MS) return;
        lastReply.set(userId, now);

        try {
            await ctx.sendChatAction("typing");
            const answer = await ask(ctx.message.text);

            if (answer.length <= TELEGRAM_MAX_LENGTH) {
                await ctx.reply(answer);
            } else {
                const first = answer.slice(0, TELEGRAM_MAX_LENGTH);
                const second = answer.slice(TELEGRAM_MAX_LENGTH, TELEGRAM_MAX_LENGTH * 2);
                await ctx.reply(first);
                if (second) await ctx.reply(second);
            }
        } catch (err) {
            console.error("DM AI error:", err);
            await ctx.reply(FALLBACK);
        }
    });
}
