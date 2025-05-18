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
  password: z.string({ message: "Password is required" }),
});

export const RegisterSchema = z.object({
  firstName: z.string().min(1, { message: "Frist name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  userName: z.string().min(1, { message: "Last name is required" }),
  birth_date: z.date({
    required_error: "A date of birth is required.",
  }),
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
  birth_date: z
    .string({
      required_error: "A date of birth is required.",
    })
});

export const ChangePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, { message: "Current password is required" }),
    newPassword: z.string().min(6, {
      message: "Password is required and must be at least 6 characters long",
    }),
    confirmNewPassword: z.string().min(6, {
      message: "Password is required and must be at least 6 characters long",
    }),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ["confirmNewPassword"],
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: "New password cannot be the same as the current password",
    path: ["newPassword"],
  });
