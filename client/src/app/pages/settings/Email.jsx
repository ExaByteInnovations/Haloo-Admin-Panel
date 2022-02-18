/* eslint-disable jsx-a11y/anchor-is-valid */
import {useEffect, useState} from 'react'
import {useIntl} from 'react-intl'
import {PageTitle} from '../../../_metronic/layout/core'
import {ApiGet, ApiPut} from '../../../helpers/API/ApiData'
import {toast} from 'react-toastify'
import {Button} from 'react-bootstrap'
import {Modal} from 'react-bootstrap'
import {Box, CircularProgress, TextField} from '@material-ui/core'
import '../../App.css'

const Email = () => {
  const intl = useIntl()
  const [inputValue, setInputValue] = useState({})
  const [initialValues, setInitialValues] = useState({})
  const [loading, setLoading] = useState(false)
  const [show, setShow] = useState(false)

  const handleClose = () => {
    setShow(false)
    setInputValue(initialValues)
  }

  useEffect(() => {
    getEmail()
  }, [])

  const getEmail = async () => {
    try {
      setLoading(true)
      const response = await ApiGet(`setting/email`)
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

  const handleUpdate = async () => {
    try {
      setLoading(true)
      const response = await ApiPut(`setting/email?_id=${inputValue?._id}`, inputValue)

      if (response.status === 200) {
        toast.success('Updated Successfully')
        getEmail()
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
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.SETTINGS.EMAIL'})}</PageTitle>
      <Modal show={show} onHide={handleClose}>
        <>
          <Modal.Header closeButton>
            <Modal.Title className='text-danger'>Alert!</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to Update the Email Settings</Modal.Body>
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
          label='Administrator Email Address'
          type={'email'}
          onChange={(e) => handleChange(e)}
          name='administratorEmailAddress'
          variant='filled'
          margin='dense'
          value={inputValue?.administratorEmailAddress}
        />
        <TextField
          className='settings-field'
          label='Support Email Address'
          type={'email'}
          onChange={(e) => handleChange(e)}
          name='supportEmailAddress'
          variant='filled'
          margin='dense'
          value={inputValue?.supportEmailAddress}
        />
        <TextField
          className='settings-field'
          label='Notification Email Address'
          type={'email'}
          onChange={(e) => handleChange(e)}
          name='notificationEmailAddress'
          variant='filled'
          margin='dense'
          value={inputValue?.notificationEmailAddress}
        />
        <TextField
          className='settings-field'
          label='SMTP Server Host'
          type={'url'}
          onChange={(e) => handleChange(e)}
          name='smtpServerHost'
          variant='filled'
          margin='dense'
          value={inputValue?.smtpServerHost}
        />
        <TextField
          className='settings-field'
          label='SMTP Server User Name'
          type={'email'}
          onChange={(e) => handleChange(e)}
          name='smtpServerUserName'
          variant='filled'
          margin='dense'
          value={inputValue?.smtpServerUserName}
        />
        <TextField
          className='settings-field'
          label='SMTP Server Password'
          type={'password'}
          onChange={(e) => handleChange(e)}
          name='smtpServerPassword'
          variant='filled'
          margin='dense'
          value={inputValue?.smtpServerPassword}
        />
        <TextField
          className='settings-field'
          label='SMTP Server Port'
          inputProps={{inputMode: 'numeric', pattern: '[0-9]*'}}
          onChange={(e) => handleChange(e)}
          name='smtpServerPort'
          variant='filled'
          margin='dense'
          value={inputValue?.smtpServerPort}
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

export {Email}
