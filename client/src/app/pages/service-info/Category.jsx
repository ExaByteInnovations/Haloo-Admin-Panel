/* eslint-disable jsx-a11y/anchor-is-valid */
import {FC, useEffect, useRef, useState} from 'react'
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
  MenuItem,
  TextField,
  DialogTitle,
  FormControl,
} from '@material-ui/core'
import '../../App.css'
import {Image} from 'react-bootstrap-v5'

const Category = () => {
  const intl = useIntl()
  const formRef = useRef()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [show, setShow] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [rowId, setRowId] = useState('')
  const [inputValue, setInputValue] = useState({})
  const [currentRow, setCurrentRow] = useState({})

  console.log(categories, 'category')

  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    setShow(false)
    setAddOpen(false)
  }

  useEffect(() => {
    getCategories()
  }, [])

  const getCategories = async () => {
    setLoading(true)
    try {
      const response = await ApiGet(`serviceinfo/category`)
      if (response.status === 200) {
        setCategories(response.data.data)
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
      const response = await ApiDelete(`serviceinfo/category?_id=${rowId}`)
      if (response.status === 200) {
        getCategories()
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
      const response = await ApiPut(`serviceinfo/category?_id=${rowId}`, {
        ...currentRow,
        ...inputValue,
      })
      if (response.status === 200) {
        toast.success('Updated Successfully')
        setInputValue({})
        getCategories()
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
      const response = await ApiPost(`serviceinfo/category`, inputValue)
      if (response.status === 200) {
        toast.success('Added Successfully')
        setInputValue({})
        getCategories()
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
      name: 'Category Name',
      selector: (row) => row.categoryName,
      sortable: true,
      width: '200px',
    },
    {
      name: 'Sequence Number',
      selector: (row) => row.sequenceNumber,
      sortable: true,
    },
    {
      name: 'Image',
      cell: (row) => {
        return <Image className='image' src={row.imageSrc} />
      },
    },
    {
      name: 'Hover Image',
      cell: (row) => {
        return (
          <Box>
            <Image fluid src={row.hoverImageSrc} />
          </Box>
        )
      },
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

  const data = categories?.map((category) => {
    return {
      id: category._id,
      categoryName: category.categoryName,
      sequenceNumber: category.sequenceNumber,
      status: category.status,
    }
  })

  const status = [
    {label: 'Active', value: 'active'},
    {label: 'Inactive', value: 'inactive'},
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
        {intl.formatMessage({id: 'MENU.SERVICE_INFO.CATEGORY'})}
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
        <form onSubmit={handleAdd}>
          <DialogContent>
            <TextField
              label='Category Name'
              type={'text'}
              onChange={(e) => handleChange(e)}
              name='categoryName'
              fullWidth
              variant='standard'
              margin='dense'
              value={open ? currentRow?.categoryName : ''}
              required={addOpen}
            />
            <TextField
              label='Sequence Number'
              inputProps={{inputMode: 'numeric', pattern: '[0-9]*'}}
              onChange={(e) => handleChange(e)}
              name='sequenceNumber'
              fullWidth
              variant='standard'
              margin='dense'
              value={open ? currentRow?.sequenceNumber : ''}
              required={addOpen}
            />
            {/* <TextField
              InputLabelProps={{shrink: true}}
              label='Image'
              type={'file'}
              onChange={(e) => handleChange(e)}
              name='image'
              fullWidth
              variant='standard'
              margin='dense'
              // value={addOpen && currentRow}
              required={addOpen}
            /> */}
            {/* <TextField
              InputLabelProps={{shrink: true}}
              label='Hover Image'
              type={'file'}
              onChange={(e) => handleChange(e)}
              name='hoverImage'
              fullWidth
              variant='standard'
              margin='dense'
              // value={addOpen && currentRow}
              required={addOpen}
            /> */}
            {/* <TextField
              InputLabelProps={{shrink: true}}
              label='Added On'
              type={'datetime-local'}
              onChange={(e) => handleChange(e)}
              name='addedOn'
              variant='standard'
              margin='dense'
              // value={addOpen && currentRow}
              required={addOpen}
            /> */}
            <TextField
              label='Status'
              type={'text'}
              onChange={(e) => handleChange(e)}
              name='status'
              fullWidth
              variant='standard'
              margin='dense'
              defaultValue={open && currentRow.status}
              required={addOpen}
              select
            >
              {status.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </DialogContent>
          <Box>
            <Button
              className='button'
              type='submit'
              size='lg'
              variant='success'
              onClick={() => {
                open && handleUpdate(rowId)
                open && handleClose()
              }}
            >
              Save
            </Button>
          </Box>
        </form>
      </Dialog>
    </>
  )
}
export {Category}
