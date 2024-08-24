export const toggleChildrenVisibility = (
  collectionId: number,
  isSelect: boolean,
  setSelected: React.Dispatch<React.SetStateAction<Array<number>>>,
  setVisibleChildren: React.Dispatch<React.SetStateAction<Set<number>>>
) => {
  console.log(isSelect)
  if (isSelect) {
    setSelected((prev) => {
      if (prev.includes(collectionId)) {
        return prev.filter((item) => item !== collectionId)
      } else {
        return [...prev, collectionId]
      }
    })
  } else {
    let prevData = JSON.parse(localStorage.getItem('data') || '[]')
    setVisibleChildren((prev) => {
      const newVisibleChildren = new Set(prev)
      if (newVisibleChildren.has(collectionId)) {
        newVisibleChildren.delete(collectionId)
      } else {
        newVisibleChildren.add(collectionId)
      }
      return newVisibleChildren
    })
    let resData: any[] = []
    prevData.forEach((ele: any) => {
      if (ele.type === 'COLLECTION') {
        if (ele.parent !== collectionId) {
          resData.push(ele)
        }
      } else if (ele.type === 'PAGE') {
        if (ele.collectionRef !== collectionId) {
          resData.push(ele)
        }
      }
    })
    console.log(resData)
    localStorage.setItem('data', JSON.stringify(resData))
  }
}

export const toggleSelect = (setIsSelect: React.Dispatch<React.SetStateAction<boolean>>) => {
  setIsSelect((prev) => !prev)
}

export const toggleMenuVisibility = (
  collectionId: number,
  setMenuVisibility: React.Dispatch<React.SetStateAction<Record<number, boolean>>>
) => {
  setMenuVisibility((prev) => ({
    ...prev,
    [collectionId]: !prev[collectionId]
  }))
}

export const toggleInputVisibility = (
  collectionId: number,
  type: string,
  setMenuVisibility: React.Dispatch<React.SetStateAction<Record<number, boolean>>>,
  setInputVisible: React.Dispatch<React.SetStateAction<Record<number, boolean>>>,
  setType: React.Dispatch<React.SetStateAction<string>>
) => {
  setInputVisible((prev) => ({
    ...prev,
    [collectionId]: !prev[collectionId]
  }))
  setMenuVisibility((prev) => ({
    ...prev,
    [collectionId]: !prev[collectionId]
  }))
  setType(type)
}

export const toggleRenameVisibility = (collectionId: number, setRename: React.Dispatch<React.SetStateAction<Record<number, boolean>>>) => {
  setRename((prev) => ({
    ...prev,
    [collectionId]: !prev[collectionId]
  }))
}
