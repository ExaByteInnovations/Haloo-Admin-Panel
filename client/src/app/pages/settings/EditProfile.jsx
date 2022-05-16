/* eslint-disable jsx-a11y/anchor-is-valid */
import {useContext, useEffect, useState} from 'react'
import {useIntl} from 'react-intl'
import {PageTitle} from '../../../_metronic/layout/core'
import {ApiGet, ApiPost, ApiPut} from '../../../helpers/API/ApiData'
import {toast} from 'react-toastify'
import {CircularProgress, Box} from '@material-ui/core'
import {Modal} from 'react-bootstrap'
import '../../App.css'
import {AuthContext} from '../../auth/authContext'
import {toAbsoluteUrl} from '../../../_metronic/helpers/AssetHelpers'
import * as authUtil from '../../../utils/auth.util'
import {MasterContext} from '../../context/masterContext'

const EditProfile = () => {
  const intl = useIntl()
  const {user, dispatch} = useContext(AuthContext)
  const {imgExtensions} = useContext(MasterContext)
  const [previewImage, setPreviewImage] = useState()
  const [inputValue, setInputValue] = useState({...user})
  // const [imageLoaded, setImageLoaded] = useState(false)
  const [initialValues, setInitialValues] = useState({})
  const [loading, setLoading] = useState(false)
  const [loader, setLoader] = useState(false)
  const [show, setShow] = useState(false)
  const [errors, setErrors] = useState({})
  const [profileImage, setProfileImage] = useState()

  const handleClose = () => {
    setShow(false)
    setInputValue(initialValues)
    setErrors({})
  }

  useEffect(() => {
    getEditProfile()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!profileImage) {
      setPreviewImage(null)
      return
    }
    const objectUrl = URL.createObjectURL(profileImage)
    setPreviewImage(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [profileImage])

  const getEditProfile = async () => {
    try {
      setLoader(true)
      const response = await ApiGet(`usermanagement/admin?_id=${user?._id}`)
      if (response.status === 200) {
        setInputValue(...response.data.data)
        setInitialValues(...response.data.data)
      }
      setLoader(false)
    } catch (err) {
      toast.error(err.message)
      setLoader(false)
    }
  }

  const validateForm = () => {
    let formIsValid = true
    let errors = {}

    if (inputValue && !inputValue.name) {
      formIsValid = false
      errors['name'] = '*Please Enter Name!'
    } else if (inputValue && !inputValue.name.match(/^\S[a-zA-Z ]+$/)) {
      formIsValid = false
      errors['name'] = '*Please Enter Valid Name Only!'
    }
    if (inputValue && !inputValue.email) {
      formIsValid = false
      errors['email'] = '*Please Enter Email!'
    } else if (
      inputValue &&
      !inputValue.email.match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    ) {
      formIsValid = false
      errors['email'] = '*Please Enter Valid Email Only!'
    }
    // if (inputValue && !inputValue.userRole) {
    //   formIsValid = false
    //   errors['userRole'] = '*Please Select User Role!'
    // }
    // if (inputValue && !inputValue.status) {
    //   formIsValid = false
    //   errors['status'] = '*Please Select Status!'
    // }

    setErrors(errors)
    if (formIsValid) setShow(true)
    return formIsValid
  }

  const logout = async () => {
    try {
      const response = await ApiPost('auth/admin/logout', {email: user?.email})
      if (response.status === 200) {
        dispatch({
          type: 'LOGOUT',
        })
        authUtil.logout()
        // toast.success(response.data)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleUpdate = async () => {
    if (validateForm()) {
      const imageData = new FormData()
      imageData.append('profileImage', profileImage)
      imageData.append('name', inputValue.name)
      imageData.append('email', inputValue.email)
      imageData.append('userRole', inputValue.userRole)
      imageData.append('status', inputValue.status)

      try {
        const response = await ApiPut(`usermanagement/admin?_id=${user?._id}`, imageData)
        if (response.status === 200) {
          toast.success('Updated Successfully')
          getEditProfile()
          dispatch({
            type: 'UPDATE_SUCCESS',
            payload: response?.data,
          })
          logout()
          handleClose()
        }
      } catch (err) {
        toast.error(err.error || err.message)
        setErrors({[err.field]: err.error})
      }
    }
  }

  const handleChange = (e) => {
    const {name, value} = e.target
    setInputValue({...inputValue, [name]: value})
    setErrors({...errors, [name]: ''})
  }

  // const handleImageLoad = () => {
  //   setImageLoaded(true)
  // }

  // const imageStyles = !imageLoaded ? {display: 'none'} : {}

  // const status = [
  //   {label: 'Active', value: 'Active'},
  //   {label: 'Inactive', value: 'Inactive'},
  // ]

  if (loader) {
    return (
      <Box className='loader'>
        <CircularProgress color='secondary' />
      </Box>
    )
  }

  const EditProfileBreadCrumbs = [
    {
      title: 'Settings',
      path: '/settings/edit-profile',
      isSeparator: false,
      isActive: false,
    },
    {
      title: '',
      path: '',
      isSeparator: true,
      isActive: false,
    },
  ]

  const click = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }

  const blankImg = toAbsoluteUrl('/media/svg/avatars/blank.svg')
  const userProfileImg = previewImage
    ? previewImage
    : inputValue.profileImage
    ? `${process.env.REACT_APP_SERVER_URL}${inputValue.profileImage}`
    : blankImg

  return (
    <>
      <PageTitle breadcrumbs={EditProfileBreadCrumbs}>
        {intl.formatMessage({id: 'MENU.SETTINGS.EDIT_PROFILE'})}
      </PageTitle>
      <Modal show={show} onHide={handleClose}>
        <>
          <Modal.Header closeButton>
            <Modal.Title className='text-danger'>Alert!</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to Edit the Admin Profile</Modal.Body>
          <Modal.Footer>
            <button className='btn btn-white btn-active-light-danger me-2' onClick={handleClose}>
              Discard
            </button>
            <button
              className='btn btn-danger'
              onClick={() => {
                handleUpdate()
                click()
              }}
            >
              {!loading && 'Update'}
              {loading && (
                <span className='indicator-progress' style={{display: 'block'}}>
                  Please wait...{' '}
                  <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                </span>
              )}
            </button>
          </Modal.Footer>
        </>
      </Modal>
      <div className='card mb-5 mb-xl-10'>
        <div
          className='card-header border-0 cursor-pointer'
          role='button'
          data-bs-toggle='collapse'
          data-bs-target='#kt_account_profile_details'
          aria-expanded='true'
          aria-controls='kt_account_profile_details'
        >
          <div className='card-title m-0'>
            <h3 className='fw-bolder m-0'>Profile Details</h3>
          </div>
        </div>
        <div className='card-body border-top p-9'>
          <div className='row mb-6'>
            <label className='col-lg-4 col-form-label fw-bold fs-6'>Profile Image</label>
            <div className='col-lg-8'>
              <div
                className='image-input image-input-outline'
                data-kt-image-input='true'
                style={{backgroundImage: `url('${blankImg}')`}}
              >
                <div
                  className='image-input-wrapper w-125px h-125px'
                  style={{backgroundImage: `url('${userProfileImg}')`}}
                ></div>
                <label
                  className='btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow'
                  data-kt-image-input-action='change'
                  data-bs-toggle='tooltip'
                  title='Change profile image'
                >
                  <i className='bi bi-pencil-fill fs-7'></i>

                  <input
                    type='file'
                    name='profileImage'
                    accept={imgExtensions.join(', ')}
                    onChange={(e) => {
                      setProfileImage(e.target.files[0])
                    }}
                  />
                  <input type='hidden' name='remove profile image' />
                </label>

                {/* <span
                className='btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow'
                data-kt-image-input-action='cancel'
                data-bs-toggle='tooltip'
                title='Cancel profile image'
              >
                <i className='bi bi-x fs-2'></i>
              </span> */}

                <span
                  className='btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow'
                  data-kt-image-input-action='remove'
                  data-bs-toggle='tooltip'
                  title='Remove profile image'
                  onClick={() => {
                    setPreviewImage('')
                    setProfileImage(null)
                    setInputValue({...inputValue, profileImage: ''})
                  }}
                >
                  <i className='bi bi-x fs-2'></i>
                </span>
              </div>
              <div className='form-text'>{`Allowed file types: ${imgExtensions.join(', ')}`}</div>
              <span className='error-msg'>{errors['profileImage']}</span>
            </div>
          </div>

          <div className='row mb-6'>
            <label className='col-lg-4 col-form-label required fw-bold fs-6'>Name</label>

            <div className='col-lg-8 fv-row'>
              <input
                type='text'
                name='name'
                className='form-control form-control-lg form-control-solid'
                placeholder='Name'
                onChange={(e) => handleChange(e)}
                value={inputValue?.name || ''}
              />
              <span className='error-msg'>{errors['name']}</span>
            </div>
          </div>

          <div className='row mb-6'>
            <label className='col-lg-4 col-form-label required fw-bold fs-6'>Email</label>

            <div className='col-lg-8 fv-row'>
              <input
                type='email'
                name='email'
                className='form-control form-control-lg form-control-solid'
                placeholder='Email'
                onChange={(e) => handleChange(e)}
                value={inputValue?.email || ''}
              />
              <span className='error-msg'>{errors['email']}</span>
            </div>
          </div>

          <div className='row mb-6'>
            <label className='col-lg-4 col-form-label required fw-bold fs-6'>User Role</label>

            <div className='col-lg-8 fv-row'>
              <input
                type='text'
                name='userRole'
                className='form-control form-control-lg form-control-solid'
                placeholder='User Role'
                onChange={(e) => handleChange(e)}
                value={inputValue?.userRole || ''}
                disabled
              />
              <span className='error-msg'>{errors['userRole']}</span>
            </div>
          </div>
        </div>
        <div className='card-footer d-flex justify-content-end py-6 px-9'>
          <button className='btn btn-primary' disabled={loading} onClick={() => validateForm()}>
            Save Changes
          </button>
        </div>
      </div>
      {/* <Box className='admin-wrapper'> */}
      {/* <Box className='admin-profile-image-wrapper'>
          {!imageLoaded && <Image className='admin-profile-image' src={userImage} />}
          <Image
            className='admin-profile-image'
            style={imageStyles}
            onLoad={handleImageLoad}
            src={
              // inputValue?.profileImage
              //   ? process.env.REACT_APP_SERVER_URL + inputValue?.profileImage
              //   : previewImage
              //   ? previewImage
              //   : userImage

              previewImage
                ? previewImage
                : inputValue?.profileImage
                ? process.env.REACT_APP_SERVER_URL + inputValue?.profileImage
                : userImage
            }
          />
        </Box> */}
      {/* <Box className='settings-form'> */}
      {/* <TextField
            className='admin-field'
            label='Status'
            type={'text'}
            onChange={(e) => handleChange(e)}
            name='status'
            variant='filled'
            margin='dense'
            value={`${inputValue?.status?.charAt(0)?.toUpperCase()}${inputValue?.status
              ?.substr(1)
              ?.toLowerCase()}`}
            defaultValue={
              inputValue?.status?.charAt(0)?.toUpperCase() +
              inputValue?.status?.substr(1)?.toLowerCase()
            }
            select
          >
            {status.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField> */}
      {/* </Box> */}
      {/* </Box> */}
    </>
  )
}

export {EditProfile}
