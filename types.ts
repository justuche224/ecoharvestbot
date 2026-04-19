import type { Context } from "telegraf";

export interface BotConfig {
    botToken: string;
    sourceGroupId: string;
    destinationGroupId1: string;
    destinationGroupId2: string;
    webhookDomain?: string;
    webhookPort?: number;
    webhookPath?: string;
    webhookSecretToken?: string;
    googleApiKey: string;
}

export interface BotCommand {
    command: string;
    description: string;
}

export type BotContext = Context;
