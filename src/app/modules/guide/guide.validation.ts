import z from "zod";
import { GuideStatus } from "./guide.interface";


export const guideApplyZodSchema = z.object({
    division: z.string()
})

export const guideApprovalZodSchema = z.object({
    status: z.enum([GuideStatus.APPROVED, GuideStatus.REJECTED])
})