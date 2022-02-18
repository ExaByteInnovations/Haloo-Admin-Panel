/* eslint-disable jsx-a11y/anchor-is-valid */
import {useEffect, useState} from 'react'
import {useIntl} from 'react-intl'
import {PageTitle} from '../../../_metronic/layout/core'
import {ApiGet, ApiPut} from '../../../helpers/API/ApiData'
import {toast} from 'react-toastify'
import {Button} from 'react-bootstrap'
import {Modal} from 'react-bootstrap'
import {Box, CircularProgress, InputAdornment, TextField} from '@material-ui/core'
import '../../App.css'

const MasterSettings = () => {
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
    getMasterSettings()
  }, [])

  const getMasterSettings = async () => {
    try {
      setLoading(true)
      const response = await ApiGet(`setting/master`)
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
      const response = await ApiPut(`setting/master?_id=${inputValue?._id}`, inputValue)

      if (response.status === 200) {
        toast.success('Updated Successfully')
        getMasterSettings()
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
        {intl.formatMessage({id: 'MENU.SETTINGS.MASTER_SETTINGS'})}
      </PageTitle>
      <Modal show={show} onHide={handleClose}>
        <>
          <Modal.Header closeButton>
            <Modal.Title className='text-danger'>Alert!</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to Update the Master Settings</Modal.Body>
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
          label='Copyright Text'
          type={'text'}
          onChange={(e) => handleChange(e)}
          name='copyrightText'
          variant='filled'
          margin='dense'
          value={inputValue?.copyrightText}
        />
        <TextField
          className='settings-field'
          label='Site Control Panel Title'
          type={'text'}
          onChange={(e) => handleChange(e)}
          name='siteControlPanelTitle'
          variant='filled'
          margin='dense'
          value={inputValue?.siteControlPanelTitle}
        />
        <TextField
          className='settings-field'
          label='Valid Image Extensions'
          type={'text'}
          onChange={(e) => handleChange(e)}
          name='validImageExtensions'
          variant='filled'
          margin='dense'
          value={inputValue?.validImageExtensions}
        />
        <TextField
          className='settings-field'
          label='No. of Records Per Page'
          inputProps={{inputMode: 'numeric', pattern: '[0-9]*'}}
          onChange={(e) => handleChange(e)}
          name='noOfRecordsPerPage'
          variant='filled'
          margin='dense'
          value={inputValue?.noOfRecordsPerPage}
        />
        <TextField
          className='settings-field'
          label='Rewards Amount'
          inputProps={{inputMode: 'numeric', pattern: '[0-9]*'}}
          onChange={(e) => handleChange(e)}
          name='rewardsAmount'
          variant='filled'
          margin='dense'
          value={inputValue?.rewardsAmount}
          InputProps={{
            startAdornment: <InputAdornment position='start'>€</InputAdornment>,
          }}
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

export {MasterSettings}
