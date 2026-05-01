import type { Telegraf } from "telegraf";
import { registerCommandHandlers } from "./commands";
import { registerNewMemberHandler } from "./newMember";
import { registerDmAiHandler } from "./dmAi";
import { registerForwarderHandler } from "./forwarder";
import { startScheduler } from "./scheduler";

export function registerHandlers(bot: Telegraf) {
    registerCommandHandlers(bot);
    registerForwarderHandler(bot);
    registerDmAiHandler(bot);
    registerNewMemberHandler(bot);
    startScheduler(bot);
}
