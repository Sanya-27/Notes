import { Custom_API_RES } from './common'

export interface REQ_ADD_PAGE {
  name: string
  collectionId: number
}

export interface RES_ADD_PAGE {
  id: number
  name: string
  content: string | null
  isDeleted: 0 | 1
  collectionRef: number
}

export interface REQ_GET_PAGE_BY_ID {
  id: number
}

export type RES_GET_PAGE_BY_ID = {
  id: number
  name: string
  content: string | null
  isDeleted: 0 | 1
  collectionRef: number
}

export interface REQ_DELETE_PAGE_BY_ID {
  id: number
}

export type RES_DELETE_PAGE_BY_ID = Custom_API_RES<{
  id: number
  name: string
  content: string | null
  isDeleted: 0 | 1
  collectionRef: number
}>

export interface REQ_SAVE_PAGE {
  id: number
  content: string
}

export type RES_SAVE_PAGE = Custom_API_RES<{
  data: string
}>

export interface REQ_RENAME_PAGE {
  name: string
  id: number | null
}

export type RES_RENAME_PAGE = Custom_API_RES<{
  id: number
  name: string
  isDeleted: 0 | 1
  userRef: 1
  parent: number | null
}>

export interface REQ_MOVE_PAGE {
  id: number
  parent: number | null
}

export type RES_MOVE_PAGE = {
  code : number,
  data : string
}