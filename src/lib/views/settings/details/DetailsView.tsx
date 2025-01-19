import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useGetProjectId } from '@/lib/hooks/useGetProjectId'
import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { useUser } from '@/lib/utils/api/hooks/useUser'
import { useGetProject } from '@/lib/utils/api/hooks/useGetProject'
import { Skeleton } from '@/components/ui/skeleton'
import Head from 'next/head'
import { useCurrentMemberRole } from '@/lib/utils/api/hooks/Team/useCurrentMemberRole'
import { useUpdateProject } from '@/lib/utils/api/hooks/useUpdateProject'
import { useProjectTeam } from '@/lib/utils/api/hooks/Team/useProjectTeam'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { generateSlug } from '@/lib/utils/api/generateSlug'
import { useRouter } from 'next/router'
import { useDeleteProject } from '@/lib/utils/api/hooks/useDeleteProject'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

type TProjectDetailsForm = {
  name: string
  slug: string
  primary_owner: string
}

export const DetailsView = () => {
  const router = useRouter()
  const projectId = useGetProjectId()
  const { data: project, isLoading } = useGetProject()
  const { data: user } = useUser()
  const { data: role } = useCurrentMemberRole()
  const { data: members } = useProjectTeam()
  const updateProject = useUpdateProject()
  const deleteProject = useDeleteProject()
  const [isEditing, setIsEditing] = useState(false)

  const canEdit = ['administrator', 'owner'].includes(role || '')

  const formMethods = useForm<TProjectDetailsForm>({
    defaultValues: {
      name: '',
      slug: '',
      primary_owner: ''
    }
  })

  useEffect(() => {
    if (project) {
      formMethods.reset({
        name: project.name,
        slug: project.slug.toUpperCase(),
        primary_owner: project.primary_owner
      })
    }
  }, [project, formMethods])

  const onSubmit = (data: TProjectDetailsForm) => {
    if (!project) return

    const newSlug = generateSlug(data.slug).toUpperCase().slice(0, 10)
    const oldSlug = project.slug
    updateProject.mutate(
      {
        ...project,
        ...data,
        slug: newSlug
      },
      {
        onSuccess: () => {
          setIsEditing(false)
          if (oldSlug !== newSlug) {
            router.push(`/projects/${newSlug}/settings/details`)
          }
        }
      }
    )
  }

  if (isLoading) {
    return (
      <div className='flex w-full flex-col gap-4 p-16'>
        <div className='flex items-center justify-between'>
          <h1 className='text-2xl font-semibold'>Project Details</h1>
        </div>

        <Card className='w-full p-6'>
          <div className='flex flex-col gap-4'>
            <Skeleton className='h-8 w-full' />
            <Skeleton className='h-8 w-full' />
            <Skeleton className='h-8 w-full' />
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className='flex w-full flex-col gap-4 p-16'>
      <Head>
        <title>Project Details</title>
      </Head>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-semibold'>Project Details</h1>
        {canEdit && !isEditing && (
          <Button onClick={() => setIsEditing(true)} variant='outline'>
            Edit
          </Button>
        )}
      </div>

      <Card className='w-full p-6'>
        <Form {...formMethods}>
          <form onSubmit={formMethods.handleSubmit(onSubmit)} className='flex flex-col gap-4'>
            <FormField
              control={formMethods.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <Input {...field} disabled={!isEditing} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={formMethods.control}
              name='slug'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Key</FormLabel>
                  <Input 
                    {...field} 
                    disabled={!isEditing}
                    maxLength={10}
                    value={field.value.toUpperCase()}
                    onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={formMethods.control}
              name='primary_owner'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Lead</FormLabel>
                  {isEditing ? (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue>
                          {members?.find(m => m.profile_id === field.value)?.name || 'Select a lead'}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {members?.map(member => (
                          <SelectItem key={member.profile_id} value={member.profile_id}>
                            {member.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input value={members?.find(m => m.profile_id === field.value)?.name || ''} disabled={true} />
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {isEditing && (
              <div className='flex justify-end gap-2'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => {
                    setIsEditing(false)
                    if (project) {
                      formMethods.reset({
                        name: project.name,
                        slug: project.slug.toUpperCase(),
                        primary_owner: project.primary_owner
                      })
                    }
                  }}
                >
                  Cancel
                </Button>
                <Button type='submit' isLoading={updateProject.isPending}>
                  Save
                </Button>
              </div>
            )}
          </form>
        </Form>
      </Card>

      {canEdit && (

            <div className='flex items-center justify-between rounded-lg border border-destructive p-4'>
              <div>
                <h3 className='font-medium'>Delete Project</h3>
                <p className='text-sm text-muted-foreground'>
                  Once you delete a project, there is no going back. Please be certain.
                </p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Delete Project</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the project
                      and all associated data including tasks, files, and team members.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={() => deleteProject.mutate()}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {deleteProject.isPending ? "Deleting..." : "Delete Project"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

      )}
    </div>
  )
}