'use client'
import axios from '@/api/axios.js';
import { useNavigate } from 'react-router-dom';


import { useState, useTransition } from 'react'

import CardWrapper from './card-wrapper'

import * as z from 'zod'
import { LoginSchema } from '@/schemas'

import { Input } from '@/components/ui/input'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { FormError } from '../form-error'
import { FormSuccess } from '../form-success'

//import { login } from '@/actions/login'
import { ErrorResponse, Link, useSearchParams } from "react-router-dom";



import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp'
import useAuth from '@/hooks/useAuth';

const LoginFrom = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const urlError = searchParams.get("error") === 'OAuthAccountNotaed'
    ? 'Email alreay in use whith different profider' : ''


  const [showTwoFactor, setShowTwoFactor] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>()
  const [success, setSuccess] = useState<string | undefined>()

  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })
  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    try {
      setError('')
      setSuccess('')
      const response = await axios.post('/login', { ...values }, {
        withCredentials: true,
      });
      console.log('login respornse', response)

      const { accessToken, user } = response?.data;
      setAuth({ user: user, accessToken: accessToken });
      // Redirect to protected route after successful login
      navigate('/protected');  // Replace '/prote
    } catch (error) {
      console.log('logn error', error)
      const err = error as ErrorResponse;
      if (!err?.response) setError("No Server Response");
      else if (err.response?.status == 500)
        setError("Something went wrong please try again");
      else setError(err.response?.data?.error || "Something went wrong");
    }
  };
  /*
    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
      setError('')
      setSuccess('')
  
      axios.post('/login', {
        ...values
      })
        .then(function(response) {
          console.log(response);
        })
        .catch(function(error) {
          console.log(error);
        });
      startTransition(() => {
        login(values)
          .then((data) => {
            if (data?.error) {
              form.reset();
              setError(data.error)
            }
            if (data?.success) {
              form.reset();
              setSuccess(data.success)
            }
            if (data?.twoFactor) {
              setShowTwoFactor(true);
            }
          })
          .catch(() => setError('Something went wrong!'));
      })
    }
  */

  return (
    <CardWrapper
      headerLabel='Welcom back!'
      backButtonLabel="Don't have an account?"
      backButtonHref='/register'
      showSocial={!showTwoFactor}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <div className='space-y-4'>
            {showTwoFactor && (

              <FormField
                control={form.control}
                name='code'
                render={({ field }) => (
                  <FormItem >
                    <FormLabel>Two Factor Code</FormLabel>
                    <FormControl >
                      <InputOTP maxLength={6} {...field}>
                        < InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {!showTwoFactor && (
              <>
                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder='john.doe@example.com'
                          type='email'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder='******'
                          type='password'
                        />
                      </FormControl>
                      <Button className='px-0 font-normal' size='sm' variant='link' asChild>
                        <a href='/reset'>Forgot password</a>
                      </Button>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>
          <FormError message={error || urlError} />
          <FormSuccess message={success} />
          <Button type='submit' disabled={isPending} className='w-full'>
            {showTwoFactor ? 'Confirm' : 'Login'}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}

export default LoginFrom
