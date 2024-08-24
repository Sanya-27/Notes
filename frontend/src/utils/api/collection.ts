import { ResultArr } from '../helper/DirFormatter'
import {
  REQ_ADD_COLLECTION,
  REQ_ALL_COLLECTION_BY_PARENT_ID,
  REQ_COLLECTION_BY_ID,
  REQ_COLLECTION_BY_NAME,
  REQ_COLLECTION_BY_PARENT_ID,
  REQ_MOVE_COLLECTION,
  REQ_RENAME_COLLECTION,
  RES_ADD_COLLECTION,
  RES_ALL_COLLECTION_BY_PARENT_ID,
  RES_COLLECTION_BY_ID,
  RES_COLLECTION_BY_NAME,
  RES_COLLECTION_BY_PARENT_ID,
  RES_DELETE_COLLECTION_BY_ID,
  RES_MOVE_COLLECTION,
  RES_RENAME_COLLECTION
} from '../types/api/collection_Types'
import { Custom_API_RES } from '../types/api/common'
import axiosInstance from './axiosInterface'
import { REQ_DELETE_COLLECTION_BY_ID } from '../types/api/collection_Types'

const ADD = async (data: REQ_ADD_COLLECTION): Promise<Custom_API_RES<RES_ADD_COLLECTION>> => {
  try {
    return await axiosInstance()
      .post('/auth/collection/add', data)
      .then((res) => res.data)
  } catch (error) {
    throw new Error(`Error adding the collection: ${error}`)
  }
}

const Get_By_ID = async (data: REQ_COLLECTION_BY_ID): Promise<Custom_API_RES<RES_COLLECTION_BY_ID>> => {
  try {
    return await axiosInstance()
      .post('/auth/collection/getById', data)
      .then((res) => res.data)
  } catch (error) {
    throw new Error(`Error fetching the collection by id: ${error}`)
  }
}

const Get_By_Parent_ID = async (data: REQ_COLLECTION_BY_PARENT_ID): Promise<Custom_API_RES<RES_COLLECTION_BY_PARENT_ID>> => {
  try {
    return await axiosInstance()
      .post('/auth/collection/getByParentId', data)
      .then((res) => res.data)
  } catch (error) {
    throw new Error(`Error fetching the collection by parent id: ${error}`)
  }
}

const Get_All_By_Parent_ID = async (data: REQ_ALL_COLLECTION_BY_PARENT_ID): Promise<Custom_API_RES<ResultArr>> => {
  try {
    return await axiosInstance()
      .post('/auth/collection/getAllByParentId', data)
      .then((res) => res.data)
  } catch (error) {
    throw new Error(`Error fetching the collection by parent id: ${error}`)
  }
}

const DELETE_COLLECTION_BY_ID = async (data: REQ_DELETE_COLLECTION_BY_ID): Promise<Custom_API_RES<RES_DELETE_COLLECTION_BY_ID>> => {
  try {
    return await axiosInstance()
      .delete('/auth/collection/delete', { data })
      .then((res) => res.data)
  } catch (error) {
    throw new Error(`Error deleting the collection by id: ${error}`)
  }
}

const RENAME_COLLECTION = async (data: REQ_RENAME_COLLECTION): Promise<Custom_API_RES<RES_RENAME_COLLECTION>> => {
  try {
    return await axiosInstance()
      .post('/auth/collection/rename', data)
      .then((res) => res.data)
  } catch (error) {
    throw new Error(`Error renaming the collection by id: ${error}`)
  }
}

const MOVE_COLLECTION = async (data: REQ_MOVE_COLLECTION): Promise<Custom_API_RES<RES_MOVE_COLLECTION>> => {
  try {
    return await axiosInstance()
      .post('/auth/collection/moveById', data)
      .then((res) => res.data)
  } catch (error) {
    throw new Error(`Error moving the collection by id: ${error}`)
  }
}

const GET_COLLECTION_BY_NAME = async (data: REQ_COLLECTION_BY_NAME): Promise<RES_COLLECTION_BY_NAME> => {
  try {
    return await axiosInstance()
      .post('/auth/collection/getAllByName', data)
      .then((res) => res.data)
  } catch (error) {
    throw new Error(`Error fetching the collection by name: ${error}`)
  }
}

const COLLECTION_API = {
  ADD,
  Get_By_ID,
  Get_By_Parent_ID,
  Get_All_By_Parent_ID,
  DELETE_COLLECTION_BY_ID,
  RENAME_COLLECTION,
  MOVE_COLLECTION,
  GET_COLLECTION_BY_NAME
}
export default COLLECTION_API
