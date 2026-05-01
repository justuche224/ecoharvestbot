import cron from "node-cron";
import type { Telegraf } from "telegraf";
import { allGroupIds } from "../../config";
import dailyMessages from "../store/daily-msg.json";

type TimeSlot = "morning" | "afternoon" | "night";

const SCHEDULE: { cronExpr: string; slot: TimeSlot; index: number }[] = [
    { cronExpr: "0 6 * * *", slot: "morning", index: 0 },
    { cronExpr: "0 8 * * *", slot: "morning", index: 1 },
    { cronExpr: "0 10 * * *", slot: "morning", index: 2 },

    { cronExpr: "0 12 * * *", slot: "afternoon", index: 0 },
    { cronExpr: "0 14 * * *", slot: "afternoon", index: 1 },
    { cronExpr: "0 16 * * *", slot: "afternoon", index: 2 },

    { cronExpr: "0 18 * * *", slot: "night", index: 0 },
    { cronExpr: "0 20 * * *", slot: "night", index: 1 },
    { cronExpr: "0 22 * * *", slot: "night", index: 2 },
];

const chatIds = allGroupIds
    .map(Number)
    .filter((id) => Number.isFinite(id) && id !== 0);

async function sendPost(telegram: Telegraf["telegram"], slot: TimeSlot, index: number) {
    const post = dailyMessages[slot]?.[index];
    if (!post) return;

    await Promise.all(
        chatIds.map(async (chatId) => {
            try {
                await telegram.sendMessage(chatId, post.text);
            } catch (err) {
                console.error(`[scheduler] Failed to send ${slot}[${index}] to ${chatId}:`, err);
            }
        }),
    );

    console.log(`[scheduler] Sent ${slot} post "${post.id}" to ${chatIds.length} chats`);
}

export function startScheduler(bot: Telegraf) {
    if (chatIds.length === 0) {
        console.warn("[scheduler] No valid chat IDs — scheduler disabled.");
        return;
    }

    for (const { cronExpr, slot, index } of SCHEDULE) {
        cron.schedule(cronExpr, () => sendPost(bot.telegram, slot, index), {
            timezone: "Africa/Lagos",
        });
    }

    console.log("[scheduler] 9 daily posts scheduled (6AM–10PM WAT, 2hrs apart)");
}
