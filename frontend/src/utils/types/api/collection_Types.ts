import { Custom_API_RES } from './common'
import { REQ_DELETE_PAGE_BY_ID } from './page_Types'
import data from '../../../components/data'

export interface REQ_ADD_COLLECTION {
  name: string
  parent: number | null
}
export interface RES_ADD_COLLECTION {
  id: number
  name: string
  isDeleted: 0 | 1
  userRef: number
  parent: null | number
}

export interface REQ_COLLECTION_BY_ID {
  id: number | null
}
export type RES_COLLECTION_BY_ID = Custom_API_RES<{
  id: number
  name: string
  isDeleted: 0 | 1
  userRef: number
  parent: null | number
}>

export interface REQ_COLLECTION_BY_PARENT_ID {
  parent: number | null
}
export type RES_COLLECTION_BY_PARENT_ID = Custom_API_RES<{
  id: number
  name: string
  isDeleted: 0 | 1
  userRef: number
  parent: null | number
}>

export interface REQ_ALL_COLLECTION_BY_PARENT_ID {
  parent: number | null
}
export type RES_ALL_COLLECTION_BY_PARENT_ID = Custom_API_RES<{
  id: number
  name: string
  isDeleted: 0 | 1
  userRef: number
  parent: null | number
}>

export interface REQ_DELETE_COLLECTION_BY_ID {
  id: number
}

export type RES_DELETE_COLLECTION_BY_ID = Custom_API_RES<{
  status: string
}>

export interface REQ_RENAME_COLLECTION {
  name: string
  id: number | null
}

export type RES_RENAME_COLLECTION = Custom_API_RES<{
  id: number
  name: string
  isDeleted: 0 | 1
  userRef: number
  parent: number | null
}>

export interface REQ_MOVE_COLLECTION {
  id: number
  parent: number | null
}

export type RES_MOVE_COLLECTION = {
  code: number
  data: string
}

export interface REQ_COLLECTION_BY_NAME {
  name: string
}

export type RES_COLLECTION_BY_NAME = Custom_API_RES<{
  id: number
  name: string
  isDeleted: 0 | 1
  userRef: number
  parent: number | null
}>
