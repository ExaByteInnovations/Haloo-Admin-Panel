/* eslint-disable jsx-a11y/anchor-is-valid */
import {useContext, useState} from 'react'
import {useIntl} from 'react-intl'
import {PageTitle} from '../../../_metronic/layout/core'
import {ApiPost} from '../../../helpers/API/ApiData'
import {toast} from 'react-toastify'
import '../../App.css'
import {AuthContext} from '../../auth/authContext'
import * as authUtil from '../../../utils/auth.util'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'

const Password = () => {
  const intl = useIntl()
  const {user, dispatch} = useContext(AuthContext)
  const [inputValue, setInputValue] = useState({})
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const validateForm = () => {
    let formIsValid = true
    let errors = {}
    if (
      (inputValue && !inputValue.password) ||
      inputValue.password?.length < 3 ||
      inputValue.password?.length > 50
    ) {
      formIsValid = false
      errors['password'] =
        inputValue.password?.length < 3 || inputValue.password?.length > 50
          ? '*Please Enter password having more than 2 characters'
          : '*Please Enter Password!'
    }
    if (
      (inputValue && !inputValue.confirmPassword) ||
      inputValue.confirmPassword?.length < 3 ||
      inputValue.confirmPassword?.length > 50
    ) {
      formIsValid = false
      errors['confirmPassword'] =
        inputValue.password?.length < 3 || inputValue.password?.length > 50
          ? '*Please Enter password having more than 2 characters'
          : '*Please Enter Password!'
    }
    if (inputValue && inputValue.password !== inputValue.confirmPassword) {
      formIsValid = false
      errors['passwordMatch'] = '*Password and Confirm Password does not match!'
    }
    setErrors(errors)
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
      try {
        const response = await ApiPost(`auth/admin/resetpassword?_id=${user?._id}`, {
          email: user?.email,
          password: inputValue?.password,
        })

        if (response.status === 201) {
          toast.success('Updated Successfully')
          setInputValue({})
          dispatch({
            type: 'UPDATE_SUCCESS',
            payload: response.data,
          })
          logout()
        }
      } catch (err) {
        toast.error(err.message)
      }
    }
  }

  const handleChange = (e) => {
    const {name, value} = e.target
    setInputValue({...inputValue, [name]: value})
    setErrors({...errors, [name]: ''})
  }

  // if (loading) {
  //   return (
  //     <Box className='loader'>
  //       <CircularProgress />
  //     </Box>
  //   )
  // }

  const click = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }

  const EditPasswordBreadCrumbs = [
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

  return (
    <>
      <PageTitle breadcrumbs={EditPasswordBreadCrumbs}>
        {intl.formatMessage({id: 'MENU.SETTINGS.CHANGE_PASSWORD'})}
      </PageTitle>

      <div className='card mb-5 mb-xl-10'>
        {/* <div
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
        </div> */}
        <div className='card-body border-top p-9'>
          <div className='row mb-6'>
            <label className='col-lg-4 col-form-label required fw-bold fs-6'>New Password</label>

            <div className='col-lg-8 fv-row'>
              <div className='password-wrapper'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name='password'
                  className='form-control form-control-lg form-control-solid'
                  placeholder='Enter New Password'
                  onChange={(e) => handleChange(e)}
                  required
                />
                {showPassword ? (
                  <VisibilityIcon className='eye-icon' onClick={() => setShowPassword(false)} />
                ) : (
                  <VisibilityOffIcon className='eye-icon' onClick={() => setShowPassword(true)} />
                )}
              </div>
              <div className='form-text'>Please Enter Password having more than 2 characters</div>
              <span className='error-msg'>{errors['password']}</span>
            </div>
          </div>
          <div className='row mb-6'>
            <label className='col-lg-4 col-form-label required fw-bold fs-6'>
              Confirm Password
            </label>

            <div className='col-lg-8 fv-row'>
              <div className='password-wrapper'>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name='confirmPassword'
                  className='form-control form-control-lg form-control-solid'
                  placeholder='Enter Confirm Password'
                  onChange={(e) => handleChange(e)}
                  required
                />
                {showConfirmPassword ? (
                  <VisibilityIcon
                    className='eye-icon'
                    onClick={() => setShowConfirmPassword(false)}
                  />
                ) : (
                  <VisibilityOffIcon
                    className='eye-icon'
                    onClick={() => setShowConfirmPassword(true)}
                  />
                )}
              </div>
              <div className='form-text'>Please Enter Password having more than 2 characters</div>
              <span className='error-msg'>{errors['confirmPassword']}</span>
              <span className='error-msg'>{errors['passwordMatch']}</span>
            </div>
          </div>
        </div>
        <div className='card-footer d-flex justify-content-end py-6 px-9'>
          <button
            type='submit'
            className='btn btn-primary'
            disabled={loading}
            onClick={() => {
              handleUpdate()
              click()
            }}
          >
            {!loading && 'Save Changes'}
            {loading && (
              <span className='indicator-progress' style={{display: 'block'}}>
                Please wait...{' '}
                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
              </span>
            )}
          </button>
        </div>
      </div>
    </>
  )
}

export {Password}
