import React, { useState, useCallback, useEffect, useRef } from 'react'
import Directory from '../utils/helper/DirFormatter'
import { dataType, ResultArr, CollectionType, PageType } from '../utils/helper/DirFormatter'
import { FaFolder, FaFolderOpen } from 'react-icons/fa'
import { FaNoteSticky } from 'react-icons/fa6'
import { FaRegNoteSticky } from 'react-icons/fa6'
import { FaTrash } from 'react-icons/fa'
import { FaXmark } from 'react-icons/fa6'
import { TiTick } from 'react-icons/ti'
import { ImMenu, ImCross } from 'react-icons/im'
import 'react-tooltip/dist/react-tooltip.css'
import COLLECTION_API from '../utils/api/collection'
import PAGE_API from '../utils/api/page'
import { Toast } from '../utils/alert/sweetAlert2'
import { MdDeleteOutline } from 'react-icons/md'
import { Link, useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { BiSolidSelectMultiple } from 'react-icons/bi'
import { IoIosClose } from 'react-icons/io'
import {
  toggleSelect,
  toggleMenuVisibility,
  toggleInputVisibility,
  toggleChildrenVisibility,
  toggleRenameVisibility
} from '../utils/helper/ToggleFunctions'
import { Tooltip } from 'react-tooltip'

const DirectoryMap: any = (dataa: ResultArr) => {
  const [data, setData] = useState<ResultArr>(dataa)
  const [structuredData, setStructuredData] = useState<ResultArr>([])
  const [menuVisibility, setMenuVisibility] = useState<Record<number, boolean>>({})
  const [rename, setRename] = useState<Record<number, boolean>>({})
  const [type, setType] = useState<string>('')
  const [visibleChildren, setVisibleChildren] = useState<Set<number>>(
    localStorage.getItem('visibleChildren') ? new Set(JSON.parse(localStorage.getItem('visibleChildren') as string)) : new Set()
  )
  const [inputVisible, setInputVisible] = useState<Record<number, boolean>>({})
  const input = useRef<Record<number, HTMLInputElement | null>>({})
  const renameRef = useRef<HTMLInputElement>(null)
  const [isSelect, setIsSelect] = useState<boolean>(false)
  const [selected, setSelected] = useState<Array<number>>(new Array())
  const navigate = useNavigate()

  const pageId = Number(useParams().id ?? -1)
  const pageName = String(useParams().page_name ?? '')

  useEffect(() => {
    if (pageId === -1) {
      COLLECTION_API.Get_All_By_Parent_ID({ parent: null }).then((res) => {
        setData(res.data)
      })
      localStorage.removeItem('data')
    } else {
      console.log('PageId', pageId)
    }
  }, [pageId, pageName])

  useEffect(() => {
    if (localStorage.getItem('data') && pageId !== -1) {
      setData(JSON.parse(localStorage.getItem('data') as string))
    }
  }, [localStorage.getItem('data')])

  useEffect(() => {
    if (data.length > 0) {
      const directory = new Directory(data as dataType)
      const result = directory.createObject()
      setStructuredData(result)
    }
  }, [data])

  const callApi = async (collectionId: number) => {
    try {
      const res = await COLLECTION_API.Get_All_By_Parent_ID({ parent: collectionId })
      const newItems = res.data
      console.log(newItems)
      setData((prevData) => {
        const dataSet = new Set(prevData.map((item) => item.id))
        const itemsToAdd: ResultArr = []
        const itemsToRemove: ResultArr = []

        newItems.forEach((item) => {
          if (dataSet.has(item.id)) {
            itemsToRemove.push(item)
          } else {
            itemsToAdd.push(item)
          }
        })
        const updatedData = prevData.filter((item) => !itemsToRemove.includes(item)).concat(itemsToAdd)

        return updatedData
      })
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const handleKeyDown = useCallback(
    (parentId: number) => (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && input.current[parentId] && input.current[parentId]?.value === '') {
        toggleInputVisibility(parentId, type, setMenuVisibility, setInputVisible, setType)
      } else if (e.key === 'Enter' && input.current[parentId]) {
        const inputValue = input.current[parentId]?.value.trim()
        if (inputValue && type === 'COLLECTION') {
          COLLECTION_API.ADD({ name: inputValue, parent: parentId })
            .then((res) => {
              const newItem: CollectionType = {
                ...res.data,
                type: 'COLLECTION'
              }
              setData((prevData) => [...prevData, newItem])
            })
            .catch((error) => {
              console.error('Failed to add item:', error)
            })
          setInputVisible((prev) => ({
            ...prev,
            [parentId]: false
          }))
          Toast.fire({
            icon: 'success',
            title: 'Collection added successfully'
          })
        } else if (inputValue && type === 'PAGE') {
          PAGE_API.ADD_PAGE({ name: inputValue, collectionId: parentId })
            .then((res) => {
              const newItem: PageType = {
                ...res.data,
                type: 'PAGE'
              }
              setData((prevData) => [...prevData, newItem])
            })
            .catch((error) => {
              console.error('Failed to add item:', error)
            })
          setInputVisible((prev) => ({
            ...prev,
            [parentId]: false
          }))
          Toast.fire({
            icon: 'success',
            title: 'Page added successfully'
          })
        }
      }
    },
    [input, type]
  )

  const handleGroupDelete = async () => {
    for (const ele of selected) {
      try {
        await COLLECTION_API.DELETE_COLLECTION_BY_ID({ id: ele })
      } catch (error) {
        console.error(`Failed to delete collection ${ele}:`, error)
      }

      try {
        await PAGE_API.DELETE_BY_PAGE_ID({ id: ele })
      } catch (error) {
        console.error(`Failed to delete page ${ele}:`, error)
      }
      setData((prev) => prev.filter((single) => single.id !== ele))
    }
    setSelected([])
    setIsSelect(false)
    Toast.fire({
      icon: 'success',
      title: 'Selected items deleted successfully'
    })
  }

  const handleDelte = (collectionId: number, type: string) => {
    if (type === 'COLLECTION') {
      COLLECTION_API.DELETE_COLLECTION_BY_ID({ id: collectionId })
        .then((res) => {
          console.log(res)
          setData((prev) => prev.filter((single) => single.id !== collectionId))
          Toast.fire({
            icon: 'success',
            iconColor: 'red',
            title: 'Collection deleted'
          })
        })
        .catch((error) => {
          console.error('Failed to delete item:', error)
        })
    } else if (type === 'PAGE') {
      PAGE_API.DELETE_BY_PAGE_ID({ id: collectionId })
        .then(() => {
          setTimeout(() => {
            setData((prev) => prev.filter((single) => single.id !== collectionId))
          }, 200)
          Toast.fire({
            icon: 'success',
            iconColor: 'red',
            title: 'Page deleted'
          })
        })
        .catch((error) => {
          console.error('Failed to delete item:', error)
        })
      if (pageId === collectionId) {
        navigate('/app')
      }
    }
  }

  const handleRename = (e: React.KeyboardEvent<HTMLInputElement>, collectionId: number, type: string) => {
    if (e.key === 'Enter' && renameRef.current && renameRef.current.value === '') {
      toggleRenameVisibility(collectionId, setRename)
    }
    if (e.key === 'Enter' && renameRef.current) {
      const inputValue = renameRef.current.value.trim()
      if (inputValue && type === 'COLLECTION') {
        COLLECTION_API.RENAME_COLLECTION({ name: inputValue, id: collectionId })
          .then((res) => {
            if (res.code === 200) {
              setData((prev) =>
                prev.map((single) => {
                  if (single.id === collectionId && single.type === 'COLLECTION') {
                    return { ...single, name: inputValue }
                  }
                  return single
                })
              )

              toggleRenameVisibility(collectionId, setRename)
            }
          })
          .catch((error) => {
            console.error('Failed to rename item:', error)
          })
      } else if (inputValue && type === 'PAGE') {
        PAGE_API.RENAME_PAGE({ name: inputValue, id: collectionId })
          .then((res) => {
            if (res.code === 200) {
              setData((prev) =>
                prev.map((single) => {
                  if (single.id === collectionId && single.type === 'PAGE') {
                    return { ...single, name: inputValue }
                  }
                  return single
                })
              )
              toggleRenameVisibility(collectionId, setRename)
            }
          })
          .catch((error) => {
            console.error('Failed to rename item:', error)
          })
      }
    }
    toggleMenuVisibility(collectionId, setMenuVisibility)
  }

  const renderItem = useCallback(
    (item: CollectionType | PageType) => {
      if (item.type === 'COLLECTION') {
        const isChildrenVisible = visibleChildren.has(item.id) || false
        const isMenuVisible = menuVisibility[item.id] || false
        const isInputVisible = inputVisible[item.id] || false
        const isRenameVisible = rename[item.id] || false

        return (
          <div
            key={item.id}
            className={`relative py-1 px-2 ml-1 my-1 bg-slate-100 rounded-md  hover:bg-slate-400 ${isChildrenVisible ? 'bg-slate-400' : ''} `}
            style={{
              backgroundColor: selected.includes(item.id) ? 'rgb(203 213 120)' : ''
            }}
          >
            {isRenameVisible ? (
              <>
                <div className='flex flex-1 justify-end relative'>
                  <input
                    type='text'
                    ref={renameRef}
                    className='border-2 border-black p-1 rounded-lg w-full my-1 '
                    placeholder='Enter text to rename'
                    onKeyDown={(e) => {
                      handleRename(e, item.id, item.type)
                    }}
                  />
                  <IoIosClose
                    className='hover:bg-red-300 rounded-md absolute mt-1 font-extrabold  mr-1 z-10'
                    onClick={() => {
                      setRename({
                        ...rename,
                        [item.id]: false
                      })
                      toggleMenuVisibility(item.id, setMenuVisibility)
                    }}
                  />
                </div>
              </>
            ) : (
              <div
                className='flex flex-row justify-between items-center truncate'
                style={{ fontWeight: 'bold', cursor: 'pointer' }}
                onClick={() => {
                  toggleChildrenVisibility(item.id, isSelect, setSelected, setVisibleChildren)
                  localStorage.setItem('data', JSON.stringify(data))
                  {
                    isMenuVisible && toggleMenuVisibility(item.id, setMenuVisibility)
                  }
                  {
                    isInputVisible && toggleInputVisibility(item.id, item.type, setMenuVisibility, setInputVisible, setType)
                  }
                  callApi(item.id)
                }}
              >
                <div className='flex gap-2 items-center'>
                  {isChildrenVisible ? <FaFolderOpen /> : <FaFolder />}
                  <a data-tooltip-id='my-tooltip' data-tooltip-content={item.name}>
                    <h3 className=' w-28 overflow-hidden'>{item.name}</h3>
                  </a>
                  <Tooltip id='my-tooltip' data-tooltip-place='top' />
                  {/* {item.name} */}
                </div>
                <div
                  className='menu flex flex-row items-center justify-center gap-4'
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleMenuVisibility(item.id, setMenuVisibility)
                  }}
                >
                  {!isMenuVisible ? <ImMenu /> : <ImCross />}
                </div>
                {isMenuVisible && (
                  <div
                    className='menu-content ml-20 mt-48 absolute bg-white text-center text-[12px] p-2 z-50 rounded-2xl'
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleMenuVisibility(item.id, setMenuVisibility)
                    }}
                  >
                    <div
                      className='menu-item w-28 group hover:bg-green-200 p-2 rounded-xl hover:text-green-500'
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleInputVisibility(item.id, 'COLLECTION', setMenuVisibility, setInputVisible, setType)
                      }}
                    >
                      Add Collection
                    </div>
                    <div
                      className='menu-item w-28 group hover:bg-green-200 p-2 rounded-xl hover:text-green-500'
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleInputVisibility(item.id, 'PAGE', setMenuVisibility, setInputVisible, setType)
                      }}
                    >
                      Add Page
                    </div>
                    <div
                      className='menu-item w-28 hover:bg-sky-200 p-2 rounded-xl hover:text-sky-500'
                      onClick={(e) => {
                        e.stopPropagation()
                        if (isInputVisible) {
                          toggleInputVisibility(item.id, item.type, setMenuVisibility, setInputVisible, setType)
                        }
                        toggleRenameVisibility(item.id, setRename)
                      }}
                    >
                      Rename
                    </div>

                    <div
                      className='menu-item w-28 hover:bg-red-200 p-2 rounded-xl hover:text-red-500'
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelte(item.id, item.type)
                      }}
                    >
                      Delete
                    </div>
                  </div>
                )}
              </div>
            )}
            {isChildrenVisible && item.children && item.children.map(renderItem)}
            {isInputVisible && (
              <div className='flex flex-1 justify-end relative'>
                <input
                  type='text'
                  ref={(el) => {
                    if (el) input.current[item.id] = el
                  }}
                  onKeyDown={handleKeyDown(item.id)}
                  className='border-2 border-black p-1 rounded-lg w-full my-1  '
                  placeholder='Enter the name'
                />
                <IoIosClose
                  className='hover:bg-red-300 rounded-md absolute mt-2 mr-1'
                  onClick={() =>
                    setInputVisible({
                      ...inputVisible,
                      [item.id]: false
                    })
                  }
                />
              </div>
            )}
          </div>
        )
      } else if (item.type === 'PAGE') {
        const isMenuVisible = menuVisibility[item.id] || false
        const isRenameVisible = rename[item.id] || false
        return (
          <>
            {isRenameVisible ? (
              <div className='flex flex-1 justify-end relative'>
                <input
                  type='text'
                  ref={renameRef}
                  className='border-2 border-black p-1 rounded-lg w-full my-1 '
                  placeholder='Rename Page'
                  onKeyDown={(e) => {
                    handleRename(e, item.id, item.type)
                  }}
                />
                <IoIosClose
                  className='hover:bg-red-300 rounded-md absolute mt-2 mr-1 z-10'
                  onClick={() => {
                    setRename({
                      ...rename,
                      [item.id]: false
                    })
                    toggleMenuVisibility(item.id, setMenuVisibility)
                  }}
                />
              </div>
            ) : (
              <Link
                to={'/app/page/' + item.name + '/' + item.id}
                onClick={() => {
                  localStorage.setItem('data', JSON.stringify(data))
                  localStorage.setItem('visibleChildren', JSON.stringify(Array.from(visibleChildren)))
                }}
              >
                <div
                  className='flex flex-row justify-between px-2 py-1 cursor-pointer rounded-md items-center hover:bg-slate-300 mt-1'
                  style={{
                    backgroundColor: item.id === pageId ? 'rgb(203 213 220)' : ''
                  }}
                >
                  <div key={item.id} className='flex flex-row gap-2 items-center'>
                    {item.id === pageId ? <FaRegNoteSticky /> : <FaNoteSticky />}

                    <a data-tooltip-id='my-tooltip' data-tooltip-content={item.name}>
                      <h3 className=' w-28 overflow-hidden'>{item.name}</h3>
                    </a>
                    <Tooltip />
                  </div>
                  <div
                    className='menu'
                    onClick={(e) => {
                      e.stopPropagation()
                      e.preventDefault()
                      toggleMenuVisibility(item.id, setMenuVisibility)
                    }}
                  >
                    {!isMenuVisible ? <ImMenu /> : <ImCross />}
                  </div>
                  {isMenuVisible && (
                    <div className='menu-content ml-20 mt-24 absolute bg-white text-center text-[12px] p-2 z-10 rounded-2xl'>
                      <div
                        className='menu-item w-20 hover:bg-sky-200 p-2 cursor-pointer rounded-xl hover:text-sky-500'
                        onClick={(e) => {
                          e.stopPropagation()
                          e.preventDefault()
                          toggleRenameVisibility(item.id, setRename)
                        }}
                      >
                        Rename
                      </div>
                      <div
                        className='menu-item w-20 hover:bg-red-200 p-2 cursor-pointer rounded-xl hover:text-red-500'
                        onClick={(e) => {
                          e.stopPropagation()
                          e.preventDefault()
                          handleDelte(item.id, item.type)
                        }}
                      >
                        Delete
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            )}
          </>
        )
      }
      return null
    },
    [visibleChildren, menuVisibility, rename, type, inputVisible, selected, data, isSelect]
  )

  return (
    <div className='relative p-1 h-[625px] hide-scroll'>
      {/* <BiSolidSelectMultiple
        onClick={(e) => {
          e.stopPropagation()
          toggleSelect(setIsSelect)
        }}
      /> */}

      {data.length > 0 && (
        <MdDeleteOutline
          className={`w-6 h-6 p-0.5 ${isSelect ? 'bg-red-500 rounded-md' : ''} `}
          onClick={(e) => {
            {
              !isSelect &&
                Toast.fire({
                  icon: 'info',
                  title: 'Select items to delete'
                })
            }
            e.stopPropagation()
            toggleSelect(setIsSelect)
          }}
        />
      )}
      {selected.length !== 0 && (
        <div className='flex flex-row ml-36 gap-2 mb-4 items-end justify-center '>
          <FaTrash className='bg-red-500 p-1 text-xl w-8 shadow-sm shadow-red-300 rounded-lg' onClick={() => handleGroupDelete()} />
          <FaXmark
            className='bg-red-500 w-8 text-xl shadow-sm shadow-red-300 rounded-lg'
            onClick={() => {
              setIsSelect(false)
              setSelected([])
            }}
          />
        </div>
      )}
      {structuredData.map(renderItem)}
    </div>
  )
}

export default DirectoryMap
