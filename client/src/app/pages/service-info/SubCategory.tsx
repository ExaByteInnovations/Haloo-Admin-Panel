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
import img from '../../../assets/teacher.jpg'
// import hoverImg from 'clientpublicmediaavatars/300-7.jpg'

const SubCategory: FC = () => {
  const intl = useIntl()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [show, setShow] = useState(false)
  const [rowId, setRowId] = useState('')
  const [inputValue, setInputValue] = useState({})
  const [currentRow, setCurrentRow] = useState({})

  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    setShow(false)
    setAddOpen(false)
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
    } catch (err: any) {
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
    } catch (err: any) {
      toast.error(err.message)
      setLoading(false)
      setShow(false)
    }
  }

  const handleUpdate = async (rowId: string) => {
    try {
      setLoading(true)
      const response = await ApiPut(`job?_id=${rowId}`, {...currentRow, ...inputValue})
      if (response.status === 200) {
        toast.success('Updated Successfully')
        setInputValue({})
        getJobs()
      }
      setLoading(false)
    } catch (err: any) {
      toast.error(err.message)
      setLoading(false)
    }
  }

  const handleAdd = async () => {
    console.log('added')
  }

  const handleChange = (e: any) => {
    const {name, value} = e.target
    setInputValue({...inputValue, [name]: value})
  }

  const columns = [
    {
      name: 'Category',
      selector: (row: any) => row.category,
      sortable: true,
      width: '200px',
    },
    {
      name: 'Parent Category',
      selector: (row: any) => row.parentCategory,
      sortable: true,
      width: '200px',
    },
    {
      name: 'Image',
      cell: (row: any) => {
        return <Image className='image' src={row.imageSrc} />
      },
    },
    {
      name: 'Sequence Number',
      selector: (row: any) => row.sequenceNumber,
      sortable: true,
    },
    {
      name: 'Added On',
      selector: (row: any) => row.addedOn,
      sortable: true,
    },
    {
      name: 'Status',
      selector: (row: any) => row.status,
      sortable: true,
    },
    {
      name: 'Action',
      cell: (row: any) => {
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

  //   const data = jobs?.map((job: any) => {
  //     return {
  //       id: job._id,
  //       job: job.jobTitle,
  //       quote: job.quote,
  //       city: job.city,
  //       jobTotal: job.jobTotal,
  //       customer: job.customer,
  //       propertyName: job.propertyName,
  //       categorySubcategory: job.category || job.subCategory,
  //       vendor: job.vendor,
  //       postedDate: moment(job.createdAt).format('DD MMM YY hh:mmA'),
  //       status: job.status,
  //     }
  //   })

  const data = [
    {
      id: 1,
      category: 'Teacher',
      parentCategory: 'school',
      imageSrc: img,
      sequenceNumber: 123,
      addedOn: '',
      status: 'Active',
    },
    {
      id: 2,
      category: 'Plumber',
      parentCategory: 'Housing Service',
      imageSrc: img,
      sequenceNumber: 1234,
      status: 'Active',
    },
  ]

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
        {intl.formatMessage({id: 'MENU.SERVICE_INFO.SUB_CATEGORY'})}
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

      <Dialog open={open || addOpen} onClose={handleClose}>
        <DialogTitle>
          <Box sx={{display: 'flex'}}>
            <Box flexGrow={1}>
              {open && 'Edit Row'}
              {addOpen && 'Add New Row'}
            </Box>
            <Box>
              <IconButton color='inherit' onClick={handleClose} aria-label='close'>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          <TextField
            label='Category'
            type={'text'}
            onChange={(e) => handleChange(e)}
            name='category'
            fullWidth
            variant='standard'
            margin='dense'
          />
          <TextField
            label='Parent Category'
            type={'text'}
            onChange={(e) => handleChange(e)}
            name='parentCategory'
            fullWidth
            variant='standard'
            margin='dense'
          />
          <TextField
            InputLabelProps={{shrink: true}}
            label='Image'
            type={'file'}
            onChange={(e) => handleChange(e)}
            name='image'
            fullWidth
            variant='standard'
            margin='dense'
          />
          <TextField
            label='Sequence Number'
            type={'number'}
            onChange={(e) => handleChange(e)}
            name='sequenceNumber'
            fullWidth
            variant='standard'
            margin='dense'
          />
          <TextField
            InputLabelProps={{shrink: true}}
            label='Added On'
            type={'datetime-local'}
            onChange={(e) => handleChange(e)}
            name='addedOn'
            variant='standard'
            margin='dense'
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
            open && handleUpdate(rowId)
            addOpen && handleAdd()
            handleClose()
          }}
        >
          Save
        </Button>
      </Dialog>
    </>
  )
}
export {SubCategory}
