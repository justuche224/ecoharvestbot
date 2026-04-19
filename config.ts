import type { BotConfig, BotCommand } from "./types";

const config: BotConfig = {
    botToken: process.env.BOT_TOKEN || "",
    sourceGroupId: process.env.SOURCE_GROUP_ID || "",
    destinationGroupId1: process.env.DESTINATION_GROUP_1_ID || "",
    destinationGroupId2: process.env.DESTINATION_GROUP_2_ID || "",
    webhookDomain: process.env.WEBHOOK_DOMAIN,
    webhookPort: process.env.WEBHOOK_PORT ? parseInt(process.env.WEBHOOK_PORT) : 3000,
    webhookPath: process.env.WEBHOOK_PATH,
    webhookSecretToken: process.env.WEBHOOK_SECRET_TOKEN,
    googleApiKey: process.env.GOOGLE_API_KEY || "",
};

export const allGroupIds: string[] = [
    config.sourceGroupId,
    config.destinationGroupId1,
    config.destinationGroupId2,
];

export const allCommands: BotCommand[] = [
    { command: "start", description: "EcoHarvest assistant — welcome and orientation" },
    { command: "help", description: "All commands for EcoHarvest & EcoToken info" },
    { command: "faq", description: "Official FAQs, KYC, deposits — ecohavest.org/faqs" },
    { command: "about", description: "Mission, pillars, regenerative finance overview" },
    { command: "token", description: "EcoToken utility themes and whitepaper link" },
    { command: "ico", description: "Public ICO timing — verify on ecohavest.org" },
    { command: "links", description: "Home, sign-up, services, FAQs, contact URLs" },
    { command: "contact", description: "support@ecohavest.org, phone, contact form" },
    { command: "getid", description: "This chat's Telegram ID (for admins / setup)" },
];

export default config;