import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export const AuthView = () => {
  return (
    <div className='flex h-full items-center justify-center'>
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
    </div>
  )
}
