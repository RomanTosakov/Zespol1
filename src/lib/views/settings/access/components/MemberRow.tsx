import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TProjectMember } from '@/lib/types/org'
import { useUpdateMemberRole } from '@/lib/utils/api/hooks/Team/useUpdateMemberRole'
import { useCurrentMemberRole } from '@/lib/utils/api/hooks/Team/useCurrentMemberRole'
import { getInitials } from '@/lib/utils/string'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { LogOutIcon, Trash2Icon } from 'lucide-react'
import { useDeleteMember } from '@/lib/utils/api/hooks/Team/useDeleteMember'
import NiceModal from '@ebay/nice-modal-react'
import ConfirmDialog from '@/components/ui/confirm-dialog'
import { useGetProfile } from '@/lib/utils/api/hooks/useGetProfile'

type MemberRowProps = {
  member: TProjectMember
}

const roleOptions = [
  { value: 'member', label: 'Member' },
  { value: 'administrator', label: 'Administrator' },
  { value: 'manager', label: 'Manager' },
  { value: 'owner', label: 'Owner' },
]

export const MemberRow = ({ member }: MemberRowProps) => {
  const updateRole = useUpdateMemberRole()
  const deleteMember = useDeleteMember()
  const queryClient = useQueryClient()
  const { data: currentRole, isLoading, error } = useCurrentMemberRole()
  const { profile } = useGetProfile()
  const [localRole, setLocalRole] = useState<TProjectMember['role']>(member.role)

  const canEditRoles = currentRole?.toLowerCase() === 'administrator' || currentRole?.toLowerCase() === 'owner'
  const isTargetOwner = localRole?.toLowerCase() === 'owner'
  const isDisabled = isLoading || !currentRole || !canEditRoles || isTargetOwner
  const isSelf = profile?.id === member.profile_id

  const handleRoleChange = async (newRole: TProjectMember['role']) => {
    if (!currentRole || !canEditRoles) return

    setLocalRole(newRole)

    try {
      await updateRole.mutateAsync({
        memberId: member.id,
        role: newRole as TProjectMember['role']
      })
      
      queryClient.invalidateQueries({
        queryKey: ['members']
      })
    } catch (error) {
      console.error('Failed to update role:', error)
      setLocalRole(member.role)
    }
  }

  const handleDelete = () => {
    if ((!canEditRoles && !isSelf) || isTargetOwner) return

    NiceModal.show(ConfirmDialog, {
      title: isSelf ? 'Leave Project' : 'Remove Member',
      description: isSelf 
        ? 'Are you sure you want to leave this project? This action cannot be undone.'
        : `Are you sure you want to remove ${member.name} from the project? This action cannot be undone.`,
      confirmText: isSelf ? 'Leave' : 'Remove',
      cancelText: 'Cancel',
      variant: 'destructive',
      onConfirm: () => {
        deleteMember.mutate({
          memberId: member.id,
          profileId: member.profile_id
        })
      }
    })
  }

  return (
    <div className='grid grid-cols-4 gap-4 border-b p-4 last:border-none'>
      <div className='flex items-center gap-2'>
        <Avatar className='h-8 w-8'>
          <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
        </Avatar>
        <span>{member.name}</span>
      </div>
      <div className='flex items-center'>
        <span className='text-muted-foreground'>{member.email}</span>
      </div>
      <div>
        <Select
          value={localRole}
          onValueChange={handleRoleChange}
          disabled={isDisabled}
        >
          <SelectTrigger className='w-[180px]'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {roleOptions.map(role => (
              <SelectItem
                key={role.value}
                value={role.value}
                disabled={role.value.toLowerCase() === 'owner'}
              >
                {role.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className='flex items-center justify-end'>
        {((canEditRoles && !isTargetOwner) || (isSelf && !isTargetOwner)) && (
          <Button
            variant='ghost'
            size='icon'
            className='h-8 w-8'
            onClick={handleDelete}
          >
            {isSelf ? (
              <LogOutIcon className='h-4 w-4 text-muted-foreground hover:text-destructive' />
            ) : (
              <Trash2Icon className='h-4 w-4 text-muted-foreground hover:text-destructive' />
            )}
          </Button>
        )}
      </div>
    </div>
  )
} 