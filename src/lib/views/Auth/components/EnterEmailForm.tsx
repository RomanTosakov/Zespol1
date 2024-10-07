import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { emailSchema } from '@/lib/schemas/email'
import { TAuthSteps, TEnterEmailForm } from '@typesProj/auth'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Form } from '@/components/ui/form'

type TProps = {
  setAuthStep: (step: TAuthSteps) => void
}

export const EnterEmailForm: React.FC<TProps> = ({ setAuthStep }) => {
  const formMethods = useForm<TEnterEmailForm>({
    defaultValues: {
      email: ''
    },
    mode: 'onBlur',
    resolver: yupResolver(emailSchema)
  })

  const onSubmit = (data: TEnterEmailForm) => {
    console.log(data)
  }

  return (
    <Form {...formMethods}>
      <Card className='w-fit'>
        <CardHeader>
          <CardTitle className='text-center text-2xl'>Welcome</CardTitle>
          <CardDescription>Enter your email below to continue</CardDescription>
        </CardHeader>
        <CardContent className='grid gap-4'>
          <div className='grid gap-2'>
            <Label htmlFor='email'>Email</Label>
            <Input id='email' type='email' placeholder='m@example.com' required />
          </div>
        </CardContent>
        <CardFooter>
          <Button className='w-full'>Submit</Button>
        </CardFooter>
      </Card>
    </Form>
  )
}
