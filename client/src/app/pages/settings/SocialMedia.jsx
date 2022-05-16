/* eslint-disable jsx-a11y/anchor-is-valid */
import {useEffect, useState} from 'react'
import {useIntl} from 'react-intl'
import {PageTitle} from '../../../_metronic/layout/core'
import {ApiGet, ApiPut} from '../../../helpers/API/ApiData'
import {toast} from 'react-toastify'
import {Modal} from 'react-bootstrap'
import '../../App.css'
import {Box, CircularProgress} from '@material-ui/core'

const SocialMedia = () => {
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
    getSocialMedia()
  }, [])

  const getSocialMedia = async () => {
    try {
      setLoader(true)
      const response = await ApiGet(`setting/socialmedia`)
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
      const response = await ApiPut(`setting/socialmedia?_id=${inputValue?._id}`, inputValue)

      if (response.status === 200) {
        toast.success('Updated Successfully')
        getSocialMedia()
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

  const SocialMediaBreadCrumbs = [
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
      <PageTitle breadcrumbs={SocialMediaBreadCrumbs}>
        {intl.formatMessage({id: 'MENU.SETTINGS.SOCIAL_MEDIA'})}
      </PageTitle>
      <Modal show={show} onHide={handleClose}>
        <>
          <Modal.Header closeButton>
            <Modal.Title className='text-danger'>Alert!</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to Update the Social Media Settings</Modal.Body>
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
            <label className='col-lg-4 col-form-label fw-bold fs-6'>Facebook Page Url</label>

            <div className='col-lg-8 fv-row'>
              <input
                type='url'
                name='facebookPageUrl'
                className='form-control form-control-lg form-control-solid'
                placeholder='Enter Facebook Page Url'
                onChange={(e) => handleChange(e)}
                value={inputValue?.facebookPageUrl || ''}
              />
            </div>
          </div>

          <div className='row mb-6'>
            <label className='col-lg-4 col-form-label fw-bold fs-6'>LinkedIn Url</label>

            <div className='col-lg-8 fv-row'>
              <input
                type='url'
                name='linkedinUrl'
                className='form-control form-control-lg form-control-solid'
                placeholder='Enter LinkedIn Url'
                onChange={(e) => handleChange(e)}
                value={inputValue?.linkedinUrl || ''}
              />
            </div>
          </div>

          <div className='row mb-6'>
            <label className='col-lg-4 col-form-label fw-bold fs-6'>Instagram Url</label>

            <div className='col-lg-8 fv-row'>
              <input
                type='url'
                name='instagramUrl'
                className='form-control form-control-lg form-control-solid'
                placeholder='Enter Instagram Url'
                onChange={(e) => handleChange(e)}
                value={inputValue?.instagramUrl || ''}
              />
            </div>
          </div>

          <div className='row mb-6'>
            <label className='col-lg-4 col-form-label fw-bold fs-6'>Youtube Url</label>

            <div className='col-lg-8 fv-row'>
              <input
                type='url'
                name='youtubeUrl'
                className='form-control form-control-lg form-control-solid'
                placeholder='Enter Youtube Url'
                onChange={(e) => handleChange(e)}
                value={inputValue?.youtubeUrl || ''}
              />
            </div>
          </div>

          <div className='row mb-6'>
            <label className='col-lg-4 col-form-label fw-bold fs-6'>Facebook Application Id</label>

            <div className='col-lg-8 fv-row'>
              <input
                type='text'
                name='fbApplicationId'
                className='form-control form-control-lg form-control-solid'
                placeholder='Enter Facebook Application Id'
                onChange={(e) => handleChange(e)}
                value={inputValue?.fbApplicationId || ''}
              />
            </div>
          </div>

          <div className='row mb-6'>
            <label className='col-lg-4 col-form-label fw-bold fs-6'>Facebook Secret Id</label>

            <div className='col-lg-8 fv-row'>
              <input
                type='text'
                name='fbSecretId'
                className='form-control form-control-lg form-control-solid'
                placeholder='Enter Facebook Secret Id'
                onChange={(e) => handleChange(e)}
                value={inputValue?.fbSecretId || ''}
              />
            </div>
          </div>

          <div className='row mb-6'>
            <label className='col-lg-4 col-form-label fw-bold fs-6'>Google Application Id</label>

            <div className='col-lg-8 fv-row'>
              <input
                type='text'
                name='googleApplicationId'
                className='form-control form-control-lg form-control-solid'
                placeholder='Enter Google Application Id'
                onChange={(e) => handleChange(e)}
                value={inputValue?.googleApplicationId || ''}
              />
            </div>
          </div>

          <div className='row mb-6'>
            <label className='col-lg-4 col-form-label fw-bold fs-6'>Google Secret Key</label>

            <div className='col-lg-8 fv-row'>
              <input
                type='text'
                name='googleSecretKey'
                className='form-control form-control-lg form-control-solid'
                placeholder='Enter Google Secret Key'
                onChange={(e) => handleChange(e)}
                value={inputValue?.googleSecretKey || ''}
              />
            </div>
          </div>

          <div className='row mb-6'>
            <label className='col-lg-4 col-form-label fw-bold fs-6'>Google Play Store Url</label>

            <div className='col-lg-8 fv-row'>
              <input
                type='url'
                name='googlePlayStoreUrl'
                className='form-control form-control-lg form-control-solid'
                placeholder='Enter Google Play Store Url'
                onChange={(e) => handleChange(e)}
                value={inputValue?.googlePlayStoreUrl || ''}
              />
            </div>
          </div>

          <div className='row mb-6'>
            <label className='col-lg-4 col-form-label fw-bold fs-6'>Apple App Store Url</label>

            <div className='col-lg-8 fv-row'>
              <input
                type='url'
                name='appleAppStoreUrl'
                className='form-control form-control-lg form-control-solid'
                placeholder='Enter Apple App Store Url'
                onChange={(e) => handleChange(e)}
                value={inputValue?.appleAppStoreUrl || ''}
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

export {SocialMedia}
