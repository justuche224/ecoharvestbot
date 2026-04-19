import { GoogleGenAI } from "@google/genai";
import config from "../../config";
import { zodToJsonSchema } from "zod-to-json-schema";
import z from "zod";

const knowledgePath = new URL("../../knowledge.md", import.meta.url);
let knowledgeCache: string | null = null;

async function loadKnowledge(): Promise<string> {
    if (knowledgeCache) return knowledgeCache;
    knowledgeCache = await Bun.file(knowledgePath).text();
    return knowledgeCache;
}

const responseSchema = z.object({
    text: z.string(),
});

function extractAnswer(value: unknown): string | null {
    if (typeof value === "string") return value;
    if (value && typeof value === "object" && !Array.isArray(value)) {
        for (const v of Object.values(value as Record<string, unknown>)) {
            if (typeof v === "string" && v.trim()) return v;
        }
    }
    return null;
}

const SYSTEM_PROMPT = [
    "You are the official EcoHarvest & EcoToken assistant on Telegram.",
    "Answer clearly and concisely based on the knowledge base below.",
    "Prefer sections 4-8 and the URL table for 'how do I use the site' questions; link to https://ecohavest.org and the specific page.",
    "Use sections 1-3 and 9 for vision, token, and roadmap intent; always separate 'planned / whitepaper' from 'available on the website today'.",
    "Do NOT guarantee investment returns, token prices, or regulatory outcomes.",
    "For exact percentages, minimums, or legal terms, direct users to the whitepaper (https://ecohavest.org/ecoharvest-whitepaper.pdf), in-app text, and support@ecohavest.org.",
    "Keep answers short — a few sentences to a short paragraph. If you do not know, say so and point the user to support@ecohavest.org.",
    "Do NOT use markdown formatting. Write plain text only — no bold markers, no asterisks, no HTML tags.",
].join("\n");

const ai = new GoogleGenAI({ apiKey: config.googleApiKey });

export async function ask(question: string): Promise<string> {
    if (!config.googleApiKey) {
        throw new Error("GOOGLE_API_KEY is not configured");
    }

    const knowledge = await loadKnowledge();

    const response = await ai.models.generateContent({
        // model: "gemini-3.1-flash-lite-preview",
        model: "gemini-3-flash-preview",
        contents: [
            {
                role: "user",
                parts: [{ text: question }],
            },
        ],
        config: {
            systemInstruction: `${SYSTEM_PROMPT}\n\n--- KNOWLEDGE BASE ---\n${knowledge}`,
            responseMimeType: "application/json",
            // @ts-expect-error: zodToJsonSchema is not typed correctly
            responseJsonSchema: zodToJsonSchema(responseSchema),
        },
    });

    const raw = response.text;
    if (!raw) throw new Error("Empty response from model");

    console.log(raw);

    let jsonValue: unknown;
    try {
        jsonValue = JSON.parse(raw);
    } catch {
        return raw.trim();
    }

    const answer = extractAnswer(jsonValue);
    if (answer) return answer.trim();

    throw new Error("Invalid response shape from model");
}
