import { z } from "zod";

export const loginSchema = z.object({
    identifier: z.string().email(),
    password: z.string().min(6),
});

export const registerSchema = z.object({
    username: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Password dan konfirmasi password harus sama",
    path: ["confirmPassword"],
});
