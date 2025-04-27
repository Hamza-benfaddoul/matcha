import * as z from "zod";

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Password is required to be at least 6 characters",
  }),
});

export const ResetSchema = z.object({
  email: z.string().email({ message: "Email is required" }),
});

export const LoginSchema = z.object({
  email: z.string().email({ message: "Email is required" }),
  password: z
    .string()
    .min(6, "Password is required and must be at least 6 chararcters long"),
});

export const RegisterSchema = z.object({
  firstName: z.string().min(1, { message: "Frist name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  userName: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Email is required" }),
  password: z
    .string()
    .min(6, "Password is required and must be at least 6 chararcters long"),
});

export const CompleteProfileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  // gender: z.enum(['female', 'male', 'other'], { message: "Gender is required" }),
  gender: z.string().nonempty("Gender is required"),
  sexualPreferences: z.string().nonempty("Sexual preferences are required"),
  // sexualPreferences: z.enum(['heterosexual', 'homosexual', 'bisexual', 'other'], { message: "Sexual preference is required" }),
  biography: z.string().optional(),
  interests: z.array(z.string()).optional(),
  images: z.array(z.instanceof(File)).optional(),
  profileImageIndex: z.number().nullable().optional(),
  longitude: z.number().optional(),
  latitude: z.number().optional(),
});
