import React, { useEffect, useRef, useState } from 'react'
import MDEditor, { italic } from '@uiw/react-md-editor'
import { MdEdit } from 'react-icons/md'
import PAGE_API from '../utils/api/page'
import { IoIosCloseCircleOutline } from 'react-icons/io'
import { RES_GET_PAGE_BY_ID } from '../utils/types/api/page_Types'
import { useNavigate, useParams } from 'react-router-dom'
import { LiaItalicSolid } from 'react-icons/lia'
import { FaBold } from 'react-icons/fa'
import ReactMarkdown from 'react-markdown'

const MarkdownEditor: React.FC = () => {
  const [content, setContent] = useState('')
  const [details, setDetails] = useState<RES_GET_PAGE_BY_ID>()
  const [isReadOnly, setIsReadOnly] = useState<boolean>(true)
  //   const [type, settype] = useState<string>('')

  const pageId = Number(useParams().id)
  const pageName = String(useParams().page_name)
  console.log(pageName)
  const navigate = useNavigate()

  const handleEditClick = () => {
    setIsReadOnly(false)
  }

  useEffect(() => {
    if (pageId !== 0) {
      PAGE_API.GET_BY_PAGE_ID({ id: pageId }).then((response) => {
        setContent(response.data.content ?? '')
        setDetails(response.data)
      })
    }
    // settype('')
    setIsReadOnly(true)
  }, [pageId, pageName])

  const handleSaveClick = () => {
    PAGE_API.SAVE_PAGE({ id: pageId, content: content as string })
    setIsReadOnly(true)
  }

  return (
    <div className='w-[95%] mx-auto'>
      <div className='flex flex-row justify-between mb-2'>
        <h1 className='text-2xl ml-2 mb-2 text-slate-300'>
          <b>{pageName}</b>
        </h1>
        <div className='flex flex-row gap-2'>
          <button
            className={`p-1 w-24 text-sm border-2 rounded-xl ${!isReadOnly ? 'bg-green-300 border-green-300 hover:opacity-50 cursor-pointer' : 'hidden'}`}
            onClick={handleSaveClick}
            disabled={isReadOnly}
          >
            Save
          </button>
          <button
            className={`p-1 w-24 text-sm text-slate-950 hover:text-slate-100 border-2 rounded-xl ${isReadOnly ? 'bg-slate-300  hover:bg-slate-500 cursor-pointer' : 'bg-gray-300 border-gray-300 cursor-not-allowed opacity-50'}`}
            onClick={handleEditClick}
            disabled={!isReadOnly}
          >
            <span className='flex flex-row justify-center items-center'>
              Edit
              <MdEdit className='mx-1' />
            </span>
          </button>
          <button
            className={`p-1 w-24 flex justify-center text-slate-950 hover:text-slate-100 border-red-100 items-center text-sm border-2 rounded-xl ${isReadOnly ? 'bg-red-300  hover:bg-red-500 cursor-pointer' : 'bg-gray-300 border-gray-300 cursor-not-allowed opacity-50'}`}
            onClick={() => {
              localStorage.removeItem('visibleChildren')
              navigate('/app')
            }}
          >
            <span className='flex flex-row justify-center  items-center'>
              Close
              <IoIosCloseCircleOutline className='mx-1 mt-[3px]' />
            </span>
          </button>
        </div>
      </div>
      <hr className='border-1 border-slate-200 mb-4' />
      {/* <MDEditor
        value={content}
        onChange={(value: string | undefined) => {
          if (!isReadOnly && value) {
            setContent(value)
          }
        }}
        preview={isReadOnly ? 'preview' : 'edit'}
        hideToolbar={isReadOnly}
        height={isReadOnly ? 650 : 650}
      /> */}
      {!isReadOnly ? (
        <>
          <div className='bg-slate-500 w-full px-2 flex flex-row'>
            <button
              className='flex justify-start mx-2 text-xl'
              onClick={() => {
                // settype('bold')
                setContent((prev) => prev + '**Bold**')
              }}
            >
              <div className='flex justify-center items-center pt-0.5'>
                <FaBold className='h-4' />
              </div>
            </button>
            <button
              className='flex justify-center text-xl items-center'
              onClick={() => {
                // settype('italic')
                setContent((prev) => prev + '*Italic*')
              }}
            >
              <i>
                <LiaItalicSolid />
              </i>
            </button>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={`bg-black text-white w-full h-[450%] p-2`}
          ></textarea>
        </>
      ) : (
        <div className={`bg-black text-white w-full h-[450%] p-2`}>
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      )}
    </div>
  )
}

export default MarkdownEditor
