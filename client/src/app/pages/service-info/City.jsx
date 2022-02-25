/* eslint-disable jsx-a11y/anchor-is-valid */
import {useEffect, useMemo, useState} from 'react'
import {useIntl} from 'react-intl'
import {Edit, Delete} from '@mui/icons-material'
import {PageTitle} from '../../../_metronic/layout/core'
import DataTable from 'react-data-table-component'
import {ApiGet, ApiDelete, ApiPut, ApiPost} from '../../../helpers/API/ApiData'
import {toast} from 'react-toastify'
import Dialog from '@material-ui/core/Dialog'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import ClearIcon from '@mui/icons-material/Clear'
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
  const [errors, setErrors] = useState({})

  const [filterText, setFilterText] = useState('')
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    setShow(false)
    setAddOpen(false)
    setErrors({})
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
  const validateForm = () => {
    let formIsValid = true
    let errors = {}

    if (inputValue && !inputValue.cityName) {
      formIsValid = false
      errors['cityName'] = '*Please Enter City Name !'
    }
    if (inputValue && !inputValue.stateId) {
      formIsValid = false
      errors['stateId'] = '*Please Enter State Name!'
    }
    if (inputValue && !inputValue.status) {
      formIsValid = false
      errors['status'] = '*Please Select Status!'
    }

    setErrors(errors)
    return formIsValid
  }

  const handleUpdate = async () => {
    if (validateForm()) {
      try {
        setLoading(true)
        const response = await ApiPut(`serviceinfo/city?_id=${rowId}`, inputValue)
        if (response.status === 200) {
          toast.success('Updated Successfully')
          setInputValue({})
          getCities()
          handleClose()
          setLoading(false)
        } else {
          setLoading(false)
          handleClose()
        }
      } catch (err) {
        toast.error(err.message)
        setLoading(false)
        handleClose()
      }
    }
  }

  const handleAdd = async () => {
    if (validateForm()) {
      try {
        setLoading(true)
        const response = await ApiPost(`serviceinfo/city`, inputValue)
        if (response.status === 200) {
          toast.success('Added Successfully')
          setInputValue({})
          getCities()
          setLoading(false)
          handleClose()
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

  const filteredItems = data.filter(
    (item) =>
      (item.cityName && item.cityName.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.stateName && item.stateName.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.status && item.status.toLowerCase().includes(filterText.toLowerCase()))
  )

  const subHeaderComponentMemo = useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle)
        setFilterText('')
      }
    }
    return (
      <Box
        sx={{
          display: 'flex',
          position: 'relative',
          lineHeight: '1.5',
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}
      >
        <TextField
          className='input-search'
          placeholder='Search'
          variant='outlined'
          margin='dense'
          onChange={(e) => setFilterText(e.target.value)}
          value={filterText}
        />
        <ClearIcon className='input-clear-button' onClick={handleClear} />
      </Box>
    )
  }, [filterText, resetPaginationToggle])

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
      <Box className='add-button-wrapper'>
        <Button
          className='add-button'
          variant='success'
          onClick={() => {
            setAddOpen(true)
            getStates()
          }}
        >
          Add New +
        </Button>
      </Box>
      <DataTable
        columns={columns}
        data={filteredItems}
        fixedHeader
        fixedHeaderScrollHeight='61vh'
        pagination
        paginationResetDefaultPage={resetPaginationToggle}
        subHeader
        subHeaderComponent={subHeaderComponentMemo}
        persistTableHead
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
              Cancel
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
            required
          />
          <span
            style={{
              color: 'red',
              top: '5px',
              fontSize: '12px',
            }}
          >
            {errors['cityName']}
          </span>
          <TextField
            label='State Name'
            onChange={(e) => handleChange(e)}
            name='stateId'
            fullWidth
            variant='standard'
            margin='dense'
            select
            value={inputValue?.stateId}
            required
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
          <span
            style={{
              color: 'red',
              top: '5px',
              fontSize: '12px',
            }}
          >
            {errors['stateId']}
          </span>
          <TextField
            label='Status'
            type={'text'}
            onChange={(e) => handleChange(e)}
            name='status'
            fullWidth
            variant='standard'
            value={inputValue?.status}
            margin='dense'
            select
            required
          >
            {status.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <span
            style={{
              color: 'red',
              top: '5px',
              fontSize: '12px',
            }}
          >
            {errors['status']}
          </span>
        </DialogContent>
        <Button
          className='button'
          size='lg'
          variant='success'
          onClick={() => {
            handleUpdate()
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
          <span
            style={{
              color: 'red',
              top: '5px',
              fontSize: '12px',
            }}
          >
            {errors['cityName']}
          </span>
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
          <span
            style={{
              color: 'red',
              top: '5px',
              fontSize: '12px',
            }}
          >
            {errors['stateId']}
          </span>
          <TextField
            label='Status'
            type={'text'}
            onChange={(e) => handleChange(e)}
            name='status'
            fullWidth
            variant='standard'
            margin='dense'
            required
            select
          >
            {status.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <span
            style={{
              color: 'red',
              top: '5px',
              fontSize: '12px',
            }}
          >
            {errors['status']}
          </span>
        </DialogContent>
        <Button onClick={handleAdd} className='button' size='lg' variant='success'>
          Save
        </Button>
      </Dialog>
    </>
  )
}
export {City}
