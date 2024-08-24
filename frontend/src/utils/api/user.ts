import { Custom_API_RES } from '../types/api/common'
import { RES_USER_PROFILE } from '../types/api/user'
import axiosInstance from './axiosInterface'

const GET_PROFILE = async (): Promise<Custom_API_RES<RES_USER_PROFILE>> => {
  try {
    return await axiosInstance()
      .get('/auth/user/profile')
      .then((res) => res.data)
  } catch (error) {
    throw new Error(`Error fetching the user: ${error}`)
  }
}

const USER_API = {
  GET_PROFILE
}
export default USER_API
