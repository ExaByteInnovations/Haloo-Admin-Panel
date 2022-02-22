/* eslint-disable jsx-a11y/anchor-is-valid */
import {useContext, useEffect, useState} from 'react'
import {useIntl} from 'react-intl'
import {PageTitle} from '../../../_metronic/layout/core'
import {ApiGet, ApiPut} from '../../../helpers/API/ApiData'
import {toast} from 'react-toastify'
import {Button} from 'react-bootstrap'
import {Modal} from 'react-bootstrap'
import {Box, CircularProgress, MenuItem, TextField} from '@material-ui/core'
import '../../App.css'
import {Image} from 'react-bootstrap-v5'
import {AuthContext} from '../../auth/authContext'

const EditProfile = () => {
  const intl = useIntl()
  const {user, dispatch} = useContext(AuthContext)
  const [inputValue, setInputValue] = useState({...user})
  const [initialValues, setInitialValues] = useState({})
  const [loading, setLoading] = useState(false)
  const [show, setShow] = useState(false)
  const [errors, setErrors] = useState({})
  const [profileImage, setProfileImage] = useState(user?.profileImage)

  const handleClose = () => {
    setShow(false)
    setInputValue(initialValues)
    setErrors({})
  }

  useEffect(() => {
    getEditProfile()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const getEditProfile = async () => {
    try {
      setLoading(true)
      const response = await ApiGet(`usermanagement/admin?_id=${user?._id}`)
      if (response.status === 200) {
        setInputValue(...response.data.data)
        setInitialValues(...response.data.data)
      }
      setLoading(false)
    } catch (err) {
      toast.error(err.message)
      setLoading(false)
    }
  }

  const validateForm = () => {
    let formIsValid = true
    let errors = {}

    if (inputValue && !inputValue.name) {
      formIsValid = false
      errors['name'] = '*Please Enter Name!'
    }
    if (inputValue && !inputValue.email) {
      formIsValid = false
      errors['email'] = '*Please Enter Email!'
    }
    if (inputValue && !inputValue.userRole) {
      formIsValid = false
      errors['userRole'] = '*Please Select User Role!'
    }
    if (inputValue && !inputValue.status) {
      formIsValid = false
      errors['status'] = '*Please Select Status!'
    }

    setErrors(errors)
    console.log('errors', errors)
    if (formIsValid) setShow(true)
    return formIsValid
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
        setLoading(true)
        const response = await ApiPut(`usermanagement/admin?_id=${user?._id}`, imageData)
        if (response.status === 200) {
          toast.success('Updated Successfully')
          getEditProfile()
          dispatch({
            type: 'UPDATE_SUCCESS',
            payload: response?.data,
          })
        }
        setLoading(false)
        handleClose()
      } catch (err) {
        toast.error(err.message)
        setLoading(false)
        handleClose()
      }
    }
  }

  const handleChange = (e) => {
    const {name, value} = e.target
    setInputValue({...inputValue, [name]: value})
    setErrors({...errors, [name]: ''})
  }

  const status = [
    {label: 'Active', value: 'Active'},
    {label: 'Inactive', value: 'Inactive'},
  ]

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
        {intl.formatMessage({id: 'MENU.SETTINGS.EDIT_PROFILE'})}
      </PageTitle>
      <Modal show={show} onHide={handleClose}>
        <>
          <Modal.Header closeButton>
            <Modal.Title className='text-danger'>Alert!</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to Edit the Admin Profile</Modal.Body>
          <Modal.Footer>
            <Button
              variant='secondary'
              onClick={() => {
                handleClose()
              }}
            >
              Cancel
            </Button>
            <Button variant='danger' onClick={handleUpdate}>
              Update
            </Button>
          </Modal.Footer>
        </>
      </Modal>
      <Box className='admin-wrapper'>
        <Box className='admin-profile-image-wrapper'>
          <Image
            className='admin-profile-image'
            src={process.env.REACT_APP_SERVER_URL + inputValue?.profileImage}
          />
        </Box>
        <Box className='settings-form'>
          <TextField
            className='admin-field'
            label='Name'
            type={'text'}
            onChange={(e) => handleChange(e)}
            name='name'
            variant='filled'
            margin='dense'
            value={inputValue?.name || ''}
          />
          <span
            style={{
              color: 'red',
              top: '5px',
              fontSize: '12px',
            }}
          >
            {errors['name']}
          </span>
          <TextField
            className='admin-field'
            label='Email'
            type={'email'}
            onChange={(e) => handleChange(e)}
            name='email'
            variant='filled'
            margin='dense'
            value={inputValue?.email || ''}
          />
          <span
            style={{
              color: 'red',
              top: '5px',
              fontSize: '12px',
            }}
          >
            {errors['email']}
          </span>
          <TextField
            className='admin-field'
            label='User Role'
            type={'text'}
            onChange={(e) => handleChange(e)}
            name='userRole'
            variant='filled'
            margin='dense'
            value={inputValue?.userRole || ''}
          />
          <span
            style={{
              color: 'red',
              top: '5px',
              fontSize: '12px',
            }}
          >
            {errors['userRole']}
          </span>
          <TextField
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
          </TextField>
          <TextField
            InputLabelProps={{shrink: true}}
            className='admin-field'
            label='Profile Image'
            type={'file'}
            onChange={(e) => setProfileImage(e.target.files[0])}
            name='profileImage'
            variant='filled'
            margin='dense'
          />
          <span
            style={{
              color: 'red',
              top: '5px',
              fontSize: '12px',
            }}
          >
            {errors['profileImage']}
          </span>

          <Box className='settings-btn-wrapper'>
            <Button
              className='button settings-btn-save'
              size='lg'
              variant='success'
              onClick={() => {
                validateForm()
              }}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  )
}

export {EditProfile}
