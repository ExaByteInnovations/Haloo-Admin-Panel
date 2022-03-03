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

const SocialMedia = () => {
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
    getSocialMedia()
  }, [])

  const getSocialMedia = async () => {
    try {
      setLoading(true)
      const response = await ApiGet(`setting/socialmedia`)
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
      const response = await ApiPut(`setting/socialmedia?_id=${inputValue?._id}`, inputValue)

      if (response.status === 200) {
        toast.success('Updated Successfully')
        getSocialMedia()
        handleClose()
      }
      setLoading(false)
    } catch (err) {
      toast.error(err.message)
      setLoading(false)
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
        {intl.formatMessage({id: 'MENU.SETTINGS.SOCIAL_MEDIA'})}
      </PageTitle>
      <Modal show={show} onHide={handleClose}>
        <>
          <Modal.Header closeButton>
            <Modal.Title className='text-danger'>Alert!</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to Update the Social Media Settings</Modal.Body>
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
          label='Facebook Page Url'
          type={'url'}
          onChange={(e) => handleChange(e)}
          name='facebookPageUrl'
          variant='filled'
          margin='dense'
          value={inputValue?.facebookPageUrl || ''}
        />
        <TextField
          className='settings-field'
          label='LinkedIn Url'
          type={'url'}
          onChange={(e) => handleChange(e)}
          name='linkedInUrl'
          variant='filled'
          margin='dense'
          value={inputValue?.linkedInUrl || ''}
        />
        <TextField
          className='settings-field'
          label='Instagram Url'
          type={'url'}
          onChange={(e) => handleChange(e)}
          name='InstagramUrl'
          variant='filled'
          margin='dense'
          value={inputValue?.InstagramUrl || ''}
        />
        <TextField
          className='settings-field'
          label='Youtube Url'
          type={'url'}
          onChange={(e) => handleChange(e)}
          name='youtubeUrl'
          variant='filled'
          margin='dense'
          value={inputValue?.youtubeUrl || ''}
        />
        <TextField
          className='settings-field'
          label='Facebook Application Id'
          type={'text'}
          onChange={(e) => handleChange(e)}
          name='fbApplicationId'
          variant='filled'
          margin='dense'
          value={inputValue?.fbApplicationId || ''}
        />
        <TextField
          className='settings-field'
          label='Facebook Secret Id'
          type={'text'}
          onChange={(e) => handleChange(e)}
          name='fbSecretId'
          variant='filled'
          margin='dense'
          value={inputValue?.fbSecretId || ''}
        />
        <TextField
          className='settings-field'
          label='Google Application Id'
          type={'text'}
          onChange={(e) => handleChange(e)}
          name='googleApplicationId'
          variant='filled'
          margin='dense'
          value={inputValue?.googleApplicationId}
        />
        <TextField
          className='settings-field'
          label='Google Secret Key'
          type={'text'}
          onChange={(e) => handleChange(e)}
          name='googleSecretKey'
          variant='filled'
          margin='dense'
          value={inputValue?.googleSecretKey || ''}
        />
        <TextField
          className='settings-field'
          label='Google Play Store Url'
          type={'url'}
          onChange={(e) => handleChange(e)}
          name='googlePlayStoreUrl'
          variant='filled'
          margin='dense'
          value={inputValue?.googlePlayStoreUrl || ''}
        />
        <TextField
          className='settings-field'
          label='Apple App Store Url'
          type={'url'}
          onChange={(e) => handleChange(e)}
          name='appleAppStoreUrl'
          variant='filled'
          margin='dense'
          value={inputValue?.appleAppStoreUrl || ''}
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

export {SocialMedia}
