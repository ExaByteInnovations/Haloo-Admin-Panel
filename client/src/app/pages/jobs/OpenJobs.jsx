/* eslint-disable jsx-a11y/anchor-is-valid */
import {FC, useEffect, useState} from 'react'
import {useIntl} from 'react-intl'
import moment from 'moment'
import {Edit, Delete} from '@mui/icons-material'
import {PageTitle} from '../../../_metronic/layout/core'
import DataTable from 'react-data-table-component'
import {ApiGet, ApiDelete, ApiPut} from '../../../helpers/API/ApiData'
import {toast} from 'react-toastify'
import Dialog from '@material-ui/core/Dialog'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import {Button} from 'react-bootstrap'
import {Modal} from 'react-bootstrap'
import {Box, CircularProgress, DialogContent, MenuItem, TextField} from '@material-ui/core'
import '../../App.css'

const OpenJobs = () => {
  const intl = useIntl()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [show, setShow] = useState(false)
  const [rowId, setRowId] = useState('')
  const [inputValue, setInputValue] = useState({})
  const [currentRow, setCurrentRow] = useState({})
  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    setShow(false)
  }

  useEffect(() => {
    getJobs()
  }, [])

  const getJobs = async () => {
    setLoading(true)
    try {
      const response = await ApiGet(`job?jobCategory=open&status=pending`)
      if (response.status === 200) {
        setJobs(response.data.data)
      }
      setLoading(false)
    } catch (err) {
      console.log(err)
      toast.error(err.message)
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      setLoading(true)
      const response = await ApiDelete(`job?_id=${rowId}`)
      if (response.status === 200) {
        getJobs()
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
      const response = await ApiPut(`job?_id=${rowId}`, {...currentRow, ...inputValue})
      if (response.status === 200) {
        toast.success('Updated Successfully')
        setInputValue({})
        getJobs()
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

  const columns = [
    {
      name: 'Job',
      selector: (row) => row.job,
      sortable: true,
      width: '200px',
    },
    {
      name: 'Quote',
      selector: (row) => row.quote,
      sortable: true,
    },
    {
      name: 'City',
      selector: (row) => row.city,
      sortable: true,
    },
    {
      name: 'Job Total',
      selector: (row) => row.jobTotal,
      sortable: true,
      width: '150px',
    },
    {
      name: 'Customer',
      selector: (row) => row.customer,
      sortable: true,
      width: '150px',
    },
    {
      name: 'Property Name',
      selector: (row) => row.propertyName,
      sortable: true,
      width: '150px',
    },
    {
      name: 'Category/Subcategory',
      selector: (row) => row.categorySubcategory,
      sortable: true,
      width: '200px',
    },
    {
      name: 'Vendor',
      selector: (row) => row.vendor,
      sortable: true,
      width: '150px',
    },
    {
      name: 'Posted Date',
      selector: (row) => row.postedDate,
      sortable: true,
      width: '200px',
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

  const data = jobs?.map((job) => {
    return {
      id: job?._id,
      job: job?.jobTitle,
      quote: job?.quote,
      city: job?.city,
      jobTotal: job?.jobTotal,
      customer: job?.customerDetails[0]?.customerName,
      propertyName: job?.propertyName,
      categorySubcategory: job?.category || job?.subCategory,
      vendor: job?.vendorDetails[0]?.companyName,
      postedDate: moment(job?.createdAt).format('DD MMM YY hh:mmA'),
      status: job?.status,
    }
  })

  const status = [
    {label: 'Pending', value: 'pending'},
    {label: 'Completed', value: 'completed'},
    {label: 'Disputed', value: 'disputed'},
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
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.JOBS.OPEN_JOBS'})}</PageTitle>
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

      <Dialog open={open} onClose={handleClose}>
        <Toolbar>
          <IconButton edge='start' color='inherit' onClick={handleClose} aria-label='close'>
            <CloseIcon />
          </IconButton>
        </Toolbar>
        <DialogContent>
          <TextField
            label='Job'
            type={'text'}
            onChange={(e) => handleChange(e)}
            name='job'
            fullWidth
            variant='standard'
            margin='dense'
            value={currentRow.job}
          />
          <TextField
            label='Quote'
            type={'text'}
            onChange={(e) => handleChange(e)}
            name='quote'
            fullWidth
            variant='standard'
            margin='dense'
            value={currentRow.quote}
          />
          <TextField
            label='City'
            type={'text'}
            onChange={(e) => handleChange(e)}
            name='city'
            fullWidth
            variant='standard'
            margin='dense'
            value={currentRow.city}
          />
          <TextField
            label='Job Total'
            type={'number'}
            onChange={(e) => handleChange(e)}
            name='jobTotal'
            fullWidth
            variant='standard'
            margin='dense'
            value={currentRow.jobTotal}
          />
          <TextField
            label='Customer'
            type={'text'}
            onChange={(e) => handleChange(e)}
            name='customer'
            fullWidth
            variant='standard'
            margin='dense'
            value={currentRow.customer}
          />
          <TextField
            label='Property Name'
            type={'text'}
            onChange={(e) => handleChange(e)}
            name='propertyName'
            fullWidth
            variant='standard'
            margin='dense'
            value={currentRow.propertyName}
          />
          <TextField
            label='Category / Subcategory'
            type={'text'}
            onChange={(e) => handleChange(e)}
            name='categorySubcategory'
            fullWidth
            variant='standard'
            margin='dense'
            value={currentRow.categorySubcategory}
          />
          <TextField
            label='Vendor'
            type={'text'}
            onChange={(e) => handleChange(e)}
            name='vendor'
            fullWidth
            variant='standard'
            margin='dense'
            value={currentRow.vendor}
          />
          <TextField
            InputLabelProps={{shrink: true}}
            label='Posted Date'
            type={'datetime-local'}
            onChange={(e) => handleChange(e)}
            name='postedDate'
            variant='standard'
            margin='dense'
            value={moment(currentRow.postedDate).format('MM-DD-YYYY hh:mm:A')}
          />
          <TextField
            label='Status'
            type={'text'}
            onChange={(e) => handleChange(e)}
            name='status'
            fullWidth
            variant='standard'
            margin='dense'
            select
            defaultValue={currentRow?.status}
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
    </>
  )
}
export {OpenJobs}
