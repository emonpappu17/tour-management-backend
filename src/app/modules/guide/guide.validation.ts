import z from "zod";


export const guideApplyZodSchema = z.object({
    division: z.string()
})