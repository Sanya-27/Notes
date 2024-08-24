import { Custom_API_RES } from '../types/api/common'
import {
  REQ_ADD_PAGE,
  REQ_DELETE_PAGE_BY_ID,
  REQ_GET_PAGE_BY_ID,
  REQ_MOVE_PAGE,
  REQ_RENAME_PAGE,
  REQ_SAVE_PAGE,
  RES_ADD_PAGE,
  RES_DELETE_PAGE_BY_ID,
  RES_GET_PAGE_BY_ID,
  RES_MOVE_PAGE,
  RES_RENAME_PAGE,
  RES_SAVE_PAGE
} from '../types/api/page_Types'
import axiosInstance from './axiosInterface'

const ADD_PAGE = async (data: REQ_ADD_PAGE): Promise<Custom_API_RES<RES_ADD_PAGE>> => {
  try {
    return await axiosInstance()
      .post('/auth/page/add', data)
      .then((res) => res.data)
  } catch (error) {
    throw new Error(`Error adding the page: ${error}`)
  }
}

const GET_BY_PAGE_ID = async (data: REQ_GET_PAGE_BY_ID): Promise<Custom_API_RES<RES_GET_PAGE_BY_ID>> => {
  try {
    return await axiosInstance()
      .post('/auth/page/getById', data)
      .then((res) => res.data)
  } catch (error) {
    throw new Error(`Error getting the page: ${error}`)
  }
}

const DELETE_BY_PAGE_ID = async (data: REQ_DELETE_PAGE_BY_ID): Promise<Custom_API_RES<RES_DELETE_PAGE_BY_ID>> => {
  try {
    return await axiosInstance()
      .delete('/auth/page/delete', { data })
      .then((res) => res.data)
  } catch (error) {
    throw new Error(`Error deleting the page: ${error}`)
  }
}

const SAVE_PAGE = async (data: REQ_SAVE_PAGE): Promise<Custom_API_RES<RES_SAVE_PAGE>> => {
  try {
    return await axiosInstance()
      .post('/auth/page/save', data)
      .then((res) => res.data)
  } catch (error) {
    throw new Error(`Error saving the page: ${error}`)
  }
}

const RENAME_PAGE = async (data: REQ_RENAME_PAGE): Promise<Custom_API_RES<RES_RENAME_PAGE>> => {
  try {
    return await axiosInstance()
      .post('/auth/page/rename', data)
      .then((res) => res.data)
  } catch (error) {
    throw new Error(`Error renaming the page: ${error}`)
  }
}

const MOVE_PAGE = async (data: REQ_MOVE_PAGE): Promise<Custom_API_RES<RES_MOVE_PAGE>> => {
  try {
    return await axiosInstance()
      .post('/auth/page/moveById', data)
      .then((res) => res.data)
  } catch (error) {
    throw new Error(`Error moving the page by id: ${error}`)
  }
}

const PAGE_API = {
  ADD_PAGE,
  GET_BY_PAGE_ID,
  DELETE_BY_PAGE_ID,
  SAVE_PAGE,
  RENAME_PAGE,
  MOVE_PAGE
}
export default PAGE_API
