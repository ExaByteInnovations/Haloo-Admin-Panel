import clsx from 'clsx'
import {FC, useContext, useState} from 'react'
import {AuthContext} from '../../../../app/auth/authContext'
import userImage from '../../../../assets/user.png'
import {
  KTSVG,
  //  toAbsoluteUrl
} from '../../../helpers'
import {
  // HeaderNotificationsMenu,
  HeaderUserMenu,
  // QuickLinks,
  // Search
} from '../../../partials'
import {useLayout} from '../../core'

const toolbarButtonMarginClass = 'ms-1 ms-lg-3',
  // toolbarButtonHeightClass = 'w-30px h-30px w-md-40px h-md-40px',
  toolbarUserAvatarHeightClass = 'symbol-30px symbol-md-40px'
// toolbarButtonIconSizeClass = 'svg-icon-1'

const Topbar: FC = () => {
  const {config} = useLayout()
  const {user} = useContext(AuthContext)
  const [imageLoaded, setImageLoaded] = useState(false)

  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  const imageStyles = !imageLoaded ? {display: 'none'} : {}

  return (
    <div className='d-flex align-items-stretch flex-shrink-0'>
      {/* Search */}
      {/* <div className={clsx('d-flex align-items-stretch', toolbarButtonMarginClass)}>
        <Search />
      </div> */}

      {/* begin::User */}
      <div
        className={clsx('d-flex align-items-center', toolbarButtonMarginClass)}
        id='kt_header_user_menu_toggle'
      >
        {/* begin::Toggle */}
        <div
          className={clsx('cursor-pointer symbol', toolbarUserAvatarHeightClass)}
          data-kt-menu-trigger='click'
          data-kt-menu-attach='parent'
          data-kt-menu-placement='bottom-end'
          data-kt-menu-flip='bottom'
        >
          {!imageLoaded && <img alt='haloo' src={userImage} />}
          <img
            style={imageStyles}
            onLoad={handleImageLoad}
            src={
              user?.profileImage ? process.env.REACT_APP_SERVER_URL + user.profileImage : userImage
            }
            alt='haloo'
          />
        </div>
        <HeaderUserMenu />
        {/* end::Toggle */}
      </div>
      {/* end::User */}

      {/* begin::Aside Toggler */}
      {config.header.left === 'menu' && (
        <div className='d-flex align-items-center d-lg-none ms-2 me-n3' title='Show header menu'>
          <div
            className='btn btn-icon btn-active-light-primary w-30px h-30px w-md-40px h-md-40px'
            id='kt_header_menu_mobile_toggle'
          >
            <KTSVG path='/media/icons/duotune/text/txt001.svg' className='svg-icon-1' />
          </div>
        </div>
      )}
    </div>
  )
}

export {Topbar}
