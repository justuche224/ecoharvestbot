import type { Telegraf } from "telegraf";
import type { Message } from "telegraf/types";
import config from "../../config";

const sourceId = Number(config.sourceGroupId);

const destinations: number[] = [
    Number(config.destinationGroupId1),
    Number(config.destinationGroupId2),
].filter((id) => Number.isFinite(id) && id !== 0);

function isCommand(msg: Message): boolean {
    const text = "text" in msg ? msg.text : undefined;
    const caption = "caption" in msg ? msg.caption : undefined;
    return text?.startsWith("/") === true || caption?.startsWith("/") === true;
}

async function forwardToDestinations(
    telegram: Telegraf["telegram"],
    fromChatId: number,
    messageId: number,
) {
    await Promise.all(
        destinations.map(async (destId) => {
            try {
                await telegram.forwardMessage(destId, fromChatId, messageId);
            } catch (err) {
                console.error(`Forward to ${destId} failed:`, err);
            }
        }),
    );
}

export function registerForwarderHandler(bot: Telegraf) {
    if (!Number.isFinite(sourceId) || sourceId === 0 || destinations.length === 0) {
        console.warn(
            "Forwarder disabled: SOURCE_GROUP_ID or destination IDs missing/invalid.",
        );
        return;
    }

    bot.on("message", async (ctx, next) => {
        if (ctx.chat.id !== sourceId) return next();
        if (isCommand(ctx.message)) return next();

        await forwardToDestinations(ctx.telegram, ctx.chat.id, ctx.message.message_id);
        return next();
    });

    bot.on("channel_post", async (ctx, next) => {
        if (ctx.chat.id !== sourceId) return next();
        if (isCommand(ctx.channelPost)) return next();

        await forwardToDestinations(
            ctx.telegram,
            ctx.chat.id,
            ctx.channelPost.message_id,
        );
        return next();
    });
}
