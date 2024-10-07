import { ObjectSchema, ValidationError } from 'yup'
import { SupabaseClient } from '@supabase/supabase-js'
import { NextApiRequest, NextApiResponse } from 'next/types'

type TParams = {
  schema: ObjectSchema<any>
  req: NextApiRequest
  res: NextApiResponse
  supabase: SupabaseClient
  handler: (req: NextApiRequest, res: NextApiResponse, supabase: SupabaseClient) => Promise<void>
}

export const ValidateForm = async ({ schema, req, res, handler, supabase }: TParams) => {
  try {
    const parsedForm = await schema.validate(req.body.formData)
    req.body.formData = parsedForm

    return handler(req, res, supabase)
  } catch (e) {
    if (e instanceof ValidationError) {
      return res.status(422).json({ errors: e })
    } else {
      return res.status(500).json({ error: e })
    }
  }
}
