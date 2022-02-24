/* eslint-disable jsx-a11y/anchor-is-valid */
import {useContext, useState} from 'react'
import {useIntl} from 'react-intl'
import {PageTitle} from '../../../_metronic/layout/core'
import {ApiPost} from '../../../helpers/API/ApiData'
import {toast} from 'react-toastify'
import {Button} from 'react-bootstrap'
import {Box, CircularProgress, TextField} from '@material-ui/core'
import '../../App.css'
import {AuthContext} from '../../auth/authContext'
import * as authUtil from '../../../utils/auth.util'

const Password = () => {
  const intl = useIntl()
  const {user, dispatch} = useContext(AuthContext)
  const [inputValue, setInputValue] = useState({})
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

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
        setLoading(true)
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
        setLoading(false)
      } catch (err) {
        toast.error(err.message)
        setLoading(false)
      }
    }
  }

  const handleChange = (e) => {
    const {name, value} = e.target
    setInputValue({...inputValue, [name]: value})
    setErrors({...errors, [name]: ''})
  }

  if (loading) {
    return (
      <Box className='loader'>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({id: 'MENU.SETTINGS.CHANGE_PASSWORD'})}
      </PageTitle>
      <Box className='settings-form'>
        <TextField
          className='settings-field'
          label='New Password'
          type={'password'}
          onChange={(e) => handleChange(e)}
          name='password'
          variant='filled'
          margin='dense'
          required
          helperText='Please Enter Password having more than 2 characters'
        />
        <span
          style={{
            color: 'red',
            top: '5px',
            fontSize: '12px',
          }}
        >
          {errors['password']}
        </span>
        <TextField
          className='settings-field'
          label='Confirm Password'
          type={'password'}
          onChange={(e) => handleChange(e)}
          name='confirmPassword'
          variant='filled'
          margin='dense'
          required
          helperText='Please Enter Password having more than 2 characters'
        />
        <span
          style={{
            color: 'red',
            top: '5px',
            fontSize: '12px',
          }}
        >
          {errors['confirmPassword']}
        </span>
        <Box className='settings-btn-wrapper'>
          <Button
            className='button settings-btn-save'
            size='lg'
            variant='success'
            onClick={handleUpdate}
          >
            Save
          </Button>
        </Box>
        <span
          style={{
            color: 'red',
            marginTop: '10px',
            fontSize: '12px',
          }}
        >
          {errors['passwordMatch']}
        </span>
      </Box>
    </>
  )
}

export {Password}
