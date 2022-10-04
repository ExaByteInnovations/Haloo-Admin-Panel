/* eslint-disable jsx-a11y/anchor-is-valid */
import {useEffect, useState, useMemo, useContext} from 'react'
import {useIntl} from 'react-intl'
import {PageTitle} from '../../../_metronic/layout/core'
import DataTable from 'react-data-table-component'
import {ApiGet, ApiDelete, ApiPut, ApiPost} from '../../../helpers/API/ApiData'
import {toast} from 'react-toastify'
import Dialog from '@material-ui/core/Dialog'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import ClearIcon from '@mui/icons-material/Clear'
import {Modal} from 'react-bootstrap'
import {KTSVG} from '../../../_metronic/helpers/components/KTSVG'
import {Box, DialogContent, DialogTitle, CircularProgress} from '@material-ui/core'
import '../../App.css'
import {toAbsoluteUrl} from '../../../_metronic/helpers'
import {MasterContext} from '../../context/masterContext'

const SubCategory = () => {
  const {imgExtensions} = useContext(MasterContext)
  const intl = useIntl()
  const [subCategories, setSubCategories] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [loader, setLoader] = useState(false)
  const [open, setOpen] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [show, setShow] = useState(false)
  const [rowId, setRowId] = useState('')
  const [inputValue, setInputValue] = useState({})
  const [errors, setErrors] = useState({})
  const [filterText, setFilterText] = useState('')
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [subCategoryImage, setSubCategoryImage] = useState(null)

  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    setShow(false)
    setAddOpen(false)
    setErrors({})
    setInputValue({})
    setSubCategoryImage(null)
  }
  const compare = (a, b) => {
    if (a.name < b.name) {
      return -1
    }
    if (a.name > b.name) {
      return 1
    }
    return 0
  }

  useEffect(() => {
    if (!subCategoryImage) {
      setPreviewImage(null)
      return
    }
    const objectUrl = URL.createObjectURL(subCategoryImage)
    setPreviewImage(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [subCategoryImage])

  useEffect(() => {
    getSubCategories()
  }, [])

  const getSubCategories = async () => {
    setLoader(true)
    try {
      const response = await ApiGet(`serviceinfo/subcategory`)
      if (response.status === 200) {
        setSubCategories(response?.data?.data)
      }
      setLoader(false)
    } catch (err) {
      console.log(err)
      toast.error(err.message)
      setLoader(false)
    }
  }

  const getCategories = async () => {
    // setLoading(true)
    try {
      const response = await ApiGet(`serviceinfo/category?status=active`)
      if (response.status === 200) {
        setCategories(
          response?.data?.data?.map((category) => {
            return {name: category?.categoryName, id: category?._id}
          })
        )
      }
      // setLoading(false)
    } catch (err) {
      console.log(err)
      // setLoading(false)
    }
  }

  const validateForm = () => {
    let formIsValid = true
    let errors = {}

    if (inputValue && !inputValue?.subCategoryImage && !subCategoryImage && addOpen) {
      formIsValid = false
      errors['subCategoryImage'] = '*Please Select subCategoryImage!'
    }

    if (inputValue && !inputValue.subCategory) {
      formIsValid = false
      errors['subCategory'] = '*Please Enter Sub Category!'
    }
    if (inputValue && !inputValue.parentCategoryId) {
      formIsValid = false
      errors['parentCategoryId'] = '*Please Enter Category!'
    }
    // if (inputValue && !inputValue.image) {
    //   formIsValid = false
    //   errors['image'] = '*Please Select Image!'
    // }
    if (inputValue && !inputValue.price) {
      formIsValid = false
      errors['price'] = '*Please Enter Price!'
    }
    if (inputValue && !inputValue.status) {
      formIsValid = false
      errors['status'] = '*Please Select Status!'
    }
    setErrors(errors)
    return formIsValid
  }

  const handleDelete = async () => {
    setLoading(true)
    try {
      const response = await ApiDelete(`serviceinfo/subcategory?_id=${rowId}`)
      if (response.status === 200) {
        getSubCategories()
        toast.success('Deleted Successfully')
      }
      setShow(false)
      setLoading(false)
    } catch (err) {
      toast.error(err.message)
      setShow(false)
      setLoading(false)
    }
  }

  const handleUpdate = async () => {
    if (validateForm()) {
      const imageData = new FormData()
      subCategoryImage && imageData.append('subCategoryImage', subCategoryImage)
      imageData.append('subCategoryName', inputValue.subCategory || '')
      imageData.append('category', getCategoryName(inputValue.parentCategoryId) || '')
      imageData.append('price', inputValue.price || '')
      imageData.append('parentCategoryId', inputValue.parentCategoryId || '')
      imageData.append('status', inputValue.status.toLowerCase() || '')
      try {
        const response = await ApiPut(`serviceinfo/subcategory?_id=${rowId}`, imageData)
        if (response.status === 200) {
          toast.success('Updated Successfully')
          setInputValue({})
          getSubCategories()
          handleClose()
        }
      } catch (err) {
        toast.error(err.message || err.error)
        setErrors({[err.field]: err.error})
      }
    }
  }
  const getCategoryName = (id) => {
    return categories.find((category) => category.id === id)?.name
  }

  const handleAdd = async () => {
    if (validateForm()) {
      const imageData = new FormData()
      imageData.append('subCategoryImage', subCategoryImage || '')
      imageData.append('subCategoryName', inputValue.subCategory || '')
      imageData.append('category', getCategoryName(inputValue.parentCategoryId) || '')
      imageData.append('price', inputValue.price || '')
      imageData.append('parentCategoryId', inputValue.parentCategoryId || '')
      imageData.append('status', inputValue.status.toLowerCase() || '')

      try {
        const response = await ApiPost(`serviceinfo/subcategory`, imageData)
        if (response.status === 200) {
          toast.success('Added Successfully')
          setInputValue({})
          getSubCategories()
          handleClose()
        }
      } catch (err) {
        toast.error(err[0] || err.message)
        setErrors({[err[1]]: err[0]})
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

  const columns = [
    {
      name: 'Sequence Number',
      selector: (row) => row.sequenceNumber,
      sortable: true,
    },
    {
      name: 'Sub Category',
      selector: (row) => row.subCategory,
      sortable: true,
      width: '200px',
    },
    {
      name: 'Category',
      selector: (row) => row.category,
      sortable: true,
      width: '200px',
    },
    // {
    //   name: 'Image',
    //   cell: (row) => {
    //     return <Image className='image' src={process.env.REACT_APP_SERVER_URL + row.image} />
    //   },
    // },

    {
      name: 'Price',
      selector: (row) => row.price,
      sortable: true,
    },
    {
      name: 'Status',
      selector: (row) => row.status,
      cell: (row) => {
        return (
          <span
            className={`badge badge-light-${
              row.status.toLowerCase() === 'active' ? 'success' : 'warning'
            }`}
          >
            {row.status}
          </span>
        )
      },
      sortable: true,
    },
    {
      name: 'Action',
      cell: (row) => {
        return (
          <>
            <span
              className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
              onClick={() => {
                handleOpen()
                setRowId(row.id)
                setInputValue(row)
                getCategories()
              }}
            >
              <KTSVG path='/media/icons/duotune/art/art005.svg' className='svg-icon-3' />
            </span>
            <span
              className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm'
              onClick={() => {
                setShow(true)
                setRowId(row.id)
              }}
            >
              <KTSVG path='/media/icons/duotune/general/gen027.svg' className='svg-icon-3' />
            </span>
          </>
        )
      },
    },
  ]

  const data = subCategories?.map((subCategory) => {
    return {
      id: subCategory?._id,
      subCategory: subCategory?.subCategoryName,
      subCategoryImage: subCategory?.subCategoryImage,
      category: subCategory?.parentCategoryDetails[0]?.categoryName,
      parentCategoryId: subCategory?.parentCategoryId,
      sequenceNumber: subCategory?.sequenceNumber,
      price: subCategory?.price,
      status:
        subCategory?.status?.charAt(0)?.toUpperCase() +
        subCategory?.status?.substr(1)?.toLowerCase(),
    }
  })

  const filteredItems = data.filter(
    (item) =>
      (item.subCategory && item.subCategory.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.category && item.category.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.sequenceNumber &&
        item.sequenceNumber.toString().toLowerCase().includes(filterText.toLowerCase())) ||
      (item.status && item.status.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.price && item.price.toString().toLowerCase().includes(filterText.toLowerCase()))
  )

  const subHeaderComponentMemo = useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle)
        setFilterText('')
      }
    }
    return (
      <Box className='header-wrapper'>
        <Box className='search-wrapper'>
          <span className='search-icon'>
            <KTSVG path='/media/icons/duotune/general/gen021.svg' className='svg-icon-1' />
          </span>

          <input
            type='text'
            className='form-control form-control-lg form-control-solid mb-3 mb-lg-0 px-12'
            placeholder='Search'
            onChange={(e) => setFilterText(e.target.value)}
            value={filterText}
          />
          <ClearIcon className='input-clear-button' onClick={handleClear} />
        </Box>
        <button
          className='btn btn-md btn-light-primary'
          onClick={() => {
            setAddOpen(true)
            getCategories()
          }}
        >
          <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-2' />
          Add Sub Category
        </button>
      </Box>
    )
  }, [filterText, resetPaginationToggle])

  const status = [
    {label: 'Active', value: 'Active'},
    {label: 'Inactive', value: 'Inactive'},
  ]

  const customStyles = {
    headCells: {
      style: {
        paddingLeft: '8px',
        paddingRight: '8px',
      },
    },
  }

  const click = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }

  const SubCategoryBreadCrumbs = [
    {
      title: 'Service Info',
      path: '/service-info/category',
      isSeparator: false,
      isActive: false,
    },
    {
      title: '',
      path: '',
      isSeparator: true,
      isActive: false,
    },
  ]

  if (loader) {
    return (
      <Box className='loader'>
        <CircularProgress color='secondary' />
      </Box>
    )
  }

  const blankImg = toAbsoluteUrl('/media/svg/avatars/blank.svg')
  const subCategoryImg = previewImage
    ? previewImage
    : inputValue.subCategoryImage
    ? `${inputValue.subCategoryImage}`
    : blankImg

  return (
    <>
      <PageTitle breadcrumbs={SubCategoryBreadCrumbs}>
        {intl.formatMessage({id: 'MENU.SERVICE_INFO.SUB_CATEGORY'})}
      </PageTitle>
      <DataTable
        customStyles={customStyles}
        columns={columns}
        data={filteredItems}
        fixedHeader
        fixedHeaderScrollHeight='57vh'
        pagination
        paginationResetDefaultPage={resetPaginationToggle}
        subHeader
        subHeaderComponent={subHeaderComponentMemo}
        persistTableHead
        responsive
      />
      <Modal show={show} onHide={handleClose}>
        <>
          <Modal.Header closeButton>
            <Modal.Title className='text-danger'>Alert!</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete this row</Modal.Body>
          <Modal.Footer>
            <button className='btn btn-white btn-active-light-danger me-2' onClick={handleClose}>
              Discard
            </button>
            <button
              className='btn btn-danger'
              onClick={() => {
                handleDelete()
                click()
              }}
            >
              {!loading && 'Delete'}
              {loading && (
                <span className='indicator-progress' style={{display: 'block'}}>
                  Please wait...{' '}
                  <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                </span>
              )}
            </button>
          </Modal.Footer>
        </>
      </Modal>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth='xs'>
        <DialogTitle>
          <Box sx={{display: 'flex'}}>
            <Box flexGrow={1}>
              <h3 className='fw-bolder m-0'>Edit Row</h3>
            </Box>
            <Box>
              <IconButton color='inherit' onClick={handleClose} aria-label='close'>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent>
          <div className='fv-row mb-7'>
            <label className='d-block fw-bold fs-6 mb-5 required'>Sub Category Image</label>
            <div
              className='image-input image-input-outline'
              data-kt-image-input='true'
              style={{backgroundImage: `url('${blankImg}')`}}
            >
              <div
                className='image-input-wrapper w-125px h-125px'
                style={{backgroundImage: `url('${subCategoryImg}')`}}
              ></div>
              <label
                className='btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow'
                data-kt-image-input-action='change'
                data-bs-toggle='tooltip'
                title='Change sub category image'
              >
                <i className='bi bi-pencil-fill fs-7'></i>

                <input
                  type='file'
                  name='subCategoryImage'
                  accept={imgExtensions.join(', ')}
                  onChange={(e) => {
                    setSubCategoryImage(e.target.files[0])
                  }}
                />
                <input type='hidden' name='remove sub category image' />
              </label>

              {/* <span
                className='btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow'
                data-kt-image-input-action='cancel'
                data-bs-toggle='tooltip'
                title='Cancel profile image'
              >
                <i className='bi bi-x fs-2'></i>
              </span> */}

              <span
                className='btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow'
                data-kt-image-input-action='remove'
                data-bs-toggle='tooltip'
                title='Remove sub category image'
                onClick={() => {
                  setPreviewImage('')
                  setSubCategoryImage(null)
                }}
              >
                <i className='bi bi-x fs-2'></i>
              </span>
            </div>
            <div className='form-text'>{`Allowed file types: ${imgExtensions.join(', ')}`}</div>
            <span className='error-msg'>{errors['subCategoryImage']}</span>
          </div>

          <label className='col-lg-4 col-form-label required fw-bold fs-6'>Sub Category</label>
          <input
            type='text'
            className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
            placeholder='Sub Category'
            onChange={(e) => handleChange(e)}
            name='subCategory'
            value={inputValue?.subCategory || ''}
            required
          />
          <span className='error-msg'>{errors['subCategory']}</span>
          <label className='col-lg-4 col-form-label required fw-bold fs-6'>Category Name</label>
          <select
            className='form-select form-select-solid form-select-lg fw-bold'
            onChange={(e) => handleChange(e)}
            name='parentCategoryId'
            value={inputValue?.parentCategoryId || ''}
            required
          >
            <option value=''>Select Category</option>
            {categories?.sort(compare)?.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
          <span className='error-msg'>{errors['parentCategoryId']}</span>
          {/* <TextField
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
          </span> */}
          <label className='col-lg-4 col-form-label required fw-bold fs-6'>Price</label>
          <input
            type='text'
            className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
            placeholder='Price'
            onChange={(e) => handleChange(e)}
            name='price'
            value={inputValue?.price || ''}
            required
          />
          <span className='error-msg'>{errors['price']}</span>
          <label className='col-lg-4 col-form-label required fw-bold fs-6'>Status</label>
          <select
            className='form-select form-select-solid form-select-lg fw-bold'
            onChange={(e) => handleChange(e)}
            name='status'
            value={inputValue?.status || ''}
            required
          >
            <option value=''>Select Status</option>
            {status.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <span className='error-msg'>{errors['status']}</span>
        </DialogContent>
        <div className='d-flex justify-content-center py-6 px-9'>
          <button className='btn btn-white btn-active-light-primary me-2' onClick={handleClose}>
            Discard
          </button>
          <button
            className='btn btn-primary'
            onClick={() => {
              handleUpdate()
              click()
            }}
          >
            {!loading && 'Save'}
            {loading && (
              <span className='indicator-progress' style={{display: 'block'}}>
                Please wait...{' '}
                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
              </span>
            )}
          </button>
        </div>
      </Dialog>

      <Dialog open={addOpen} onClose={handleClose} fullWidth maxWidth='xs'>
        <DialogTitle>
          <Box sx={{display: 'flex'}}>
            <Box flexGrow={1}>
              <h3 className='fw-bolder m-0'>Add New Row</h3>
            </Box>
            <Box>
              <IconButton color='inherit' onClick={handleClose} aria-label='close'>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent>
          <div className='fv-row mb-7'>
            <label className='d-block fw-bold fs-6 mb-5 required'>Sub Category Image</label>
            <div
              className='image-input image-input-outline'
              data-kt-image-input='true'
              style={{backgroundImage: `url('${blankImg}')`}}
            >
              <div
                className='image-input-wrapper w-125px h-125px'
                style={{backgroundImage: `url('${subCategoryImg}')`}}
              ></div>
              <label
                className='btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow'
                data-kt-image-input-action='change'
                data-bs-toggle='tooltip'
                title='Change sub category image'
              >
                <i className='bi bi-pencil-fill fs-7'></i>

                <input
                  type='file'
                  name='subCategoryImage'
                  accept={imgExtensions.join(', ')}
                  onChange={(e) => {
                    setSubCategoryImage(e.target.files[0])
                  }}
                />
                <input type='hidden' name='remove sub category image' />
              </label>

              {/* <span
                className='btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow'
                data-kt-image-input-action='cancel'
                data-bs-toggle='tooltip'
                title='Cancel profile image'
              >
                <i className='bi bi-x fs-2'></i>
              </span> */}

              <span
                className='btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow'
                data-kt-image-input-action='remove'
                data-bs-toggle='tooltip'
                title='Remove sub category image'
                onClick={() => {
                  setPreviewImage('')
                  setSubCategoryImage(null)
                }}
              >
                <i className='bi bi-x fs-2'></i>
              </span>
            </div>
            <div className='form-text'>{`Allowed file types: ${imgExtensions.join(', ')}`}</div>
            <span className='error-msg'>{errors['subCategoryImage']}</span>
          </div>

          <label className='col-lg-4 col-form-label required fw-bold fs-6'>Sub Category</label>
          <input
            type='text'
            className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
            placeholder='Sub Category'
            onChange={(e) => handleChange(e)}
            name='subCategory'
            value={inputValue?.subCategory || ''}
            required
          />
          <span className='error-msg'>{errors['subCategory']}</span>
          <label className='col-lg-4 col-form-label required fw-bold fs-6'>Category Name</label>
          <select
            className='form-select form-select-solid form-select-lg fw-bold'
            onChange={(e) => handleChange(e)}
            name='parentCategoryId'
            value={inputValue?.parentCategoryId || ''}
            required
          >
            <option value=''>Select Category</option>
            {categories?.sort(compare)?.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
          <span className='error-msg'>{errors['parentCategoryId']}</span>
          {/* <TextField
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
          </span> */}
          <label className='col-lg-4 col-form-label required fw-bold fs-6'>Price</label>
          <input
            type='text'
            className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
            placeholder='Price'
            onChange={(e) => handleChange(e)}
            name='price'
            value={inputValue?.price || ''}
            required
          />
          <span className='error-msg'>{errors['price']}</span>
          <label className='col-lg-4 col-form-label required fw-bold fs-6'>Status</label>
          <select
            className='form-select form-select-solid form-select-lg fw-bold'
            onChange={(e) => handleChange(e)}
            name='status'
            value={inputValue?.status || ''}
            required
          >
            <option value=''>Select Status</option>
            {status.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <span className='error-msg'>{errors['status']}</span>
        </DialogContent>
        <div className='d-flex justify-content-center py-6 px-9'>
          <button className='btn btn-white btn-active-light-primary me-2' onClick={handleClose}>
            Discard
          </button>
          <button
            className='btn btn-primary'
            onClick={() => {
              handleAdd()
              click()
            }}
          >
            {!loading && 'Save'}
            {loading && (
              <span className='indicator-progress' style={{display: 'block'}}>
                Please wait...{' '}
                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
              </span>
            )}
          </button>
        </div>
      </Dialog>
    </>
  )
}
export {SubCategory}
