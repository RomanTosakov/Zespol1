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
  const queryClient = useQueryClient()
  const { data: currentRole, isLoading, error } = useCurrentMemberRole()
  const [localRole, setLocalRole] = useState<TProjectMember['role']>(member.role)

  console.log('MemberRow State:', {
    currentRole,
    memberRole: member.role,
    isLoading,
    error,
    member
  })

  const canEditRoles = currentRole?.toLowerCase() === 'administrator' || currentRole?.toLowerCase() === 'owner'
  const isTargetOwner = localRole?.toLowerCase() === 'owner'
  const isDisabled = isLoading || !currentRole || !canEditRoles || isTargetOwner

  const handleRoleChange = async (newRole: TProjectMember['role']) => {
    if (!currentRole || !canEditRoles) return

    setLocalRole(newRole)

    try {
      await updateRole.mutateAsync({
        memberId: member.id,
        role: newRole as TProjectMember['role']
      })
      
      // Обновляем кэш после успешного обновления
      queryClient.invalidateQueries({
        queryKey: ['members']
      })
    } catch (error) {
      console.error('Failed to update role:', error)
      // Возвращаем предыдущую роль в случае ошибки
      setLocalRole(member.role)
    }
  }

  return (
    <div className='grid grid-cols-3 gap-4 border-b p-4 last:border-none'>
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
    </div>
  )
} 