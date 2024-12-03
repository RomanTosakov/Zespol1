import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCreateInvite } from '@/lib/utils/api/hooks/Team/useCreateInvite'
import { useProjectInvites } from '@/lib/utils/api/hooks/Team/useProjectInvites'
import { useState } from 'react'

export const InvitesBlock = () => {
  const { data } = useProjectInvites()

  const [email, setEmail] = useState('')

  const addInvite = useCreateInvite()

  console.log('invites', data)
  return (
    <div className='flex flex-col gap-2 pt-4'>
      <div className='flex gap-2 border-b pb-4'>
        <Input type='email' value={email} onChange={e => setEmail(e.target.value)} placeholder='Email' />
        <Button
          isLoading={addInvite.isPending}
          onClick={() =>
            addInvite.mutate(
              { email },
              {
                onSuccess: () => {
                  setEmail('')
                }
              }
            )
          }
        >
          Send invite
        </Button>
      </div>
      {data?.map(invite => (
        <div key={invite.id} className='flex w-full items-center gap-2 rounded-md border p-4'>
          <p>{invite.email}</p>
        </div>
      ))}
    </div>
  )
}
