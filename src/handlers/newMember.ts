import type { Telegraf } from "telegraf";
import { escapeHtml, createInlineKeyboard } from "../utils/formatters";

const LINKS = {
    website: "https://ecohavest.org",
    signup: "https://ecohavest.org/sign-up",
    faqs: "https://ecohavest.org/faqs",
    whitepaper: "https://ecohavest.org/ecoharvest-whitepaper.pdf",
    contact: "https://ecohavest.org/contact",
    services: "https://ecohavest.org/services",
} as const;

function welcomeKeyboard() {
    return createInlineKeyboard([
        [
            { text: "Website", url: LINKS.website },
            { text: "Sign up", url: LINKS.signup },
        ],
        [
            { text: "FAQs", url: LINKS.faqs },
            { text: "Whitepaper", url: LINKS.whitepaper },
        ],
        [
            { text: "Contact", url: LINKS.contact },
            { text: "Services", url: LINKS.services },
        ],
    ]);
}

export function registerNewMemberHandler(bot: Telegraf) {
    bot.on("new_chat_members", async ctx => {
        const msg = ctx.message;
        if (!msg || !("new_chat_members" in msg)) return;
        const chat = ctx.chat;
        if (!chat || (chat.type !== "group" && chat.type !== "supergroup")) return;

        const humanMembers = msg.new_chat_members.filter(m => !m.is_bot);
        if (humanMembers.length === 0) return;

        const names = humanMembers
            .map(m => escapeHtml([m.first_name, m.last_name].filter(Boolean).join(" ") || "friend"))
            .join(", ");

        const text = [
            `<b>Welcome, ${names}!</b>`,
            "",
            "You are now part of the <b>EcoHarvest</b> community — a regenerative finance ecosystem connecting <b>agriculture</b>, <b>renewable energy</b>, and <b>investment</b> for measurable environmental impact.",
            "",
            "<b>Official tagline</b>",
            "<i>Built From Vision, For The World.</i>",
            "",
            "<b>Commands in this chat</b>",
            "<code>/start</code> — assistant welcome",
            "<code>/help</code> — all commands",
            "<code>/faq</code> — official FAQs &amp; getting started",
            "<code>/about</code> — mission and pillars",
            "<code>/token</code> — EcoToken overview",
            "<code>/ico</code> — public sale timing",
            "<code>/links</code> — key pages",
            "<code>/contact</code> — support",
            "<code>/getid</code> — this chat&apos;s Telegram ID",
            "",
            "<b>Website</b> — <a href=\"https://ecohavest.org\">ecohavest.org</a>",
            "",
            "<i>Fees, limits, dates, and legal terms can change — confirm on the site and with support.</i>",
        ].join("\n");

        try {
            await ctx.reply(text, {
                parse_mode: "HTML",
                reply_markup: welcomeKeyboard().reply_markup,
                link_preview_options: { is_disabled: true },
            });
        } catch (e) {
            console.error("new_chat_members welcome failed:", e);
        }
    });
}
