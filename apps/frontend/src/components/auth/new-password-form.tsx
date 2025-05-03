"use client";

import { useEffect, useTransition, useState } from "react";

import { Spinner } from "@/components/ui/spinner";
import CardWrapper from "./card-wrapper";

import * as z from "zod";
import { NewPasswordSchema } from "@/schemas";

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

import { useLocation } from "react-router-dom";
import { axiosPrivate } from "@/api/axios";

const NewPasswordForm = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const token = params.get("token");

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [isVerified, setIsVerified] = useState(false);

  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  useEffect(() => {
    if (success || error) return;

    if (!token) {
      setError("Missing token");
      return;
    }
    const sendVerificationToken = async () => {
      try {
        console.log("Sending verification token", token);
        const res = await axiosPrivate.post("/new-verification", { token });
        console.log("res**", res);
        setIsVerified(true);
      } catch (err) {
        setError(err?.response?.data?.error);
        setIsVerified(false);
      }
    };
    sendVerificationToken();
  }, [token, isVerified]);

  const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
    setError("");
    setSuccess("");

    const newPassword = async () => {
      try {
        const response = await axiosPrivate.post("/reset-password/confirm", {
          newPassword: values.password,
          token: token,
        });
        if (response.data.error) {
          setError(response.data.error);
        } else {
          setSuccess(response.data.message);
        }
      } catch (error) {
        console.log(error);
        //setError("An error occurred. Please try again.");
        setError(error?.response.data.error);
      }
    };
    newPassword();
  };

  return (
    <CardWrapper
      headerLabel="Reset your password"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      {!isVerified ? (
        <div className="flex items-center w-full justify-center">
          {!success && !error && <Spinner />}
          <FormSuccess message={success} />
          {!success && <FormError message={error} />}
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
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
      )}
    </CardWrapper>
  );
};

export default NewPasswordForm;
