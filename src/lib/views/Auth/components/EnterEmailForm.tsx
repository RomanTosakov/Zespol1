import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { enterEmailSchema } from '@/lib/schemas/enterEmail'
import { useCheckEmail } from '@/lib/utils/api/hooks/Auth/useCheckEmail'
import { yupResolver } from '@hookform/resolvers/yup'
import { TAuthSteps, TEnterEmailForm } from '@typesProj/auth'
import Head from 'next/head'
import { useForm } from 'react-hook-form'

type TProps = {
  setAuthStep: (step: TAuthSteps) => void
}

export const EnterEmailForm: React.FC<TProps> = ({ setAuthStep }) => {
  const formMethods = useForm<TEnterEmailForm>({
    defaultValues: {
      email: ''
    },
    mode: 'onBlur',
    resolver: yupResolver(enterEmailSchema)
  })

  const checkEmail = useCheckEmail()

  const onSubmit = (data: TEnterEmailForm) => {
    console.log(data)
    checkEmail.mutate(data)
  }

  return (
    <Form {...formMethods}>
      <Head>
        <title>Enter Email</title>
      </Head>
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>
        <Card className='w-fit'>
          <CardHeader>
            <CardTitle className='text-center text-2xl'>Welcome</CardTitle>
            <CardDescription>Enter your email below to continue</CardDescription>
          </CardHeader>
          <CardContent className='grid gap-4'>
            <div className='grid gap-2'>
              <FormField
                control={formMethods.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <Input {...field} placeholder='qwe@example.com' />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button isLoading={checkEmail.isPending} type='submit' className='w-full'>
              Submit
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
