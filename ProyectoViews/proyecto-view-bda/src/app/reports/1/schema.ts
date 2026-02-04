import {z} from "zod";

export const Report1Schema = z.object({
    limit : z.number().min(1).max(100).default(10),
    page : z.number().min(1).default(1),
})

