import React, { useEffect, useState } from 'react'
import USER_API from '../utils/api/user'
import { RES_USER_PROFILE } from '../utils/types/api/user'
import { googleLogout } from '@react-oauth/google'
import { useNavigate } from 'react-router-dom'
import logout from '../assets/img/logout.png'
import data from './data'
import { RiLogoutCircleLine } from 'react-icons/ri'
import Swal from 'sweetalert2'

const Navbar = () => {
  const [profile, setProfile] = useState<RES_USER_PROFILE>()
  const navigate = useNavigate()

  useEffect(() => {
    ;(async () => {
      const response = await USER_API.GET_PROFILE()
      setTimeout(() => {
        setProfile(response.data)
      }, 1000)
    })()
  }, [])

  const handleLogout = () => {
    document.cookie = `token=null`
    navigate('/login')
  }

  return (
    <>
      <nav className='w-full px-2 py-4 flex justify-end h-16'>
        <div className='flex flex-row lg:gap-4 max-md:gap-4 md:gap-4 max-sm:gap-2'>
          <div
            className='flex flex-row gap-2 items-center justify-center'
            onClick={() =>
              Swal.fire({
                title: `${profile?.name}`,
                text: `${profile?.email}`,
                imageUrl: `${profile?.profile}`,
                imageWidth: 100,
                imageHeight: 100,
                imageAlt: 'Custom image',
                confirmButtonText: 'Logout',
                preConfirm: () => {
                  return new Promise<void>((resolve) => {
                    handleLogout()
                    resolve()
                  })
                }
              })
            }
          >
            <button className='flex items-center '>
              <img src={profile?.profile} className='rounded-full w-10 h-10 mx-1 border-2' alt='pfp' />
              <h5>{profile ? profile.name : ''}</h5>
            </button>
          </div>
        </div>
      </nav>
    </>
  )
}

export default Navbar
