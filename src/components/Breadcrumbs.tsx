import { useRouter } from 'next/router'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage
} from './ui/breadcrumb'
import { Fragment } from 'react'
import { cn } from '@/lib/utils'

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export const Breadcrumbs: React.FC = () => {
  const router = useRouter()

  const splittedPath = router.asPath.split('/').filter(Boolean)
  const slicedPath = splittedPath.length > 1 ? splittedPath.slice(1) : splittedPath

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {slicedPath.map((path, index) => (
          <Fragment key={path}>
            <BreadcrumbItem>
              <BreadcrumbPage
                className={cn('', {
                  'text-primary': index === slicedPath.length - 1
                })}
              >
                {capitalizeFirstLetter(path)}
              </BreadcrumbPage>
            </BreadcrumbItem>
            {index < slicedPath.length - 1 && <BreadcrumbSeparator />}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
