import * as z from "zod";


export const NewPasswordSchema = z.object({
  password: z
    .string()
    .min(6, {
      message: 'Password is required to be at least 6 characters',
    }),
})

export const ResetSchema = z.object({
  email: z.string().email({ message: 'Email is required' }),
})

export const LoginSchema = z.object({
  email: z.string().email({ message: "Email is required" }),
  password: z
    .string()
    .min(6, "Password is required and must be at least 6 chararcters long"),

});

export const RegisterSchema = z.object({
  firstName: z.string().min(1, { message: "Frist name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Email is required" }),
  password: z
    .string()
    .min(6, "Password is required and must be at least 6 chararcters long"),
});
