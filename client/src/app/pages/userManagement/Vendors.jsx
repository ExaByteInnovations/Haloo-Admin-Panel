/* eslint-disable jsx-a11y/anchor-is-valid */
import {useEffect, useState} from 'react'
import {useIntl} from 'react-intl'
import moment from 'moment'
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
import {Image} from 'react-bootstrap-v5'

const Vendors = () => {
  const intl = useIntl()
  const [vendors, setVendors] = useState([])
  const [open, setOpen] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [rowId, setRowId] = useState('')
  const [inputValue, setInputValue] = useState({})
  const [loading, setLoading] = useState(false)
  const [show, setShow] = useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    setShow(false)
    setAddOpen(false)
  }

  useEffect(() => {
    getVendors()
  }, [])

  const getVendors = async () => {
    try {
      setLoading(true)
      const response = await ApiGet(`usermanagement/vendor`)
      if (response.status === 200) {
        setVendors(response.data.data)
      }
      setLoading(false)
    } catch (err) {
      toast.error(err.message)
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      setLoading(true)
      const response = await ApiDelete(`usermanagement/vendor?_id=${rowId}`)

      if (response.status === 200) {
        getVendors()
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
    const imageData = new FormData()
    imageData.append('logo', inputValue.logo)
    imageData.append('companyName', inputValue.companyName)
    imageData.append('firstName', inputValue.firstName)
    imageData.append('lastName', inputValue.lastName)
    imageData.append('emailAddress', inputValue.emailAddress)
    imageData.append('phone', inputValue.phone)
    imageData.append('city', inputValue.city)
    imageData.append('state', inputValue.state)
    imageData.append('address', inputValue.address)
    imageData.append('pincode', inputValue.pincode)
    // imageData.append('averageRating', inputValue.averageRating)
    // imageData.append('lastAccessOn', inputValue.lastAccessOn)
    imageData.append('status', inputValue.status)
    try {
      setLoading(true)
      const response = await ApiPut(`usermanagement/vendor?_id=${rowId}`, imageData)

      if (response.status === 200) {
        toast.success('Updated Successfully')
        setInputValue({})
        getVendors()
      }
      setLoading(false)
      handleClose()
    } catch (err) {
      toast.error(err.message)
      setLoading(false)
      handleClose()
    }
  }

  const handleAdd = async () => {
    const imageData = new FormData()
    imageData.append('logo', inputValue.logo)
    imageData.append('companyName', inputValue.companyName)
    imageData.append('firstName', inputValue.firstName)
    imageData.append('lastName', inputValue.lastName)
    imageData.append('emailAddress', inputValue.emailAddress)
    imageData.append('phone', inputValue.phone)
    imageData.append('city', inputValue.city)
    imageData.append('state', inputValue.state)
    imageData.append('address', inputValue.address)
    imageData.append('pincode', inputValue.pincode)
    // imageData.append('averageRating', inputValue.averageRating)
    // imageData.append('lastAccessOn', inputValue.lastAccessOn)
    imageData.append('status', inputValue.status)

    try {
      setLoading(true)
      const response = await ApiPost(`usermanagement/vendor`, imageData)
      if (response.status === 200) {
        toast.success('Added Successfully')
        getVendors()
        setInputValue({})
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
    const {name, value, files} = e.target
    if (files) setInputValue({...inputValue, [name]: files[0]})
    else setInputValue({...inputValue, [name]: value})
  }

  const columns = [
    {
      name: 'Logo',
      cell: (row) => {
        return <Image className='image' src={process.env.REACT_APP_SERVER_URL + row.logo} />
      },
    },
    {
      name: 'Company Name',
      selector: (row) => row.companyName,
      sortable: true,
      width: '200px',
    },
    {
      name: 'First Name',
      selector: (row) => row.firstName,
      sortable: true,
      width: '150px',
    },
    {
      name: 'Last Name',
      selector: (row) => row.lastName,
      sortable: true,
      width: '150px',
    },
    {
      name: 'Email Address',
      selector: (row) => row.emailAddress,
      cell: (row) => <Box>{row.emailAddress}</Box>,
      sortable: true,
      width: '200px',
    },
    {
      name: 'Phone Number',
      selector: (row) => row.phone,
      sortable: true,
      width: '150px',
    },
    {
      name: 'Address',
      selector: (row) => row.address,
      cell: (row) => <Box>{row.address}</Box>,
      sortable: true,
      width: '200px',
    },
    {
      name: 'City',
      selector: (row) => row.city,
      sortable: true,
      width: '150px',
    },
    {
      name: 'State',
      selector: (row) => row.state,
      sortable: true,
      width: '150px',
    },
    {
      name: 'Postal Code',
      selector: (row) => row.pincode,
      sortable: true,
      width: '150px',
    },
    {
      name: 'No. of Jobs',
      selector: (row) => row.noOfJobs,
      sortable: true,
      width: '150px',
    },
    {
      name: 'Average Rating',
      selector: (row) => row.averageRating,
      cell: (row) => (
        <>
          {[...Array(row.rating)].map(() => (
            <div className='rating'>
              <div className='rating-label me-2 checked'>
                <i className='bi bi-star-fill fs-5'></i>
              </div>
            </div>
          ))}
        </>
      ),
      sortable: true,
      width: '150px',
    },
    {
      name: 'Member Since',
      selector: (row) => row.memberSince,
      sortable: true,
      width: '200px',
    },
    {
      name: 'Last Access',
      selector: (row) => row.lastAccess,
      sortable: true,
      width: '200px',
    },
    {
      name: 'Status',
      selector: (row) => row.status,
      sortable: true,
      width: '150px',
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
                setInputValue(row)
                setRowId(row.id)
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

  const data = vendors?.map((vendor) => {
    return {
      id: vendor?._id,
      logo: vendor?.logo,
      companyName: vendor?.companyName,
      firstName: vendor?.firstName,
      lastName: vendor?.lastName,
      emailAddress: vendor?.emailAddress,
      phone: vendor?.phone,
      address: vendor?.address,
      city: vendor?.city,
      state: vendor?.state,
      pincode: vendor?.pincode,
      noOfJobs: vendor?.noOfJobs,
      averageRating: vendor?.averageRating,
      memberSince: moment(vendor?.createdAt).format('DD MMM YY hh:mmA'),
      lastAccess: moment(vendor?.lastAccess).format('DD MMM YY hh:mmA'),
      status: vendor?.status?.charAt(0)?.toUpperCase() + vendor?.status?.substr(1)?.toLowerCase(),
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
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({id: 'MENU.USER_MANAGEMENT.VENDORS'})}
      </PageTitle>
      <Box className='add-button-wrapper' onClick={() => setAddOpen(true)}>
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
        <form onSubmit={handleUpdate}>
          <DialogContent>
            <TextField
              InputLabelProps={{shrink: true}}
              label='Logo'
              name='logo'
              type={'file'}
              onChange={handleChange}
              variant='standard'
              margin='dense'
              fullWidth
            />
            <TextField
              label='Company Name'
              type={'text'}
              name='companyName'
              onChange={handleChange}
              variant='standard'
              margin='dense'
              fullWidth
              value={inputValue?.companyName}
            />
            <TextField
              label='First Name'
              type={'text'}
              name='firstName'
              onChange={handleChange}
              variant='standard'
              margin='dense'
              fullWidth
              value={inputValue?.firstName}
            />
            <TextField
              label='Last Name'
              type={'text'}
              name='lastName'
              onChange={handleChange}
              variant='standard'
              margin='dense'
              fullWidth
              value={inputValue?.lastName}
            />
            <TextField
              label='Email Address'
              type={'email'}
              name='emailAddress'
              onChange={handleChange}
              variant='standard'
              margin='dense'
              fullWidth
              value={inputValue?.emailAddress}
            />
            <TextField
              label='Phone Number'
              type={'tel'}
              name='phone'
              onChange={handleChange}
              variant='standard'
              margin='dense'
              fullWidth
              value={inputValue?.phone}
            />
            <TextField
              label='Address'
              type={'text'}
              name='address'
              onChange={handleChange}
              variant='standard'
              margin='dense'
              fullWidth
              value={inputValue?.address}
            />
            <TextField
              label='City'
              type={'text'}
              name='city'
              onChange={handleChange}
              variant='standard'
              margin='dense'
              fullWidth
              value={inputValue?.city}
            />
            <TextField
              label='State'
              type={'text'}
              name='state'
              onChange={handleChange}
              variant='standard'
              margin='dense'
              fullWidth
              value={inputValue?.state}
            />
            <TextField
              label='Postal Code'
              inputProps={{inputMode: 'numeric', pattern: '[0-9]*'}}
              name='pincode'
              onChange={handleChange}
              variant='standard'
              margin='dense'
              fullWidth
              value={inputValue?.pincode}
            />
            <TextField
              label='Status'
              name='status'
              onChange={handleChange}
              variant='standard'
              margin='dense'
              fullWidth
              select
              value={inputValue?.status}
              defaultValue={
                inputValue?.status?.charAt(0)?.toUpperCase() +
                inputValue?.status?.substr(1)?.toLowerCase()
              }
            >
              {status.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </DialogContent>
          <Button className='button' size='lg' variant='success' type='submit'>
            Save
          </Button>
        </form>
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
              InputLabelProps={{shrink: true}}
              label='Logo'
              name='logo'
              type={'file'}
              onChange={(e) => handleChange(e)}
              variant='standard'
              margin='dense'
              fullWidth
              required
            />
            <TextField
              label='Company Name'
              type={'text'}
              name='companyName'
              onChange={(e) => handleChange(e)}
              variant='standard'
              margin='dense'
              fullWidth
              required
            />
            <TextField
              label='First Name'
              type={'text'}
              name='firstName'
              onChange={(e) => handleChange(e)}
              variant='standard'
              margin='dense'
              fullWidth
              required
            />
            <TextField
              label='Last Name'
              type={'text'}
              name='lastName'
              onChange={(e) => handleChange(e)}
              variant='standard'
              margin='dense'
              fullWidth
              required
            />
            <TextField
              label='Email Address'
              type={'email'}
              name='emailAddress'
              onChange={(e) => handleChange(e)}
              variant='standard'
              margin='dense'
              fullWidth
              required
            />
            <TextField
              label='Phone Number'
              type={'tel'}
              name='phone'
              onChange={(e) => handleChange(e)}
              variant='standard'
              margin='dense'
              fullWidth
              required
            />
            <TextField
              label='Address'
              type={'text'}
              name='address'
              onChange={(e) => handleChange(e)}
              variant='standard'
              margin='dense'
              fullWidth
              required
            />
            <TextField
              label='City'
              type={'text'}
              name='city'
              onChange={(e) => handleChange(e)}
              variant='standard'
              margin='dense'
              fullWidth
              required
            />
            <TextField
              label='State'
              type={'text'}
              name='state'
              onChange={(e) => handleChange(e)}
              variant='standard'
              margin='dense'
              fullWidth
              required
            />
            <TextField
              label='Postal Code'
              inputProps={{inputMode: 'numeric', pattern: '[0-9]*'}}
              name='pincode'
              onChange={(e) => handleChange(e)}
              variant='standard'
              margin='dense'
              fullWidth
              required
            />
            <TextField
              label='Status'
              name='status'
              onChange={(e) => handleChange(e)}
              variant='standard'
              margin='dense'
              fullWidth
              required
              select
            >
              {status.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </DialogContent>
          <Button className='button' size='lg' variant='success' type='submit'>
            Save
          </Button>
        </form>
      </Dialog>
    </>
  )
}

export {Vendors}
