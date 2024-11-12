type TProps = {
  projectSlug: string
}

export const useNavItems = ({ projectSlug }: TProps) => {
  return [
    {
      label: 'Team',
      href: `/projects/${projectSlug}/team`
    },
    {
      label: 'Boards',
      href: `/projects/${projectSlug}/boards`
    },
    {
      label: 'Setting',
      href: `/projects/${projectSlug}/settings`
    }
  ]
}
