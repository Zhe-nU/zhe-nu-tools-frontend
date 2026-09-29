import axios, { AxiosError, AxiosRequestConfig } from "axios"

export const client = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/`,
  timeout: 5000,
  withCredentials: true,
})

export const AXIOS_INSTANCE = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}`,
  withCredentials: true,
})

AXIOS_INSTANCE.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
)

AXIOS_INSTANCE.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) window.location.href = "/login"

    return Promise.reject(error)
  }
)

export const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig
): Promise<T> => {
  const promise = AXIOS_INSTANCE({
    ...config,
    ...options,
  }).then(({ data }) => data)

  return promise
}

export type ErrorType<Error> = AxiosError<Error>

export type BodyType<BodyData> = BodyData
