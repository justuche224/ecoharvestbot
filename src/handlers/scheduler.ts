import cron from "node-cron";
import type { Telegraf } from "telegraf";
import { allGroupIds } from "../../config";
import dailyMessages from "../store/daily-msg.json";

type TimeSlot = "morning" | "afternoon" | "night";

const SCHEDULES: Record<TimeSlot, string> = {
    morning: "0 8 * * *",
    afternoon: "0 14 * * *",
    night: "0 21 * * *",
};

const indexes: Record<TimeSlot, number> = {
    morning: 0,
    afternoon: 0,
    night: 0,
};

const chatIds = allGroupIds
    .map(Number)
    .filter((id) => Number.isFinite(id) && id !== 0);

async function sendPost(telegram: Telegraf["telegram"], slot: TimeSlot) {
    const posts = dailyMessages[slot];
    if (!posts || posts.length === 0) return;

    const post = posts[indexes[slot] % posts.length];
    if (!post) return;
    indexes[slot] = (indexes[slot] + 1) % posts.length;

    await Promise.all(
        chatIds.map(async (chatId) => {
            try {
                await telegram.sendMessage(chatId, post.text);
            } catch (err) {
                console.error(`[scheduler] Failed to send ${slot} post to ${chatId}:`, err);
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

    for (const slot of Object.keys(SCHEDULES) as TimeSlot[]) {
        cron.schedule(SCHEDULES[slot], () => sendPost(bot.telegram, slot), {
            timezone: "Africa/Lagos",
        });
    }

    console.log("[scheduler] Daily posts scheduled (morning 8AM, afternoon 2PM, night 9PM WAT)");
}
