import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { TAuthSteps } from '@typesProj/auth'

type TProps = {
  setAuthStep: (step: TAuthSteps) => void
}

export const EnterEmailForm: React.FC<TProps> = ({ setAuthStep }) => {
  return (
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
  )
}
