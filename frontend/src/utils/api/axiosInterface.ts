import axios from 'axios'
import { getCookieByName } from '../cookie'

const axiosInstance = () => {
  const token = getCookieByName('token')

  return axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
    timeout: 10000,
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export default axiosInstance
