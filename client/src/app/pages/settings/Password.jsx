/* eslint-disable jsx-a11y/anchor-is-valid */
import {useContext, useState} from 'react'
import {useIntl} from 'react-intl'
import {PageTitle} from '../../../_metronic/layout/core'
import {ApiPost} from '../../../helpers/API/ApiData'
import {toast} from 'react-toastify'
import {Button} from 'react-bootstrap'
import {Modal} from 'react-bootstrap'
import {Box, CircularProgress, TextField} from '@material-ui/core'
import '../../App.css'
import {AuthContext} from '../../auth/authContext'

const Password = () => {
  const intl = useIntl()
  const {user, dispatch} = useContext(AuthContext)
  const [inputValue, setInputValue] = useState({})
  const [loading, setLoading] = useState(false)
  const [show, setShow] = useState(false)

  const handleClose = () => {
    setShow(false)
  }

  const handleUpdate = async () => {
    try {
      setLoading(true)
      const response = await ApiPost(`auth/admin/resetpassword?_id=${user?._id}`, {
        email: user?.email,
        password: inputValue?.password,
      })

      if (response.status === 201) {
        toast.success('Updated Successfully')
        dispatch({
          type: 'UPDATE_SUCCESS',
          payload: response.data,
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

  const handleChange = (e) => {
    const {name, value} = e.target
    setInputValue({...inputValue, [name]: value})
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
      <Modal show={show} onHide={handleClose}>
        <>
          <Modal.Header closeButton>
            <Modal.Title className='text-danger'>Alert!</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to Update the Password</Modal.Body>
          <Modal.Footer>
            <Button variant='secondary' onClick={handleClose}>
              Cancel
            </Button>
            <Button variant='danger' onClick={handleUpdate}>
              Update
            </Button>
          </Modal.Footer>
        </>
      </Modal>
      <Box className='settings-form'>
        <TextField
          className='settings-field'
          label='New Password'
          type={'password'}
          onChange={(e) => handleChange(e)}
          name='password'
          variant='filled'
          margin='dense'
        />
        <TextField
          className='settings-field'
          label='Confirm Password'
          type={'password'}
          onChange={(e) => handleChange(e)}
          name='confirmPassword'
          variant='filled'
          margin='dense'
        />
        <Box className='settings-btn-wrapper'>
          <Button
            className='button settings-btn-save'
            size='lg'
            variant='success'
            onClick={() => setShow(true)}
          >
            Save
          </Button>
        </Box>
      </Box>
    </>
  )
}

export {Password}
