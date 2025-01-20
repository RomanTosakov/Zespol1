import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCreateInvite } from '@/lib/utils/api/hooks/Team/useCreateInvite'
import { useProjectInvites } from '@/lib/utils/api/hooks/Team/useProjectInvites'
import { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TProjectRole } from '@/lib/types/org'

type TInviteRole = Exclude<TProjectRole, 'owner'>

const ROLE_OPTIONS: { value: TInviteRole; label: string }[] = [
  { value: 'member', label: 'Member' },
  { value: 'administrator', label: 'Administrator' },
  { value: 'manager', label: 'Manager' }
]

export const InvitesBlock = () => {
  const { data } = useProjectInvites()

  const [email, setEmail] = useState('')
  const [role, setRole] = useState<TInviteRole>('member')

  const addInvite = useCreateInvite()

  console.log('invites', data)
  return (
    <div className='flex flex-col gap-2 pt-4'>
      <div className='flex gap-2 border-b pb-4'>
        <div className='flex flex-1 gap-2'>
          <Input 
            type='email' 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            placeholder='Email' 
            className='flex-1'
          />
          <Select value={role} onValueChange={(value: TInviteRole) => setRole(value)}>
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              {ROLE_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          isLoading={addInvite.isPending}
          onClick={() =>
            addInvite.mutate(
              { email, role },
              {
                onSuccess: () => {
                  setEmail('')
                  setRole('member')
                }
              }
            )
          }
        >
          Send invite
        </Button>
      </div>
      {data?.map(invite => (
        <div key={invite.id} className='flex w-full items-center justify-between gap-2 rounded-md border p-4'>
          <p>{invite.email}</p>
          <span className='text-sm text-muted-foreground capitalize'>{invite.role}</span>
        </div>
      ))}
    </div>
  )
}
