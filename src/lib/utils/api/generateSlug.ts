import slugify from 'slugify'

slugify.extend({ и: 'y' })
slugify.extend({ И: 'y' })

export const generateSlug = (str: string) => slugify(str, { remove: /[*+~.()'"!:@]/g, lower: true, strict: true })
