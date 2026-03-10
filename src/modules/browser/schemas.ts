import { z as zod } from "zod";

export const actionSchema = zod.discriminatedUnion("type", [
    zod.object({
        type: zod.literal("click"),
        x: zod.number(),
        y: zod.number(),
    }),
    zod.object({
        type: zod.literal("navigate"),
        url: zod.string(),
    }),
]);
