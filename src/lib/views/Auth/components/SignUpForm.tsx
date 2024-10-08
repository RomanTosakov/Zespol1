import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { signUpSchema } from '@/lib/schemas/signUp'
import { TAuthSteps, TSignUpForm } from '@/lib/types/auth'
import { useSignUp } from '@/lib/utils/api/hooks/Auth/useSignUp'
import { yupResolver } from '@hookform/resolvers/yup'
import Head from 'next/head'
import { useForm } from 'react-hook-form'
import { ArrowLeft } from 'lucide-react'

type TProps = {
  setAuthStep: (step: TAuthSteps) => void
  email: string
}

export const SignUpForm: React.FC<TProps> = ({ setAuthStep, email }) => {
  const formMethods = useForm<TSignUpForm>({
    defaultValues: {
      full_name: '',
      password: '',
      email
    },
    mode: 'onBlur',
    resolver: yupResolver(signUpSchema)
  })

  const signUp = useSignUp()

  const onSubmit = (data: TSignUpForm) => {
    signUp.mutate(data)
  }

  return (
    <Form {...formMethods}>
      <Head>
        <title>Fill form</title>
      </Head>
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>
        <Card className='w-fit'>
          <CardHeader className='text-center'>
            <CardTitle className='relative text-2xl'>
              <Button
                variant={'ghost'}
                className='absolute left-0 top-0 px-0 hover:bg-popover'
                onClick={() => {
                  setAuthStep('enter-email')
                }}
              >
                <ArrowLeft></ArrowLeft>
              </Button>
              <span>Sign up</span>
            </CardTitle>
            <CardDescription>Fill the form below to sign up.</CardDescription>
          </CardHeader>
          <CardContent className='grid gap-4'>
            <div className='grid gap-2'>
              <FormField
                control={formMethods.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <Input value={field.value} disabled />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={formMethods.control}
                name='full_name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <Input autoComplete='name' {...field} placeholder='Jakub Jakubowski' />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={formMethods.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <Input {...field} autoComplete='new-password' type='password' placeholder='********' />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button isLoading={signUp.isPending} type='submit' className='w-full'>
              Sign up
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
