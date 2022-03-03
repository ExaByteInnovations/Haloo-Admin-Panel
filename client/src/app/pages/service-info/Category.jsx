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
import {Button} from 'react-bootstrap'
import {Modal} from 'react-bootstrap'
import ClearIcon from '@mui/icons-material/Clear'
import {
  Box,
  CircularProgress,
  DialogContent,
  MenuItem,
  TextField,
  DialogTitle,
} from '@material-ui/core'
import '../../App.css'
// import {Image} from 'react-bootstrap-v5'

const Category = () => {
  const intl = useIntl()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [show, setShow] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
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
    getCategories()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const getCategories = async () => {
    setLoading(true)
    try {
      const response = await ApiGet(`serviceinfo/category`)
      if (response.status === 200) {
        setCategories(response.data.data)
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
    if (validateForm()) {
      // const imageData = new FormData()
      // imageData.append('image', inputValue.image)
      // imageData.append('hoverImage', inputValue.hoverImage)
      // imageData.append('categoryName', inputValue.categoryName)
      // imageData.append('sequenceNumber', inputValue.sequenceNumber)
      // imageData.append('status', inputValue.status)
      try {
        setLoading(true)
        const response = await ApiPut(`serviceinfo/category?_id=${rowId}`, inputValue)
        if (response.status === 200) {
          toast.success('Updated Successfully')
          setInputValue({})
          setErrors({})
          getCategories()
          handleClose()
        }
        setLoading(false)
      } catch (err) {
        toast.error(err.error || err.message)
        setLoading(false)
        setErrors({[err.field]: err.error})
      }
    }
  }

  const handleChange = (e) => {
    const {
      name,
      value,
      // files
    } = e.target
    // if (files) {
    //   setInputValue({...inputValue, [name]: files[0]})
    //   setErrors({...errors, [name]: ''})
    // } else {
    setInputValue({...inputValue, [name]: value})
    setErrors({...errors, [name]: ''})
    // }
  }

  const validateForm = () => {
    let formIsValid = true
    let errors = {}

    if (inputValue && !inputValue.categoryName) {
      formIsValid = false
      errors['categoryName'] = '*Please Enter Category Name!'
    }
    // if (inputValue && !inputValue.sequenceNumber) {
    //   formIsValid = false
    //   errors['sequenceNumber'] = '*Please Enter Sequence Number!'
    // }
    // if (inputValue && !inputValue.image && addOpen) {
    //   formIsValid = false
    //   errors['image'] = '*Please Select Image!'
    // }
    // if (inputValue && !inputValue.hoverImage) {
    //   formIsValid = false
    //   errors['hoverImage'] = '*Please Select Hover Image!'
    // }
    if (inputValue && !inputValue.status) {
      formIsValid = false
      errors['status'] = '*Please Select Status!'
    }
    setErrors(errors)
    return formIsValid
  }

  const handleAdd = async () => {
    if (validateForm()) {
      // const imageData = new FormData()
      // imageData.append('image', inputValue.image)
      // imageData.append('hoverImage', inputValue.hoverImage)
      // imageData.append('categoryName', inputValue.categoryName)
      // imageData.append('sequenceNumber', inputValue.sequenceNumber)
      // imageData.append('status', inputValue.status)

      try {
        setLoading(true)
        const response = await ApiPost(`serviceinfo/category`, inputValue)
        if (response.status === 200) {
          toast.success('Added Successfully')
          setInputValue({})
          getCategories()
          handleClose()
        }
        setLoading(false)
      } catch (err) {
        toast.error(err[0] || err.message)
        setLoading(false)
        setErrors({[err[1]]: err[0]})
      }
    }
  }

  const columns = [
    {
      name: 'Sequence Number',
      selector: (row) => row.sequenceNumber,
      sortable: true,
    },
    {
      name: 'Category Name',
      selector: (row) => row.categoryName,
      sortable: true,
      width: '200px',
    },
    // {
    //   name: 'Image',
    //   cell: (row) => {
    //     return <Image className='image' src={process.env.REACT_APP_SERVER_URL + row.image} />
    //   },
    // },
    // {
    //   name: 'Hover Image',
    //   cell: (row) => {
    //     return <Image className='image' src={process.env.REACT_APP_SERVER_URL + row.hoverImage} />
    //   },
    // },
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
      // image: category?.image,
      // hoverImage: category?.hoverImage,
      sequenceNumber: category?.sequenceNumber,
      status:
        category?.status?.charAt(0)?.toUpperCase() + category?.status?.substr(1)?.toLowerCase(),
    }
  })

  const filteredItems = data.filter(
    (item) =>
      (item.categoryName && item.categoryName.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.sequenceNumber &&
        item.sequenceNumber.toString().toLowerCase().includes(filterText.toLowerCase())) ||
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
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({id: 'MENU.SERVICE_INFO.CATEGORY'})}
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
        fixedHeaderScrollHeight='55vh'
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
            label='Category Name'
            type={'text'}
            onChange={(e) => handleChange(e)}
            name='categoryName'
            fullWidth
            variant='standard'
            margin='dense'
            value={inputValue?.categoryName}
            required
          />
          <span
            style={{
              color: 'red',
              top: '5px',
              fontSize: '12px',
            }}
          >
            {errors['categoryName']}
          </span>

          {/* <TextField
            label='Sequence Number'
            inputProps={{inputMode: 'numeric', pattern: '[0-9]*'}}
            onChange={(e) => handleChange(e)}
            name='sequenceNumber'
            fullWidth
            variant='standard'
            margin='dense'
            value={inputValue?.sequenceNumber}
            required
          />
          <span
            style={{
              color: 'red',
              top: '5px',
              fontSize: '12px',
            }}
          >
            {errors['sequenceNumber']}
          </span> */}
          {/* <TextField
            InputLabelProps={{shrink: true}}
            label='Image'
            type={'file'}
            onChange={(e) => handleChange(e)}
            name='image'
            fullWidth
            variant='standard'
            margin='dense'
          /> */}
          {/* <span
            style={{
              color: 'red',
              top: '5px',
              fontSize: '12px',
            }}
          >
            {errors['image']}
          </span> */}
          {/* <TextField
            InputLabelProps={{shrink: true}}
            label='Hover Image'
            type={'file'}
            onChange={(e) => handleChange(e)}
            name='hoverImage'
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
            {errors['hoverImage']}
          </span> */}
          <TextField
            label='Status'
            type={'text'}
            onChange={(e) => handleChange(e)}
            name='status'
            fullWidth
            variant='standard'
            margin='dense'
            value={inputValue?.status}
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
            label='Category Name'
            type={'text'}
            onChange={(e) => handleChange(e)}
            name='categoryName'
            fullWidth
            variant='standard'
            margin='dense'
            required
            value={inputValue?.categoryName || ''}
          />
          <span
            style={{
              color: 'red',
              top: '5px',
              fontSize: '12px',
            }}
          >
            {errors['categoryName']}
          </span>
          {/* <TextField
            label='Sequence Number'
            inputProps={{inputMode: 'numeric', pattern: '[0-9]*'}}
            onChange={(e) => handleChange(e)}
            name='sequenceNumber'
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
            {errors['sequenceNumber']}
          </span> */}
          {/* <TextField
            InputLabelProps={{shrink: true}}
            label='Image'
            type={'file'}
            onChange={(e) => handleChange(e)}
            name='image'
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
            {errors['image']}
          </span> */}
          {/* <TextField
            InputLabelProps={{shrink: true}}
            label='Hover Image'
            type={'file'}
            onChange={(e) => handleChange(e)}
            name='hoverImage'
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
            {errors['hoverImage']}
          </span> */}
          <TextField
            label='Status'
            type={'text'}
            onChange={(e) => handleChange(e)}
            name='status'
            fullWidth
            variant='standard'
            margin='dense'
            select
            required
            defaultValue={' '}
            value={inputValue?.status || ' '}
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
        <Button className='button' onClick={handleAdd} size='lg' variant='success'>
          Save
        </Button>
      </Dialog>
    </>
  )
}
export {Category}
