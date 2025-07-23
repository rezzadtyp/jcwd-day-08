import { z as zod } from 'zod'

export const todoSchema = zod.object({
    title: zod.string()
        .min(3, { message: 'Title must be at least 3 character' })
        .max(100, { message: 'Title too long' }).default(''),
    completed: zod.boolean().default(false),
})

export type TodoInput = zod.infer<typeof todoSchema>