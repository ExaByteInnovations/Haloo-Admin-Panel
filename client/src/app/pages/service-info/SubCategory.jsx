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

const SubCategory = () => {
  const intl = useIntl()
  const [subCategories, setSubCategories] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [show, setShow] = useState(false)
  const [rowId, setRowId] = useState('')
  const [inputValue, setInputValue] = useState({})
  const [errors, setErrors] = useState({})

  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    setShow(false)
    setAddOpen(false)
    setErrors({})
  }

  useEffect(() => {
    getSubCategories()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const getSubCategories = async () => {
    setLoading(true)
    try {
      const response = await ApiGet(`serviceinfo/subcategory`)
      if (response.status === 200) {
        setSubCategories(response?.data?.data)
      }
      setLoading(false)
    } catch (err) {
      console.log(err)
      toast.error(err.message)
      setLoading(false)
    }
  }

  const getCategories = async () => {
    setLoading(true)
    try {
      const response = await ApiGet(`serviceinfo/category`)
      if (response.status === 200) {
        setCategories(
          response?.data?.data?.map((category) => {
            return {name: category?.categoryName, id: category?._id}
          })
        )
      }
      setLoading(false)
    } catch (err) {
      console.log(err)
      setLoading(false)
    }
  }

  const validateForm = () => {
    let formIsValid = true
    let errors = {}

    if (inputValue && !inputValue.category) {
      formIsValid = false
      errors['category'] = '*Please Enter Category!'
    }
    if (inputValue && !inputValue.parentCategoryId) {
      formIsValid = false
      errors['parentCategoryId'] = '*Please parent Category!'
    }
    if (inputValue && !inputValue.image) {
      formIsValid = false
      errors['image'] = '*Please Select Image!'
    }
    if (inputValue && !inputValue.sequenceNumber) {
      formIsValid = false
      errors['sequenceNumber'] = '*Please Enter Sequence Number!'
    }
    if (inputValue && !inputValue.status) {
      formIsValid = false
      errors['status'] = '*Please Select Status!'
    }
    setErrors(errors)
    return formIsValid
  }

  const handleDelete = async () => {
    try {
      setLoading(true)
      const response = await ApiDelete(`serviceinfo/subcategory?_id=${rowId}`)
      if (response.status === 200) {
        getSubCategories()
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
    if (validateForm()) {
      const imageData = new FormData()
      imageData.append('image', inputValue.image)
      imageData.append('category', inputValue.category)
      imageData.append('sequenceNumber', inputValue.sequenceNumber)
      imageData.append('parentCategoryId', inputValue.parentCategoryId)
      imageData.append('status', inputValue.status)
      try {
        setLoading(true)
        const response = await ApiPut(`serviceinfo/subcategory?_id=${rowId}`, imageData)
        if (response.status === 200) {
          toast.success('Updated Successfully')
          setInputValue({})
          getSubCategories()
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
      imageData.append('image', inputValue.image)
      imageData.append('category', inputValue.category)
      imageData.append('sequenceNumber', inputValue.sequenceNumber)
      imageData.append('parentCategoryId', inputValue.parentCategoryId)
      imageData.append('status', inputValue.status)

      try {
        setLoading(true)
        const response = await ApiPost(`serviceinfo/subcategory`, imageData)
        if (response.status === 200) {
          toast.success('Added Successfully')
          setInputValue({})
          getSubCategories()
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
      name: 'Category',
      selector: (row) => row.category,
      sortable: true,
      width: '200px',
    },
    {
      name: 'Parent Category',
      selector: (row) => row.parentCategory,
      sortable: true,
      width: '200px',
    },
    {
      name: 'Image',
      cell: (row) => {
        return <Image className='image' src={process.env.REACT_APP_SERVER_URL + row.image} />
      },
    },
    {
      name: 'Sequence Number',
      selector: (row) => row.sequenceNumber,
      sortable: true,
    },
    {
      name: 'Added On',
      selector: (row) => row.addedOn,
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
                getCategories()
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

  const data = subCategories?.map((subCategory) => {
    return {
      id: subCategory?._id,
      category: subCategory?.category,
      image: subCategory?.image,
      parentCategory: subCategory?.parentCategoryDetails[0]?.categoryName,
      parentCategoryId: subCategory?.parentCategoryId,
      sequenceNumber: subCategory?.sequenceNumber,
      addedOn: moment(subCategory?.createdAt).format('DD MMM YY hh:mmA'),
      status:
        subCategory?.status?.charAt(0)?.toUpperCase() +
        subCategory?.status?.substr(1)?.toLowerCase(),
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
        {intl.formatMessage({id: 'MENU.SERVICE_INFO.SUB_CATEGORY'})}
      </PageTitle>
      <Box
        className='add-button-wrapper'
        onClick={() => {
          setAddOpen(true)
          getCategories()
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
        fixedHeaderScrollHeight='58vh'
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

        <DialogContent>
          <TextField
            label='Category'
            type={'text'}
            onChange={(e) => handleChange(e)}
            name='category'
            fullWidth
            variant='standard'
            value={inputValue?.category}
            margin='dense'
          />
          <span
            style={{
              color: 'red',
              top: '5px',
              fontSize: '12px',
            }}
          >
            {errors['category']}
          </span>
          <TextField
            label='Parent Category'
            onChange={(e) => handleChange(e)}
            name='parentCategoryId'
            fullWidth
            variant='standard'
            margin='dense'
            select
            value={inputValue?.parentCategoryId}
            defaultValue={inputValue?.parentCategoryId}
            SelectProps={{
              MenuProps: {
                style: {height: '300px'},
              },
            }}
          >
            {categories.map((option) => (
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
            {errors['parentCategoryId']}
          </span>
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
          <span
            style={{
              color: 'red',
              top: '5px',
              fontSize: '12px',
            }}
          >
            {errors['image']}
          </span>
          <TextField
            label='Sequence Number'
            inputProps={{inputMode: 'numeric', pattern: '[0-9]*'}}
            onChange={(e) => handleChange(e)}
            name='sequenceNumber'
            fullWidth
            variant='standard'
            value={inputValue?.sequenceNumber}
            margin='dense'
            type={'number'}
          />
          <span
            style={{
              color: 'red',
              top: '5px',
              fontSize: '12px',
            }}
          >
            {errors['sequenceNumber']}
          </span>
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
            label='Category'
            type={'text'}
            onChange={(e) => handleChange(e)}
            name='category'
            fullWidth
            variant='standard'
            margin='dense'
          />
          <span
            style={{
              color: 'red',
              top: '5px',
              fontSize: '12px',
            }}
          >
            {errors['category']}
          </span>
          <TextField
            label='Parent Category'
            onChange={(e) => handleChange(e)}
            name='parentCategoryId'
            fullWidth
            variant='standard'
            margin='dense'
            select
            SelectProps={{
              MenuProps: {
                style: {height: '300px'},
              },
            }}
          >
            {categories.map((option) => (
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
            {errors['parentCategoryId']}
          </span>
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
          <span
            style={{
              color: 'red',
              top: '5px',
              fontSize: '12px',
            }}
          >
            {errors['image']}
          </span>
          <TextField
            label='Sequence Number'
            inputProps={{inputMode: 'numeric', pattern: '[0-9]*'}}
            onChange={(e) => handleChange(e)}
            name='sequenceNumber'
            fullWidth
            variant='standard'
            margin='dense'
          />
          <span
            style={{
              color: 'red',
              top: '5px',
              fontSize: '12px',
            }}
          >
            {errors['sequenceNumber']}
          </span>
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
        <Button className='button' size='lg' variant='success' onClick={handleAdd}>
          Save
        </Button>
      </Dialog>
    </>
  )
}
export {SubCategory}
