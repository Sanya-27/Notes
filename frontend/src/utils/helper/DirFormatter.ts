import { PropsWithChildren } from 'react'

export type dataType = (CollectionType | PageType)[]

export interface CollectionType {
  id: number
  name: string
  isDeleted: 0 | 1
  userRef: number
  parent: number | null // Parent can be null for root level collections
  type: 'COLLECTION'
  children?: (CollectionType | PageType)[]
}

export interface PageType {
  id: number
  name: string
  isDeleted: 0 | 1
  content: string | null
  collectionRef: number
  type: 'PAGE'
}

export type ResultArr = (CollectionType | PageType)[]

class Directory {
  data: dataType

  constructor(data: dataType) {
    this.data = data
  }

  createObject(): ResultArr {
    const map = new Map<number, CollectionType>()
    const result: CollectionType[] = []

    this.data.forEach((item) => {
      if (item.type === 'COLLECTION') {
        const collection = item as CollectionType
        map.set(collection.id, { ...collection, children: [] })
      }
    })

    this.data.forEach((item) => {
      if (item.type === 'PAGE') {
        const page = item as PageType
        if (map.has(page.collectionRef)) {
          map.get(page.collectionRef)?.children?.push(page)
        }
      } else if (item.type === 'COLLECTION') {
        const collection = item as CollectionType
        if (collection.parent) {
          map.get(collection.parent)?.children?.push(map.get(collection.id)!)
        } else {
          result.push(map.get(collection.id)!)
        }
      }
    })

    return result
  }
}

export default Directory
