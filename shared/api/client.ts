import axios from "axios"

export const client = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/`,
  timeout: 5000,
  withCredentials: true,
})
