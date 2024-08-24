import notes from '../assets/img/notes.png';
import React from 'react'

function Info() {
  return (
    <div className='flex flex-col justify-center items-center' >
        <h1 className='font-mono text-2xl font-bold my-auto' >Create and Manage Notes in Ease...</h1>
        <img className='w-2/4' src={notes} alt="notes" />
    </div>
  )
}

export default Info