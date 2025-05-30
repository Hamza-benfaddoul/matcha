'use client'

import { useState, useTransition } from 'react'

import CardWrapper from './card-wrapper'

import * as z from 'zod'
import { ResetSchema } from '@/schemas'

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

// import { reset } from '@/actions/reset'

const ResetForm = () => {

  const [error, setError] = useState<string | undefined>('')
  const [success, setSuccess] = useState<string | undefined>('')
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = (values: z.infer<typeof ResetSchema>) => {
    setError('')
    setSuccess('')
    console.log(values);
    /*
        startTransition(() => {
          reset(values).then((data) => {
            setError(data.error)
            setSuccess(data.success)
          })
        })
        */
  }

  return (
    <CardWrapper
      headerLabel='Forgot your password!'
      backButtonLabel="Back to login"
      backButtonHref='/login'
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <div className='space-y-4'>
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
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button type='submit' disabled={isPending} className='w-full'>
            Sent reset email
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}

export default ResetForm;
