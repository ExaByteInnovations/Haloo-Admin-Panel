/* eslint-disable jsx-a11y/anchor-is-valid */
import {useEffect, useMemo, useState} from 'react'
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
import ClearIcon from '@mui/icons-material/Clear'
import userImage from '../../../assets/user.png'
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

const Customers = () => {
  const intl = useIntl()
  const [customers, setCustomers] = useState([])
  const [open, setOpen] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [rowId, setRowId] = useState('')
  const [inputValue, setInputValue] = useState({})
  const [loading, setLoading] = useState(false)
  const [show, setShow] = useState(false)
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
    getCustomers()
  }, [])

  const getCustomers = async () => {
    try {
      setLoading(true)
      const response = await ApiGet(`usermanagement/customer?type=customer`)
      if (response.status === 200) {
        setCustomers(response.data.data)
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
      const response = await ApiDelete(`usermanagement/customer?_id=${rowId}`)

      if (response.status === 200) {
        getCustomers()
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

    if (inputValue && !inputValue.customerName) {
      formIsValid = false
      errors['customerName'] = '*Please Enter Customer Name!'
    }
    if (inputValue && !inputValue.phone) {
      formIsValid = false
      errors['phone'] = '*Please Enter Phone Number!'
    }
    if (inputValue && !inputValue.profileImage && addOpen) {
      formIsValid = false
      errors['profileImage'] = '*Please Select ProfileImage!'
    }
    if (inputValue && !inputValue.city) {
      formIsValid = false
      errors['city'] = '*Please Enter City!'
    }
    if (inputValue && !inputValue.state) {
      formIsValid = false
      errors['state'] = '*Please Enter State!'
    }
    if (inputValue && !inputValue.pincode) {
      formIsValid = false
      errors['pincode'] = '*Please Enter Postal Code!'
    }
    if (inputValue && !inputValue.address) {
      formIsValid = false
      errors['address'] = '*Please Enter Address!'
    }
    setErrors(errors)
    return formIsValid
  }

  const handleUpdate = async () => {
    if (validateForm()) {
      const imageData = new FormData()
      imageData.append('profileImage', inputValue.profileImage)
      imageData.append('customerName', inputValue.customerName)
      imageData.append('city', inputValue.city)
      imageData.append('phone', inputValue.phone)
      imageData.append('state', inputValue.state)
      imageData.append('address', inputValue.address)
      imageData.append('pincode', inputValue.pincode)
      // imageData.append('status', inputValue.status)
      // imageData.append('codStatus', inputValue.codStatus)
      try {
        setLoading(true)
        const response = await ApiPut(`usermanagement/customer?_id=${rowId}`, imageData)

        if (response.status === 200) {
          toast.success('Updated Successfully')
          setInputValue({})
          getCustomers()
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

  const handleAdd = async () => {
    if (validateForm()) {
      const imageData = new FormData()
      imageData.append('profileImage', inputValue?.profileImage || '')
      imageData.append('customerName', inputValue?.customerName)
      imageData.append('city', inputValue?.city || '')
      imageData.append('phone', inputValue?.phone)
      imageData.append('state', inputValue?.state || '')
      imageData.append('address', inputValue?.address || '')
      imageData.append('pincode', inputValue?.pincode || '')
      imageData.append('type', 'customer')
      // imageData.append('status', inputValue?.status)
      // imageData.append('codStatus', inputValue?.codStatus)

      try {
        setLoading(true)
        const response = await ApiPost(`usermanagement/customer?type=customer`, imageData)
        if (response.status === 200) {
          toast.success('Added Successfully')
          getCustomers()
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
  }

  const handleChange = (e) => {
    const {name, value, files} = e.target
    if (files) {
      setInputValue({...inputValue, [name]: files[0]})
      setErrors({...errors, [name]: ''})
    } else {
      setInputValue({...inputValue, [name]: value})
      setErrors({...errors, [name]: ''})
    }
  }

  const columns = [
    {
      name: 'Profile Image',
      cell: (row) => {
        return (
          <Image
            className='image'
            src={row.profileImage ? process.env.REACT_APP_SERVER_URL + row.profileImage : userImage}
          />
        )
      },
    },
    {
      name: 'Customer Name',
      selector: (row) => row.customerName,
      cell: (row) => <Box>{row.customerName}</Box>,
      sortable: true,
      width: '200px',
    },
    {
      name: 'Phone',
      selector: (row) => row.phone,
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
      name: 'Address',
      selector: (row) => row.address,
      cell: (row) => {
        return <Box>{row.address}</Box>
      },
      sortable: true,
      width: '200px',
    },
    {
      name: 'No. of Jobs',
      selector: (row) => row.noOfJobs,
      sortable: true,
      width: '150px',
    },
    {
      name: 'Member Since',
      selector: (row) => row.memberSince,
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
                setRowId(row.id)
                setInputValue(row)
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

  const data = customers?.map((customer) => {
    return {
      id: customer?._id,
      profileImage: customer?.profileImage,
      customerName: customer?.customerName,
      phone: customer?.phone,
      city: customer?.city,
      state: customer?.state,
      pincode: customer?.pincode,
      address: customer?.address,
      noOfJobs: customer?.noOfJobs,
      memberSince: moment(customer?.createdAt).format('DD MMM YY hh:mmA'),
      // codStatus:
      //   customer?.codStatus?.charAt(0)?.toUpperCase() +
      //   customer?.codStatus?.substr(1)?.toLowerCase(),
      // status:
      //   customer?.status?.charAt(0)?.toUpperCase() + customer?.status?.substr(1)?.toLowerCase(),
    }
  })

  const filteredItems = data.filter(
    (item) =>
      (item.phone && item.phone.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.customerName && item.customerName.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.pincode && item.pincode.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.city && item.city.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.state && item.state.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.address && item.address.toLowerCase().includes(filterText.toLowerCase()))
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

  // const status = [
  //   {label: 'Active', value: 'Active'},
  //   {label: 'Inactive', value: 'Inactive'},
  // ]

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
        {intl.formatMessage({id: 'MENU.USER_MANAGEMENT.CUSTOMERS'})}
      </PageTitle>
      <Box className='add-button-wrapper'>
        <Button className='add-button' variant='success' onClick={() => setAddOpen(true)}>
          Add New +
        </Button>
      </Box>
      <DataTable
        columns={columns}
        data={filteredItems}
        fixedHeader
        fixedHeaderScrollHeight='51vh'
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
            InputLabelProps={{shrink: true}}
            label='Profile Image'
            type={'file'}
            onChange={(e) => handleChange(e)}
            name='profileImage'
            fullWidth
            variant='standard'
            margin='dense'
          />
          <TextField
            label='Customer Name'
            type={'text'}
            onChange={(e) => handleChange(e)}
            name='customerName'
            fullWidth
            variant='standard'
            margin='dense'
            value={inputValue?.customerName}
            required
          />
          <span
            style={{
              color: 'red',
              top: '5px',
              fontSize: '12px',
            }}
          >
            {errors['customerName']}
          </span>
          <TextField
            label='Phone'
            type={'tel'}
            onChange={(e) => handleChange(e)}
            name='phone'
            fullWidth
            variant='standard'
            margin='dense'
            value={inputValue?.phone}
            required
          />
          <span
            style={{
              color: 'red',
              top: '5px',
              fontSize: '12px',
            }}
          >
            {errors['phone']}
          </span>
          <TextField
            label='Postal Code'
            inputProps={{inputMode: 'numeric', pattern: '[0-9]*'}}
            onChange={(e) => handleChange(e)}
            name='pincode'
            fullWidth
            variant='standard'
            margin='dense'
            value={inputValue?.pincode}
            required
          />
          <span
            style={{
              color: 'red',
              top: '5px',
              fontSize: '12px',
            }}
          >
            {errors['pincode']}
          </span>
          <TextField
            label='City'
            type={'text'}
            onChange={(e) => handleChange(e)}
            name='city'
            fullWidth
            variant='standard'
            margin='dense'
            value={inputValue?.city}
            required
          />
          <span
            style={{
              color: 'red',
              top: '5px',
              fontSize: '12px',
            }}
          >
            {errors['city']}
          </span>
          <TextField
            label='State'
            type={'text'}
            onChange={(e) => handleChange(e)}
            name='state'
            fullWidth
            variant='standard'
            margin='dense'
            value={inputValue?.state}
            required
          />
          <span
            style={{
              color: 'red',
              top: '5px',
              fontSize: '12px',
            }}
          >
            {errors['state']}
          </span>
          <TextField
            label='Address'
            type={'text'}
            onChange={(e) => handleChange(e)}
            name='address'
            fullWidth
            variant='standard'
            margin='dense'
            value={inputValue?.address}
            required
          />
          <span
            style={{
              color: 'red',
              top: '5px',
              fontSize: '12px',
            }}
          >
            {errors['address']}
          </span>
          {/* <TextField
              label='Cod Status'
              onChange={(e) => handleChange(e)}
              name='codStatus'
              fullWidth
              variant='standard'
              margin='dense'
              value={inputValue?.codStatus}
              defaultValue={
                inputValue?.codStatus?.charAt(0)?.toUpperCase() +
                inputValue?.codStatus?.substr(1)?.toLowerCase()
              }
              select
            >
              {status.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label='Status'
              onChange={(e) => handleChange(e)}
              name='status'
              fullWidth
              variant='standard'
              margin='dense'
              value={inputValue?.status}
              defaultValue={
                inputValue?.status?.charAt(0)?.toUpperCase() +
                inputValue?.status?.substr(1)?.toLowerCase()
              }
              select
            >
              {status.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField> */}
        </DialogContent>
        <Button className='button' size='lg' variant='success' onClick={handleUpdate}>
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
            InputLabelProps={{shrink: true}}
            label='Profile Image'
            type={'file'}
            onChange={(e) => handleChange(e)}
            name='profileImage'
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
            {errors['profileImage']}
          </span>
          <TextField
            label='Customer Name'
            type={'text'}
            onChange={(e) => handleChange(e)}
            name='customerName'
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
            {errors['customerName']}
          </span>
          <TextField
            label='Phone'
            type={'tel'}
            onChange={(e) => handleChange(e)}
            name='phone'
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
            {errors['phone']}
          </span>
          <TextField
            label='Postal Code'
            inputProps={{inputMode: 'numeric', pattern: '[0-9]*'}}
            onChange={(e) => handleChange(e)}
            name='pincode'
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
            {errors['pincode']}
          </span>
          <TextField
            label='City'
            type={'text'}
            onChange={(e) => handleChange(e)}
            name='city'
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
            {errors['city']}
          </span>
          <TextField
            label='State'
            type={'text'}
            onChange={(e) => handleChange(e)}
            name='state'
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
            {errors['state']}
          </span>
          <TextField
            label='Address'
            type={'text'}
            onChange={(e) => handleChange(e)}
            name='address'
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
            {errors['address']}
          </span>
          {/* <TextField
              label='Cod Status'
              onChange={(e) => handleChange(e)}
              name='codStatus'
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
            <TextField
              label='Status'
              onChange={(e) => handleChange(e)}
              name='status'
              fullWidth
              variant='standard'
              margin='dense'
              select
              required
            >
              {status.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField> */}
        </DialogContent>
        <Button className='button' size='lg' variant='success' onClick={handleAdd}>
          Save
        </Button>
      </Dialog>
    </>
  )
}

export {Customers}
