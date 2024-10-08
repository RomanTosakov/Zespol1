import { default as AxiosInstance, AxiosResponse, AxiosError } from 'axios'

export const axios = AxiosInstance.create({
  baseURL: '/api',
  headers: {
    'Content-type': 'application/json'
  }
})

type TErrorData = {
  message: string
  code: string
  traceId: string
  level: string
}

export class CustomAxiosError extends AxiosError {
  errorData: TErrorData
  override code?: string
  override request?: any
  override response?: AxiosResponse

  constructor(errorData: TErrorData, message: string, code?: string, request?: any, response?: AxiosResponse) {
    super(message)
    this.errorData = errorData
    this.code = code
    this.request = request
    this.response = response
  }
}

axios.interceptors.response.use(
  response => {
    if (!response.data) {
      const errorData = {
        message: 'Error occurred',
        code: 'NO_CODE',
        traceId: 'NO_TRACE_ID',
        level: 'NO_LEVEL'
      }

      return Promise.reject(new CustomAxiosError(errorData, 'Server error', String(response.status), response.request))
    }

    return Promise.resolve(response.data)
  },
  async error => {
    if (error?.response?.status === 401) {
      if (typeof window !== 'undefined' && window?.location) {
        window.location?.reload()
      }
    }

    return Promise.reject({
      data: error.response?.data,
      status: error.response?.status,
      statusText: error.response?.statusText
    })
  }
)
