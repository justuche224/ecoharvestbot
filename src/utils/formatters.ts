import { Context } from "telegraf";
import { Markup } from "telegraf";

export function isChatPrivate(ctx: Context): boolean {
    return ctx.chat?.type === "private";
}

export function isChatGroup(ctx: Context): boolean {
    return ctx.chat?.type === "group" || ctx.chat?.type === "supergroup";
}

export function isChatChannel(ctx: Context): boolean {
    return ctx.chat?.type === "channel";
}

export async function isUserAdmin(ctx: Context): Promise<boolean> {
    if (!ctx.from || !ctx.chat) return false;

    try {
        const chatMember = await ctx.getChatMember(ctx.from.id);
        return chatMember.status === "administrator" || chatMember.status === "creator";
    } catch (error) {
        console.error("Error checking admin status:", error);
        return false;
    }
}

export function escapeHtml(text: string): string {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

export function createInlineKeyboard(buttons: Array<Array<{ text: string; url?: string; callback_data?: string }>>) {
    return Markup.inlineKeyboard(
        buttons.map(row =>
            row.map(btn =>
                btn.url
                    ? Markup.button.url(btn.text, btn.url)
                    : Markup.button.callback(btn.text, btn.callback_data!)
            )
        )
    );
}
