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
  MenuItem,
  TextField,
  DialogTitle,
} from '@material-ui/core'
import '../../App.css'
import {Image} from 'react-bootstrap-v5'

const Category = () => {
  const intl = useIntl()
  const serverUrl = 'http://localhost:3000/'
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [show, setShow] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [rowId, setRowId] = useState('')
  const [inputValue, setInputValue] = useState({})
  // const [currentRow, setCurrentRow] = useState({})

  console.log(categories, 'categories')

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

  const handleUpdate = async () => {
    const imageData = new FormData()
    imageData.append('image', inputValue.image)
    imageData.append('hoverImage', inputValue.hoverImage)
    imageData.append('categoryName', inputValue.categoryName)
    imageData.append('sequenceNumber', inputValue.sequenceNumber)
    imageData.append('status', inputValue.status)
    try {
      setLoading(true)
      const response = await ApiPut(`serviceinfo/category?_id=${rowId}`, imageData)
      if (response.status === 200) {
        toast.success('Updated Successfully')
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

  const handleAdd = async () => {
    const imageData = new FormData()
    imageData.append('image', inputValue.image)
    imageData.append('hoverImage', inputValue.hoverImage)
    imageData.append('categoryName', inputValue.categoryName)
    imageData.append('sequenceNumber', inputValue.sequenceNumber)
    imageData.append('status', inputValue.status)

    try {
      setLoading(true)
      const response = await ApiPost(`serviceinfo/category`, imageData)
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
    const {name, value, files} = e.target
    if (files) setInputValue({...inputValue, [name]: files[0]})
    else setInputValue({...inputValue, [name]: value})
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
        return <Image className='image' src={serverUrl + row.image} />
      },
    },
    {
      name: 'Hover Image',
      cell: (row) => {
        return <Image className='image' src={serverUrl + row.hoverImage} />
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
                // setCurrentRow(row)
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

  const data = categories?.map((category) => {
    return {
      id: category?._id,
      categoryName: category?.categoryName,
      image: category?.image,
      hoverImage: category?.hoverImage,
      sequenceNumber: category?.sequenceNumber,
      status:
        category?.status?.charAt(0)?.toUpperCase() + category?.status?.substr(1)?.toLowerCase(),
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

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth='xs'>
        <form onSubmit={handleUpdate}>
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
              label='Category Name'
              type={'text'}
              onChange={(e) => handleChange(e)}
              name='categoryName'
              fullWidth
              variant='standard'
              margin='dense'
              value={inputValue?.categoryName}
            />
            <TextField
              label='Sequence Number'
              inputProps={{inputMode: 'numeric', pattern: '[0-9]*'}}
              onChange={(e) => handleChange(e)}
              name='sequenceNumber'
              fullWidth
              variant='standard'
              margin='dense'
              value={inputValue?.sequenceNumber}
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
              InputLabelProps={{shrink: true}}
              label='Hover Image'
              type={'file'}
              onChange={(e) => handleChange(e)}
              name='hoverImage'
              fullWidth
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
            </TextField>
          </DialogContent>
          <Button
            className='button'
            type='submit'
            size='lg'
            variant='success'
            // onClick={() => {
            //   handleUpdate(rowId)
            //   handleClose()
            // }}
          >
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
              label='Category Name'
              type={'text'}
              onChange={(e) => handleChange(e)}
              name='categoryName'
              fullWidth
              required
              variant='standard'
              margin='dense'
            />
            <TextField
              label='Sequence Number'
              inputProps={{inputMode: 'numeric', pattern: '[0-9]*'}}
              onChange={(e) => handleChange(e)}
              name='sequenceNumber'
              fullWidth
              required
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
              required
              variant='standard'
              margin='dense'
              required
            />
            <TextField
              InputLabelProps={{shrink: true}}
              label='Hover Image'
              type={'file'}
              onChange={(e) => handleChange(e)}
              name='hoverImage'
              fullWidth
              required
              variant='standard'
              margin='dense'
              required={addOpen}
            />
            <TextField
              label='Status'
              type={'text'}
              onChange={(e) => handleChange(e)}
              name='status'
              fullWidth
              required
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
          <Button className='button' type='submit' size='lg' variant='success'>
            Save
          </Button>
        </form>
      </Dialog>
    </>
  )
}
export {Category}
