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

const Customers = () => {
  const intl = useIntl()
  const [customers, setCustomers] = useState([])
  const [open, setOpen] = useState(false)
  const [rowId, setRowId] = useState('')
  const [inputValue, setInputValue] = useState({})
  const [currentRow, setCurrentRow] = useState({})
  const [loading, setLoading] = useState(false)
  const [show, setShow] = useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    setShow(false)
  }

  useEffect(() => {
    getCustomers()
  }, [])

  const getCustomers = async () => {
    try {
      setLoading(true)
      const response = await ApiGet(`review`)
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
      const response = await ApiDelete(`review?_id=${rowId}`)

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
      const response = await ApiPut(`review?_id=${rowId}`, {...currentRow, ...inputValue})

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

  const handleChange = (e) => {
    const {name, value} = e.target
    setInputValue({...inputValue, [name]: value})
  }

  const columns = [
    {
      name: 'Image',
      selector: (row) => row.ratingBy,
      sortable: true,
      width: '200px',
    },
    {
      name: 'Name',
      selector: (row) => row.ratingFor,
      sortable: true,
      width: '200px',
    },
    {
      name: 'E-Mail',
      selector: (row) => row.whoRated,
      sortable: true,
      width: '150px',
    },
    {
      name: 'Age Bracket',
      selector: (row) => row.jobNumber,
      sortable: true,
      width: '150px',
    },
    {
      name: 'No. of Jobs',
      selector: (row) => row.jobNumber,
      sortable: true,
      width: '150px',
    },
    {
      name: 'Average Rating',
      selector: (row) => row.rating,
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
      selector: (row) => row.comment,
      sortable: true,
      width: '150px',
    },
    {
      name: 'Last Access',
      selector: (row) => row.postedOn,
      sortable: true,
      width: '150px',
    },
    {
      name: 'COD Status',
      selector: (row) => row.postedOn,
      sortable: true,
      width: '150px',
    },
    {
      name: 'Status',
      selector: (row) => row.postedOn,
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
                setInputValue({...row})
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

  const data = customers?.map((rating) => {
    return {
      id: rating._id,
      ratingBy: rating.ratingBy,
      ratingFor: rating.ratingFor,
      whoRated: rating.whoRated,
      jobNumber: rating.jobNumber,
      rating: rating.rating,
      comment: rating.comment,
      postedOn: moment(rating.createdAt).format('DD MMM YY hh:mmA'),
    }
  })

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
            label='Rating For'
            type={'text'}
            onChange={(e) => handleChange(e)}
            name='ratingFor'
            fullWidth
            variant='standard'
            margin='dense'
          />
          <TextField
            label='Rating By'
            type={'text'}
            onChange={(e) => handleChange(e)}
            name='ratingBy'
            fullWidth
            variant='standard'
            margin='dense'
          />
          <TextField
            label='Who Rated'
            type={'text'}
            onChange={(e) => handleChange(e)}
            name='whoRated'
            fullWidth
            variant='standard'
            margin='dense'
          />
          <TextField
            label='Job Number'
            type={'number'}
            onChange={(e) => handleChange(e)}
            name='jobNumber'
            fullWidth
            variant='standard'
            margin='dense'
          />
          <TextField
            label='Rating'
            type={'number'}
            onChange={(e) => handleChange(e)}
            name='rating'
            select
            fullWidth
            variant='standard'
            margin='dense'
          >
            {[1, 2, 3, 4, 5].map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label='Comment'
            multiline
            maxRows={3}
            onChange={(e) => handleChange(e)}
            name='comment'
            fullWidth
            variant='standard'
            margin='dense'
          />
          <TextField
            InputLabelProps={{shrink: true}}
            label='Posted On'
            type={'datetime-local'}
            onChange={(e) => handleChange(e)}
            name='postedOn'
            variant='standard'
            margin='dense'
          />
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

export {Customers}
