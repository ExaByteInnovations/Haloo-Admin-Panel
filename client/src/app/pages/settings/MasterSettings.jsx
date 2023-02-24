/* eslint-disable jsx-a11y/anchor-is-valid */
import {useContext, useEffect, useState} from 'react'
import {useIntl} from 'react-intl'
import {PageTitle} from '../../../_metronic/layout/core'
import {ApiGet, ApiPut} from '../../../helpers/API/ApiData'
import {toast} from 'react-toastify'
import {Modal} from 'react-bootstrap'
import {Chip, TextField, CircularProgress, Box} from '@material-ui/core'
import '../../App.css'
import {Autocomplete} from '@mui/material'
import {MasterContext} from '../../context/masterContext'

const MasterSettings = () => {
  const intl = useIntl()
  const {dispatch} = useContext(MasterContext)
  const [inputValue, setInputValue] = useState({})
  const [initialValues, setInitialValues] = useState({})
  const [loading, setLoading] = useState(false)
  const [loader, setLoader] = useState(false)
  const [show, setShow] = useState(false)
  const [imageExtension, setImageExtension] = useState([])
  // const [errors, setErrors] = useState({})

  const handleClose = () => {
    setShow(false)
    setInputValue(initialValues)
  }

  useEffect(() => {
    getMasterSettings()
  }, [])

  const getMasterSettings = async () => {
    try {
      setLoader(true)
      const response = await ApiGet(`setting/master`)
      if (response.status === 200) {
        const masterSettings = response.data.data
        setInputValue(...response.data.data)
        setInitialValues(...response.data.data)
        setImageExtension(masterSettings[0]?.validImageExtensions)
      }
      setLoader(false)
    } catch (err) {
      toast.error(err.message)
      setLoader(false)
    }
  }

  // const validateForm = () => {
  //   let formIsValid = true
  //   let errors = {}
  //   if (inputValue && !inputValue?.rewardsAmount?.match(/^\d$/)) {
  //     formIsValid = false
  //     errors['amount'] = '*Please Enter Valid Reward Amount!'
  //   }

  //   setErrors(errors)
  //   if (formIsValid) setShow(true)
  //   return formIsValid
  // }

  const handleUpdate = async () => {
    // if (validateForm()) {
    try {
      const response = await ApiPut(`setting/master?_id=${inputValue?._id}`, {
        ...inputValue,
        validImageExtensions: imageExtension,
      })

      if (response.status === 200) {
        toast.success('Updated Successfully')
        getMasterSettings()
        dispatch({
          type: 'SET_IMG_EXTS',
          payload: imageExtension,
        })
        handleClose()
      }
    } catch (err) {
      toast.error(err.message)
    }
    // }
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

  const MasterSettingsBreadCrumbs = [
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
      <PageTitle breadcrumbs={MasterSettingsBreadCrumbs}>
        {intl.formatMessage({id: 'MENU.SETTINGS.MASTER_SETTINGS'})}
      </PageTitle>
      <Modal show={show} onHide={handleClose}>
        <>
          <Modal.Header closeButton>
            <Modal.Title className='text-danger'>Alert!</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to Update the Master Settings</Modal.Body>
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
            <label className='col-lg-4 col-form-label fw-bold fs-6'>Copy Right Text</label>

            <div className='col-lg-8 fv-row'>
              <input
                type='text'
                name='copyrightText'
                className='form-control form-control-lg form-control-solid'
                placeholder='Copy Right Text'
                onChange={(e) => handleChange(e)}
                value={inputValue?.copyrightText || ''}
              />
            </div>
          </div>

          <div className='row mb-6'>
            <label className='col-lg-4 col-form-label fw-bold fs-6'>Site Control Panel Title</label>

            <div className='col-lg-8 fv-row'>
              <input
                type='text'
                name='siteControlPanelTitle'
                className='form-control form-control-lg form-control-solid'
                placeholder='Site Control Panel Title'
                onChange={(e) => handleChange(e)}
                value={inputValue?.siteControlPanelTitle || ''}
              />
            </div>
          </div>

          <div className='row mb-6'>
            <label className='col-lg-4 col-form-label fw-bold fs-6'>Rewards Amount</label>

            <div className='col-lg-8 fv-row'>
              <input
                type='number'
                name='rewardsAmount'
                className='form-control form-control-lg form-control-solid'
                placeholder='Rewards Amount'
                onChange={(e) => handleChange(e)}
                value={inputValue?.rewardsAmount || ''}
              />
            </div>
          </div>
          <div className='row mb-6'>
            <label className='col-lg-4 col-form-label fw-bold fs-6'>Valid Image Extensions</label>
            <div className='col-lg-8 fv-row'>
              <Autocomplete
                className='settings-field'
                multiple
                options={[]}
                defaultValue={[]}
                value={imageExtension}
                freeSolo
                onChange={(e, value) => setImageExtension((state) => value)}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => {
                    return (
                      <Chip
                        className='chip'
                        key={index}
                        variant='outlined'
                        label={option}
                        {...getTagProps({index})}
                      />
                    )
                  })
                }
                renderInput={(params) => (
                  <>
                    <TextField
                      {...params}
                      InputProps={{
                        ...params.InputProps,
                        disableUnderline: true,
                        className: 'form-control form-control-lg form-control-solid',
                      }}
                      placeholder={imageExtension.length > 0 ? '' : 'Valid Image Extensions'}
                      type={'text'}
                      onChange={(e) => handleChange(e)}
                      name='validImageExtensions'
                      helperText="Please don't add '.' before the extension and press Enter key to add the extension"
                    />
                  </>
                )}
              />
            </div>
          </div>
        </div>
        <div className='card-footer d-flex justify-content-end py-6 px-9'>
          <button className='btn btn-primary' disabled={loading} onClick={() => setShow(true)}>
            Save Changes
          </button>
        </div>
      </div>
    </>
  )
}

export {MasterSettings}
