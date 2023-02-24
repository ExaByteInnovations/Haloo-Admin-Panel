/* eslint-disable jsx-a11y/anchor-is-valid */
import {useContext, useState} from 'react'
import {AuthContext} from '../../../../app/auth/authContext'
import {ApiPost} from '../../../../helpers/API/ApiData'
import {toast} from 'react-toastify'
import * as authUtil from '../../../../utils/auth.util'
import {toAbsoluteUrl} from '../../../helpers'
import {Link} from 'react-router-dom'

const HeaderUserMenu = () => {
  const {user, dispatch} = useContext(AuthContext)
  const [imageLoaded, setImageLoaded] = useState(false)
  const blankImg = toAbsoluteUrl('/media/svg/avatars/blank.svg')
  const logout = async () => {
    try {
      const response = await ApiPost('auth/admin/logout', {email: user?.email})
      if (response.status === 200) {
        dispatch({
          type: 'LOGOUT',
        })
        authUtil.logout()
        toast.success(response.data)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  const imageStyles = !imageLoaded ? {display: 'none'} : {}

  return (
    <div
      className='menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg menu-state-primary fw-bold py-4 fs-6 w-275px'
      data-kt-menu='true'
    >
      <div className='menu-item px-3'>
        <div className='menu-content d-flex align-items-center px-3'>
          <div className='symbol symbol-50px me-5'>
            {!imageLoaded && <img alt='logo' src={blankImg} />}
            <img
              alt='Logo'
              style={imageStyles}
              onLoad={handleImageLoad}
              src={user?.profileImage ? user.profileImage : blankImg}
            />
          </div>

          <div className='d-flex flex-column'>
            <div className='fw-bolder d-flex align-items-center fs-5'>
              {user?.name}

              {/* <span className='badge badge-light-success fw-bolder fs-8 px-2 py-1 ms-2'>Pro</span> */}
            </div>
            <a href='#' className='fw-bold text-muted text-hover-primary fs-7'>
              {user?.email}
            </a>
          </div>
        </div>
      </div>

      <div className='separator my-2'></div>

      <div className='menu-item px-5 my-1'>
        <Link to='/settings/edit-profile' className='menu-link px-5'>
          Edit Profile
        </Link>
      </div>

      <div className='menu-item px-5 my-1'>
        <Link to='/settings/change-password' className='menu-link px-5'>
          Change Password
        </Link>
      </div>

      <div className='menu-item px-5'>
        <a onClick={logout} className='menu-link px-5'>
          Sign Out
        </a>
      </div>
    </div>
  )
}

export {HeaderUserMenu}
