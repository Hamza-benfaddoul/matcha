import { useState, useTransition } from "react";

import CardWrapper from "./card-wrapper";

import * as z from "zod";
import { ChangePasswordSchema } from "@/schemas";

import { Input } from "@/components/ui/input";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";

import { axiosPrivate } from "@/api/axios";
import useAuth from "@/hooks/useAuth";

const ChangePasswordForm: React.FC = () => {
  const { auth } = useAuth();
  const [changePasswordStatus, setChangePasswordStatus] = useState<
    "loading" | "success" | "error"
  >("loading");
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof ChangePasswordSchema>>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof ChangePasswordSchema>) => {
    setError("");
    setSuccess("");
    // if (values.newPassword !== values.confirmPassword) {
    //   setError("Passwords do not match");
    //   return;
    // } else if (values.password === values.currentPassword) {
    //   setError("New password cannot be the same as the current password");
    //   return;
    // }
    startTransition(async () => {
      try {
        console.log("values", values);
        await axiosPrivate.post(`change-password/`, {
          ...values,
          email: auth.user.email,
        });
        setSuccess("Password changed successfully");
        setChangePasswordStatus("success");
        // router.push('/dashboard')
      } catch (error: any) {
        console.error(error);
        if (error.response.data.error === "Current password is incorrect.")
          setError("Current password is incorrect.");
        else setError("Failed to reset password: ");
      }
    });
  };

  return changePasswordStatus === "success" ? (
    <CardWrapper
      headerLabel="Enter a new password"
      backButtonLabel="Go back to dashboard"
      backButtonHref="/dashboard"
    >
      <FormSuccess message={success} />
    </CardWrapper>
  ) : (
    <CardWrapper
      headerLabel="Enter a new password"
      backButtonLabel=""
      backButtonHref="/dashboard"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="******"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="******"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="confirmNewPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="******"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button type="submit" disabled={isPending} className="w-full">
            Reset password
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default ChangePasswordForm;
