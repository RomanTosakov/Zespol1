export const PublicLayout: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return <div className='h-dvh w-full bg-card'>{children}</div>
}
