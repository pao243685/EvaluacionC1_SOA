import { z } from "zod";

export const Report3Schema = z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(5).max(50).default(10),
    fromDate: z.string().optional(),
    toDate: z.string().optional(),
});

export type Report3Input = z.infer<typeof Report3Schema>;
