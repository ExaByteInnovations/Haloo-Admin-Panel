/* eslint-disable jsx-a11y/anchor-is-valid */
import {useEffect, useState} from 'react'
import {useIntl} from 'react-intl'
import {Edit, Delete} from '@mui/icons-material'
import {PageTitle} from '../../../_metronic/layout/core'
import DataTable from 'react-data-table-component'
import {ApiGet, ApiDelete, ApiPut, ApiPost} from '../../../helpers/API/ApiData'
import {toast} from 'react-toastify'
import Dialog from '@material-ui/core/Dialog'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import {Button} from 'react-bootstrap'
import {Modal} from 'react-bootstrap'
import {
  Box,
  CircularProgress,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from '@material-ui/core'
import '../../App.css'

const City = () => {
  const intl = useIntl()
  const [cities, setCities] = useState([])
  const [states, setStates] = useState([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [show, setShow] = useState(false)
  const [rowId, setRowId] = useState('')
  const [inputValue, setInputValue] = useState({})

  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    setShow(false)
    setAddOpen(false)
  }

  useEffect(() => {
    getCities()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const getCities = async () => {
    setLoading(true)
    try {
      const response = await ApiGet(`serviceinfo/city`)
      if (response.status === 200) {
        setCities(response.data.data)
      }
      setLoading(false)
    } catch (err) {
      console.log(err)
      toast.error(err.message)
      setLoading(false)
    }
  }

  const getStates = async () => {
    setLoading(true)
    try {
      const response = await ApiGet(`serviceinfo/state`)
      if (response.status === 200) {
        setStates(
          response?.data?.data?.map((state) => {
            return {name: state?.stateName, id: state?._id}
          })
        )
      }
      setLoading(false)
    } catch (err) {
      console.log(err)
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      setLoading(true)
      const response = await ApiDelete(`serviceinfo/city?_id=${rowId}`)
      if (response.status === 200) {
        getCities()
        toast.success('Deleted Successfully')
      }
      setLoading(false)
      setShow(false)
    } catch (err) {
      toast.error(err.message)
      setLoading(false)
      setShow(false)
    }
  }

  const handleUpdate = async () => {
    try {
      setLoading(true)
      const response = await ApiPut(`serviceinfo/city?_id=${rowId}`, inputValue)
      if (response.status === 200) {
        toast.success('Updated Successfully')
        setInputValue({})
        getCities()
      }
      setLoading(false)
    } catch (err) {
      toast.error(err.message)
      setLoading(false)
    }
  }

  const handleAdd = async () => {
    try {
      setLoading(true)
      const response = await ApiPost(`serviceinfo/city`, inputValue)
      if (response.status === 200) {
        toast.success('Added Successfully')
        setInputValue({})
        getCities()
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

  const columns = [
    {
      name: 'City Name',
      selector: (row) => row.cityName,
      sortable: true,
    },
    {
      name: 'State Name',
      selector: (row) => row.stateName,
      sortable: true,
    },
    {
      name: 'Status',
      selector: (row) => row.status,
      sortable: true,
    },
    {
      name: 'Action',
      cell: (row) => {
        return (
          <>
            <Edit
              className='icon'
              onClick={() => {
                handleOpen()
                setRowId(row.id)
                setInputValue(row)
                getStates()
              }}
            />
            <Delete
              className='icon'
              color='error'
              onClick={() => {
                setShow(true)
                setRowId(row.id)
              }}
            />
          </>
        )
      },
    },
  ]

  const data = cities?.map((city) => {
    return {
      id: city?._id,
      cityName: city?.cityName,
      stateName: city?.stateDetails[0]?.stateName,
      stateId: city?.stateId,
      status: city?.status?.charAt(0)?.toUpperCase() + city?.status?.substr(1)?.toLowerCase(),
    }
  })

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
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.SERVICE_INFO.CITY'})}</PageTitle>
      <Box
        className='add-button-wrapper'
        onClick={() => {
          setAddOpen(true)
          getStates()
        }}
      >
        <Button className='add-button' variant='success'>
          Add New +
        </Button>
      </Box>
      <DataTable
        columns={columns}
        data={data}
        fixedHeader
        fixedHeaderScrollHeight='61vh'
        pagination
        highlightOnHover
        responsive
        striped
      />
      <Modal show={show} onHide={handleClose}>
        <>
          <Modal.Header closeButton>
            <Modal.Title className='text-danger'>Alert!</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete this row</Modal.Body>
          <Modal.Footer>
            <Button variant='secondary' onClick={handleClose}>
              cancel
            </Button>
            <Button
              variant='danger'
              onClick={() => {
                handleDelete()
              }}
            >
              Delete
            </Button>
          </Modal.Footer>
        </>
      </Modal>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth='xs'>
        <DialogTitle>
          <Box sx={{display: 'flex'}}>
            <Box flexGrow={1}>Edit Row</Box>
            <Box>
              <IconButton color='inherit' onClick={handleClose} aria-label='close'>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          <TextField
            label='City Name'
            type={'text'}
            onChange={(e) => handleChange(e)}
            name='cityName'
            fullWidth
            variant='standard'
            margin='dense'
            value={inputValue?.cityName}
          />
          <TextField
            label='State Name'
            onChange={(e) => handleChange(e)}
            name='stateId'
            fullWidth
            variant='standard'
            margin='dense'
            select
            value={inputValue?.stateId}
            defaultValue={inputValue?.stateId}
            SelectProps={{
              MenuProps: {
                style: {height: '300px'},
              },
            }}
          >
            {states.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label='Status'
            type={'text'}
            onChange={(e) => handleChange(e)}
            name='status'
            fullWidth
            variant='standard'
            value={inputValue?.status}
            defaultValue={
              inputValue?.status?.charAt(0)?.toUpperCase() +
              inputValue?.status?.substr(1)?.toLowerCase()
            }
            margin='dense'
            select
          >
            {status.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <Button
          className='button'
          size='lg'
          variant='success'
          onClick={() => {
            handleUpdate()
            handleClose()
          }}
        >
          Save
        </Button>
      </Dialog>

      <Dialog open={addOpen} onClose={handleClose} fullWidth maxWidth='xs'>
        <DialogTitle>
          <Box sx={{display: 'flex'}}>
            <Box flexGrow={1}>Add New Row</Box>
            <Box>
              <IconButton color='inherit' onClick={handleClose} aria-label='close'>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>
        <form onSubmit={handleAdd}>
          <DialogContent>
            <TextField
              label='City Name'
              type={'text'}
              onChange={(e) => handleChange(e)}
              name='cityName'
              fullWidth
              variant='standard'
              margin='dense'
              required
            />
            <TextField
              label='State Name'
              onChange={(e) => handleChange(e)}
              name='stateId'
              fullWidth
              variant='standard'
              margin='dense'
              required
              select
              SelectProps={{
                MenuProps: {
                  style: {height: '300px'},
                },
              }}
            >
              {states.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label='Status'
              type={'text'}
              onChange={(e) => handleChange(e)}
              name='status'
              fullWidth
              variant='standard'
              required
              margin='dense'
              select
            >
              {status.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </DialogContent>
          <Button type='submit' className='button' size='lg' variant='success'>
            Save
          </Button>
        </form>
      </Dialog>
    </>
  )
}
export {City}
