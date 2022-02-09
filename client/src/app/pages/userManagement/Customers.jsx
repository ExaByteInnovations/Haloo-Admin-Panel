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

const Customers = () => {
  const intl = useIntl()
  const [customers, setCustomers] = useState([])
  const [open, setOpen] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [rowId, setRowId] = useState('')
  const [inputValue, setInputValue] = useState({})
  const [currentRow, setCurrentRow] = useState({})
  const [loading, setLoading] = useState(false)
  const [show, setShow] = useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    setShow(false)
    setAddOpen(false)
  }

  useEffect(() => {
    getCustomers()
  }, [])

  const getCustomers = async () => {
    try {
      setLoading(true)
      const response = await ApiGet(`usermanagement/customer`)
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

  const handleUpdate = async (rowId) => {
    try {
      setLoading(true)
      const response = await ApiPut(`usermanagement/customer?_id=${rowId}`, {
        ...currentRow,
        ...inputValue,
      })

      if (response.status === 200) {
        toast.success('Updated Successfully')
        setInputValue({})
        getCustomers()
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
      const response = await ApiPost(`usermanagement/customer`, inputValue)
      if (response.status === 200) {
        toast.success('Added Successfully')
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

  const handleChange = (e) => {
    const {name, value} = e.target
    setInputValue({...inputValue, [name]: value})
  }

  const columns = [
    {
      name: 'Profile Image',
      cell: (row) => {
        return <Image className='image' src={row.prfileImage} />
      },
    },
    {
      name: 'Customer Name',
      selector: (row) => row.customerName,
      sortable: true,
      width: '200px',
    },
    {
      name: 'Email Address',
      selector: (row) => row.email,
      sortable: true,
      width: '150px',
    },
    {
      name: 'Phone',
      selector: (row) => row.phone,
      sortable: true,
      width: '150px',
    },
    {
      name: 'Age Bracket',
      selector: (row) => row.ageBracket,
      sortable: true,
      width: '150px',
    },
    {
      name: 'No. of Jobs',
      selector: (row) => row.noOFJobs,
      sortable: true,
      width: '150px',
    },
    {
      name: 'Average Rating',
      selector: (row) => row.avgRating,
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
      width: '150px',
    },
    {
      name: 'Last Access',
      selector: (row) => row.lastAccessOn,
      sortable: true,
      width: '150px',
    },
    {
      name: 'COD Status',
      selector: (row) => row.codStatus,
      sortable: true,
      width: '150px',
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
                setRowId(row.id)
                setCurrentRow(row)
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
      profileImage: '',
      customerName: customer?.customerName,
      email: customer?.email,
      phone: customer?.phone,
      ageBracket: customer?.ageBracket,
      noOfJobs: customer?.noOFJobs,
      avgRating: customer?.avgRating,
      memberSince: moment(customer?.createdAt).format('DD MMM YY hh:mmA'),
      lastAccessOn: moment(customer?.createdAt).format('DD MMM YY hh:mmA'),
      codStatus: customer?.codStatus,
      status: customer?.status,
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
        {intl.formatMessage({id: 'MENU.USER_MANAGEMENT.CUSTOMERS'})}
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
        fixedHeaderScrollHeight='55vh'
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
          {/* <TextField
          InputLabelProps={{shrink: true}}
            label='Profile Image'
            type={'file'}
            onChange={(e) => handleChange(e)}
            name='profileImage'
            fullWidth
            variant='standard'
            margin='dense'
            value={currentRow?.profileImage}
          /> */}
          <TextField
            label='Customer Name'
            type={'text'}
            onChange={(e) => handleChange(e)}
            name='customerName'
            fullWidth
            variant='standard'
            margin='dense'
            value={currentRow?.customerName}
          />
          <TextField
            label='Email Address'
            type={'email'}
            onChange={(e) => handleChange(e)}
            name='email'
            fullWidth
            variant='standard'
            margin='dense'
            value={currentRow?.email}
          />
          <TextField
            label='phone'
            type={'tel'}
            onChange={(e) => handleChange(e)}
            name='phone'
            fullWidth
            variant='standard'
            margin='dense'
            value={currentRow?.phone}
          />
          <TextField
            label='Age Bracket'
            type={'text'}
            onChange={(e) => handleChange(e)}
            name='ageBracket'
            fullWidth
            variant='standard'
            margin='dense'
            value={currentRow?.ageBracket}
          />
          <TextField
            label='Number of Jobs'
            inputProps={{inputMode: 'numeric', pattern: '[0-9]*'}}
            onChange={(e) => handleChange(e)}
            name='noOfJobs'
            fullWidth
            variant='standard'
            margin='dense'
            value={currentRow?.noOfJobs}
          />
          <TextField
            label='Average Rating'
            onChange={(e) => handleChange(e)}
            name='avgRating'
            select
            fullWidth
            variant='standard'
            margin='dense'
            value={inputValue?.avgRating}
            defaultValue={currentRow?.avgRating}
          >
            {[1, 2, 3, 4, 5].map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label='Cod Status'
            onChange={(e) => handleChange(e)}
            name='codStatus'
            fullWidth
            variant='standard'
            margin='dense'
            value={inputValue?.codStatus}
            defaultValue={
              currentRow?.codStatus?.charAt(0)?.toUpperCase() +
              currentRow?.codStatus?.substr(1)?.toLowerCase()
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
              currentRow?.status?.charAt(0)?.toUpperCase() +
              currentRow?.status?.substr(1)?.toLowerCase()
            }
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
            handleUpdate(rowId)
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
            {/* <TextField
          InputLabelProps={{shrink: true}}
            label='Profile Image'
            type={'file'}
            onChange={(e) => handleChange(e)}
            name='profileImage'
            fullWidth
            variant='standard'
            margin='dense'
            required
          /> */}
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
            <TextField
              label='Email Address'
              type={'email'}
              onChange={(e) => handleChange(e)}
              name='email'
              fullWidth
              variant='standard'
              margin='dense'
              required
            />
            <TextField
              label='phone'
              type={'tel'}
              onChange={(e) => handleChange(e)}
              name='phone'
              fullWidth
              variant='standard'
              margin='dense'
              required
            />
            <TextField
              label='Age Bracket'
              type={'text'}
              onChange={(e) => handleChange(e)}
              name='ageBracket'
              fullWidth
              variant='standard'
              margin='dense'
              required
            />
            <TextField
              label='Number of Jobs'
              inputProps={{inputMode: 'numeric', pattern: '[0-9]*'}}
              onChange={(e) => handleChange(e)}
              name='noOfJobs'
              fullWidth
              variant='standard'
              margin='dense'
              required
            />
            <TextField
              label='Average Rating'
              onChange={(e) => handleChange(e)}
              name='avgRating'
              select
              fullWidth
              variant='standard'
              margin='dense'
              required
            >
              {[1, 2, 3, 4, 5].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <TextField
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

export {Customers}
