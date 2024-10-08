import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { signInSchema } from '@/lib/schemas/signIn'
import { TAuthSteps, TSignInForm } from '@/lib/types/auth'
import { useSignIn } from '@/lib/utils/api/hooks/Auth/useSignIn'
import { yupResolver } from '@hookform/resolvers/yup'
import { ArrowLeft } from 'lucide-react'
import Head from 'next/head'
import { useForm } from 'react-hook-form'

type TProps = {
  setAuthStep: (step: TAuthSteps) => void
  email: string
}

export const SignInForm: React.FC<TProps> = ({ setAuthStep, email }) => {
  const formMethods = useForm<TSignInForm>({
    defaultValues: {
      password: '',
      email
    },
    mode: 'onBlur',
    resolver: yupResolver(signInSchema)
  })

  const signIn = useSignIn()

  const onSubmit = (data: TSignInForm) => {
    signIn.mutate(data)
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
              <span>Sign In</span>
            </CardTitle>
            <CardDescription>Enter password to sign in.</CardDescription>
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
            <Button isLoading={signIn.isPending} type='submit' className='w-full'>
              Sign in
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
