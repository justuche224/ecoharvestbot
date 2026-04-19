import type { Telegraf } from "telegraf";
import { escapeHtml, createInlineKeyboard } from "../utils/formatters";
import { allCommands } from "../../config";

const linkRows = [
    [
        { text: "ecohavest.org", url: "https://ecohavest.org" },
        { text: "Sign up", url: "https://ecohavest.org/sign-up" },
    ],
    [
        { text: "FAQs", url: "https://ecohavest.org/faqs" },
        { text: "Whitepaper (PDF)", url: "https://ecohavest.org/ecoharvest-whitepaper.pdf" },
    ],
    [{ text: "Contact", url: "https://ecohavest.org/contact" }],
];

const replyOpts = {
    parse_mode: "HTML" as const,
    reply_markup: createInlineKeyboard(linkRows).reply_markup,
    link_preview_options: { is_disabled: true },
};

export function registerCommandHandlers(bot: Telegraf) {
    bot.start(async ctx => {
        const who = ctx.from
            ? escapeHtml([ctx.from.first_name, ctx.from.last_name].filter(Boolean).join(" ") || "there")
            : "there";
        await ctx.reply(
            [
                `<b>Hi ${who}!</b>`,
                "",
                "I help with <b>EcoHarvest</b> — regenerative finance across agriculture, renewable energy, and investment.",
                "",
                "<b>Try</b> <code>/help</code> for commands, or use the menu next to the message field.",
            ].join("\n"),
            replyOpts,
        );
    });

    bot.command("help", async ctx => {
        const lines = allCommands.map(
            c => `<code>/${escapeHtml(c.command)}</code> — ${escapeHtml(c.description)}`,
        );
        await ctx.reply(["<b>EcoHarvest bot commands</b>", "", ...lines].join("\n"), replyOpts);
    });

    bot.command("faq", async ctx => {
        await ctx.reply(
            [
                "<b>Official FAQ</b>",
                "",
                "Published at <a href=\"https://ecohavest.org/faqs\">ecohavest.org/faqs</a>.",
                "",
                "<b>Getting started</b>",
                "1. Get access — sign up at ecohavest.org/sign-up",
                "2. Complete KYC with clear ID and proof of address as required",
                "3. Deposit, choose a product, and follow in-dashboard guidance",
                "",
                "<b>Support</b> — support@ecohavest.org",
                "",
                "<i>Withdrawal minimums and limits (e.g. crypto equivalent rules) can change — check the live site and FAQs.</i>",
            ].join("\n"),
            replyOpts,
        );
    });

    bot.command("about", async ctx => {
        await ctx.reply(
            [
                "<b>What is EcoHarvest?</b>",
                "",
                "A regenerative finance ecosystem connecting agriculture, renewable energy, and investment through trading-style systems, harvest pools, and blockchain-related positioning — aimed at global adoption and measurable environmental impact.",
                "",
                "<b>Pillars</b>",
                "• Agriculture meets innovation",
                "• Energy meets sustainability",
                "• Investment meets real-world value",
                "",
                "<a href=\"https://ecohavest.org/about\">About page</a>",
            ].join("\n"),
            replyOpts,
        );
    });

    bot.command("token", async ctx => {
        await ctx.reply(
            [
                "<b>EcoToken &amp; platform themes</b>",
                "",
                "EcoToken is described as powering EcoHarvest.org to connect capital to vetted green initiatives with transparency. Documented themes include staking, governance, marketplace (credits, NFTs), grants, and buyback/burn design — not all items may be live yet.",
                "",
                "Infrastructure themes in materials include Binance Smart Chain; confirm live parameters in official token docs at launch.",
                "",
                "<b>Whitepaper PDF</b> — <a href=\"https://ecohavest.org/ecoharvest-whitepaper.pdf\">ecoharvest-whitepaper.pdf</a>",
                "",
                "<i>Do not treat this as investment advice; verify on ecohavest.org and official announcements.</i>",
            ].join("\n"),
            replyOpts,
        );
    });

    bot.command("ico", async ctx => {
        await ctx.reply(
            [
                "<b>ICO messaging (verify on site)</b>",
                "",
                "Promoted timing: <b>May 1, 2026 at 04:00 UTC</b> — confirm on <a href=\"https://ecohavest.org\">ecohavest.org</a> before acting.",
                "",
                "The ICO is fundraising; long-term value depends on execution, team visibility, product, and community.",
            ].join("\n"),
            replyOpts,
        );
    });

    bot.command("links", async ctx => {
        await ctx.reply(
            [
                "<b>Key pages</b>",
                "",
                "• <a href=\"https://ecohavest.org/\">Home</a>",
                "• <a href=\"https://ecohavest.org/about\">About</a>",
                "• <a href=\"https://ecohavest.org/services\">Services</a>",
                "• <a href=\"https://ecohavest.org/investments\">Investments</a>",
                "• <a href=\"https://ecohavest.org/sign-up\">Sign up</a>",
                "• <a href=\"https://ecohavest.org/sign-in\">Sign in</a>",
                "• <a href=\"https://ecohavest.org/faqs\">FAQs</a>",
                "• <a href=\"https://ecohavest.org/contact\">Contact</a>",
                "• <a href=\"https://ecohavest.org/try\">Try / demo</a>",
            ].join("\n"),
            replyOpts,
        );
    });

    bot.command("contact", async ctx => {
        await ctx.reply(
            [
                "<b>Contact &amp; support</b>",
                "",
                "• Website — <a href=\"https://ecohavest.org\">ecohavest.org</a>",
                "• Email — support@ecohavest.org",
                "• Phone — +1 732-535-3309 (see <a href=\"https://ecohavest.org/services\">services</a>)",
                "• Form — <a href=\"https://ecohavest.org/contact\">ecohavest.org/contact</a>",
            ].join("\n"),
            replyOpts,
        );
    });

    bot.command("getid", async ctx => {
        const chat = ctx.chat;
        if (!chat) return;
        await ctx.reply(
            `<b>Chat ID</b>\n<code>${chat.id}</code>\n\nType: ${escapeHtml(chat.type)}`,
            { parse_mode: "HTML", link_preview_options: { is_disabled: true } },
        );
    });
}
