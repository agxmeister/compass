import { z as zod } from "zod";

export const createSessionSchema = {
    url: zod.string().describe("The URL to navigate to"),
};

export const deleteSessionSchema = {
    sessionId: zod.string().describe("The ID of the session to delete"),
};

export const performActionSchema = {
    sessionId: zod.string().describe("The ID of the session"),
    action: zod
        .discriminatedUnion("type", [
            zod.object({
                type: zod.literal("click"),
                x: zod.number().describe("X coordinate"),
                y: zod.number().describe("Y coordinate"),
            }),
            zod.object({
                type: zod.literal("open-page"),
                url: zod.string().describe("URL to navigate to"),
            }),
        ])
        .describe("The action to perform"),
};

