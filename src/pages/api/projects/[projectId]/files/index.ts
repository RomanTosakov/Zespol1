import { TApiError, TSupabaseClient } from '@/lib/types/api'
import { TFile } from '@/lib/types/file'
import { createServerSupabase } from '@/lib/utils/supabase/createServerSupabase'
import formidable from 'formidable'
import fs from 'fs'
import { NextApiRequest, NextApiResponse } from 'next'
import { v4 as uuidv4 } from 'uuid'

export const config = {
  api: {
    bodyParser: false
  }
}
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabase(req, res)

  const { method } = req
  try {
    switch (method) {
      case 'POST':
        return await handlePOST(req, res, supabase)
      default:
        res.setHeader('Allow', ['POST'])

        return res.status(405).end(`Method ${method} Not Allowed`)
    }
  } catch (error) {
    return res.status(500).json({ error })
  }
}

const handlePOST = async (req: NextApiRequest, res: NextApiResponse, supabase: TSupabaseClient) => {
  try {
    const { projectId, taskId } = req.query as {
      projectId: string
      taskId: string
    }

    const form = formidable({})

    type TRespData = {
      id: TFile['id']
      url: TFile['file_url']
    }

    await new Promise<TRespData>((resolve, reject) => {
      form.parse(req, async (err, fields, files) => {
        console.log('fields:', fields)
        console.log('files:', files)

        const file = files.file?.[0]

        console.log('file:', file)

        if (!file) {
          const errorData: TApiError = {
            status: 400,
            message: 'File is required'
          }

          throw errorData
        }

        const fileBuffer = await fs.readFileSync(file.filepath)

        if (!file) {
          const errorData: TApiError = {
            status: 400,
            message: 'File is required'
          }

          throw errorData
        }
        const fileId = uuidv4()

        const filePath = `${projectId}/${taskId}/${fileId}`

        const { data, error } = await supabase.storage.from('files').upload(filePath, fileBuffer, {
          contentType: file.mimetype || 'application/pdf'
        })

        if (error) {
          throw error
        }

        const { data: signUrl, error: signError } = await supabase.storage
          .from('files')
          // !! never expires
          .createSignedUrl(filePath, 3153600000)

        const { data: downloadUrl, error: downloadError } = await supabase.storage
          .from('files')
          .createSignedUrl(filePath, 3153600000, {
            download: true
          })

        if (signError || downloadError) {
          throw signError || downloadError
        }

        const url =
          process.env.NODE_ENV === 'development'
            ? signUrl?.signedUrl.replace('localhost', '127.0.0.1')
            : signUrl?.signedUrl

        const downloadUrlFormatted =
          process.env.NODE_ENV === 'development'
            ? downloadUrl.signedUrl.replace('localhost', '127.0.0.1')
            : downloadUrl.signedUrl

        const { data: fileData, error: fileError } = await supabase
          .from('task_files')
          .insert({
            project_id: projectId,
            task_id: taskId,
            file_url: filePath,
            file_name: file.originalFilename || '',
            overview_url: url || '',
            download_url: downloadUrlFormatted || ''
          })
          .select('*')
          .single()

        if (!fileData) {
          throw fileError
        }

        resolve({ id: fileData.id, url: url })
      })
    })

    return res.status(200).json({
      data: 'ok'
    })
  } catch (error) {
    const errorData = error as TApiError

    console.error(error)

    return res.status(errorData.status).json({ error: errorData.message })
  }
}
