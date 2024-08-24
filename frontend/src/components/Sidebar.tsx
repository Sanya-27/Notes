import React, { createContext, useEffect, useRef, useState } from 'react'
import DirectoryMap from './DirectoryMapper'
import { FaPlus } from 'react-icons/fa'
import COLLECTION_API from '../utils/api/collection'
import { ImMenu, ImCross } from 'react-icons/im'
import { Toast } from '../utils/alert/sweetAlert2'
import { ResultArr } from '../utils/helper/DirFormatter'
import { IoIosClose } from 'react-icons/io'

const Sidebar = () => {
  const [takeinputColl, setinputColl] = useState(false)
  const [menu, setMenu] = useState(true)
  const inputContext = createContext(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const searchRef = useRef<any>(null)
  const [data, setData] = useState<ResultArr>(localStorage.getItem('data') ? JSON.parse(localStorage.getItem('data') as string) : [])

  const handleSearch = (e: any) => {
    if (e.key === 'Enter' && searchRef.current.value !== '') {
      COLLECTION_API.GET_COLLECTION_BY_NAME({ name: searchRef.current.value }).then((res) => console.log(res.data))
    }
  }
  const handleAddCollection = () => {
    setinputColl(true)
  }
  useEffect(() => {
    COLLECTION_API.Get_All_By_Parent_ID({ parent: null }).then((res) => {
      setData(res.data)
    })
  }, [])

  const handleKeyDown = (parent: number | null) => (e: React.KeyboardEvent) => {
    if (inputRef.current && e.key === 'Enter' && inputRef.current.value === '') {
      setinputColl(false)
    } else if (e.key === 'Enter' && inputRef.current && inputRef.current.value.trim() !== '') {
      console.log(inputRef.current.value)
      setinputColl(false)
      COLLECTION_API.ADD({ name: inputRef.current.value, parent }).then((res) => {
        Toast.fire({
          icon: 'success',
          title: 'Collection Added'
        })
      })
    }
  }

  return (
    <>
      <div
        className={`sidebar h-screen bg-slate-100 w-1/5 p-2 ${menu ? 'ml-0' : 'ml-[-250px]'}`}
        style={{
          transition: 'all 0.5s'
        }}
      >
        <div className='flex justify-between items-center'>
          <input
            type='text'
            className='w-40  rounded-md px-2 py-1 border-slate-400 border-2'
            placeholder='Search Notes'
            ref={searchRef}
            onKeyDown={(e) => handleSearch(e)}
          />
          {menu ? <ImMenu onClick={() => setMenu(false)} /> : <ImMenu onClick={() => setMenu(true)} />}
        </div>
        <div
          className='content'
          style={{
            display: menu ? 'block' : 'none'
          }}
        >
          <h1 className='text-center text-2xl font-extrabold mt-4 mb-4'>NoteBlock</h1>
          <inputContext.Provider value={takeinputColl}>
            <div className='flex justify-center py-2 text-3xl'>
              <FaPlus
                onClick={handleAddCollection}
                className='bg-slate-300 rounded-lg text-2xl hover:bg-slate-400 cursor-pointer py-1 w-full mb-2'
              />
            </div>
            <hr className='border-1 border-black mb-2' />
            {takeinputColl && (
              <div className='flex flex-1 justify-end relative'>
                <input
                  ref={inputRef}
                  onKeyDown={handleKeyDown(null)}
                  placeholder='Enter the name of Collection'
                  className='p-2 rounded-md w-full bg-slate-300 focus-within:'
                />
                <IoIosClose className='hover:bg-red-300 rounded-md absolute mt-.7 mr-1' onClick={() => setinputColl(false)} />
              </div>
            )}
            <DirectoryMap data={data} />
          </inputContext.Provider>
        </div>
      </div>
    </>
  )
}

export default Sidebar
