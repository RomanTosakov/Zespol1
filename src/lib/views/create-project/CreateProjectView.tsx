import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { orgSchema } from '@/lib/schemas/orgSchema'
import { TOrgForm } from '@/lib/types/org'
import { useCreateProject } from '@/lib/utils/api/hooks/useCreateProject'
import { yupResolver } from '@hookform/resolvers/yup'
import Head from 'next/head'
import { useForm } from 'react-hook-form'

export const CreateProjectView = () => {
  const formMethods = useForm<TOrgForm>({
    defaultValues: {
      name: ''
    },
    mode: 'onBlur',
    resolver: yupResolver(orgSchema)
  })

  const createOrg = useCreateProject()

  const onSubmit = (data: TOrgForm) => {
    createOrg.mutate(data)
  }

  return (
    <div className='flex h-full items-center justify-center'>
      <Form {...formMethods}>
        <Head>
          <title>Create project</title>
        </Head>
        <form onSubmit={formMethods.handleSubmit(onSubmit)}>
          <Card className='w-fit'>
            <CardHeader className='text-center'>
              <CardTitle className='relative text-2xl'>
                <span>Create project</span>
              </CardTitle>
              <CardDescription>Enter name</CardDescription>
            </CardHeader>
            <CardContent className='grid gap-4'>
              <div className='grid gap-2'>
                <FormField
                  control={formMethods.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <Input value={field.value} onChange={field.onChange} placeholder='Project name' />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button isLoading={createOrg.isPending} type='submit' className='w-full'>
                Create
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  )
}
