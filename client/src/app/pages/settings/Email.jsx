/* eslint-disable jsx-a11y/anchor-is-valid */
import {useEffect, useState} from 'react'
import {useIntl} from 'react-intl'
import {PageTitle} from '../../../_metronic/layout/core'
import {ApiGet, ApiPut} from '../../../helpers/API/ApiData'
import {toast} from 'react-toastify'
import {Modal} from 'react-bootstrap'
import '../../App.css'
import {Box, CircularProgress} from '@material-ui/core'

const Email = () => {
  const intl = useIntl()
  const [inputValue, setInputValue] = useState({})
  const [initialValues, setInitialValues] = useState({})
  const [loading, setLoading] = useState(false)
  const [loader, setLoader] = useState(false)
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
      setLoader(true)
      const response = await ApiGet(`setting/email`)
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

  const handleUpdate = async () => {
    try {
      const response = await ApiPut(`setting/email?_id=${inputValue?._id}`, inputValue)

      if (response.status === 200) {
        toast.success('Updated Successfully')
        getEmail()
        handleClose()
      }
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleChange = (e) => {
    const {name, value} = e.target
    setInputValue({...inputValue, [name]: value})
  }

  if (loader) {
    return (
      <Box className='loader'>
        <CircularProgress color='secondary' />
      </Box>
    )
  }

  const EmailBreadCrumbs = [
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

  return (
    <>
      <PageTitle breadcrumbs={EmailBreadCrumbs}>
        {intl.formatMessage({id: 'MENU.SETTINGS.EMAIL'})}
      </PageTitle>
      <Modal show={show} onHide={handleClose}>
        <>
          <Modal.Header closeButton>
            <Modal.Title className='text-danger'>Alert!</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to Update the Email Settings</Modal.Body>
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
        <div className='card-body border-top p-9'>
          <div className='row mb-6'>
            <label className='col-lg-4 col-form-label fw-bold fs-6'>
              Administrator Email Address
            </label>

            <div className='col-lg-8 fv-row'>
              <input
                type='email'
                name='administerEmailAddress'
                className='form-control form-control-lg form-control-solid'
                placeholder='Enter Administrator Email Address'
                onChange={(e) => handleChange(e)}
                value={inputValue?.administerEmailAddress || ''}
              />
            </div>
          </div>

          <div className='row mb-6'>
            <label className='col-lg-4 col-form-label fw-bold fs-6'>Support Email Address</label>

            <div className='col-lg-8 fv-row'>
              <input
                type='email'
                name='supportEmailAddress'
                className='form-control form-control-lg form-control-solid'
                placeholder='Enter Support Email Address'
                onChange={(e) => handleChange(e)}
                value={inputValue?.supportEmailAddress || ''}
              />
            </div>
          </div>

          <div className='row mb-6'>
            <label className='col-lg-4 col-form-label fw-bold fs-6'>
              Notification Email Address
            </label>

            <div className='col-lg-8 fv-row'>
              <input
                type='email'
                name='notificationEmailAddress'
                className='form-control form-control-lg form-control-solid'
                placeholder='Enter Notification Email Address'
                onChange={(e) => handleChange(e)}
                value={inputValue?.notificationEmailAddress || ''}
              />
            </div>
          </div>

          <div className='row mb-6'>
            <label className='col-lg-4 col-form-label fw-bold fs-6'>SMTP Server Host</label>

            <div className='col-lg-8 fv-row'>
              <input
                type='url'
                name='smtpServerHost'
                className='form-control form-control-lg form-control-solid'
                placeholder='Enter SMTP Server Host'
                onChange={(e) => handleChange(e)}
                value={inputValue?.smtpServerHost || ''}
              />
            </div>
          </div>

          <div className='row mb-6'>
            <label className='col-lg-4 col-form-label fw-bold fs-6'>SMTP Server User Name</label>

            <div className='col-lg-8 fv-row'>
              <input
                type='text'
                name='smtpServerUserName'
                className='form-control form-control-lg form-control-solid'
                placeholder='Enter SMTP Server User Name'
                onChange={(e) => handleChange(e)}
                value={inputValue?.smtpServerUserName || ''}
              />
            </div>
          </div>

          <div className='row mb-6'>
            <label className='col-lg-4 col-form-label fw-bold fs-6'>SMTP Server Password</label>

            <div className='col-lg-8 fv-row'>
              <input
                type='password'
                name='smtpServerPassword'
                className='form-control form-control-lg form-control-solid'
                placeholder='Enter SMTP Server Password'
                onChange={(e) => handleChange(e)}
                value={inputValue?.smtpServerPassword || ''}
              />
            </div>
          </div>

          <div className='row mb-6'>
            <label className='col-lg-4 col-form-label fw-bold fs-6'>SMTP Server Port</label>

            <div className='col-lg-8 fv-row'>
              <input
                type='text'
                name='smtpServerPort'
                className='form-control form-control-lg form-control-solid'
                placeholder='Enter SMTP Server Port'
                onChange={(e) => handleChange(e)}
                value={inputValue?.smtpServerPort || ''}
              />
            </div>
          </div>
        </div>
        <div className='card-footer d-flex justify-content-end py-6 px-9'>
          <button
            type='submit'
            className='btn btn-primary'
            disabled={loading}
            onClick={() => setShow(true)}
          >
            Save Changes
          </button>
        </div>
      </div>
    </>
  )
}

export {Email}
