/* eslint-disable jsx-a11y/anchor-is-valid */
import {useContext, useEffect, useMemo, useState} from 'react'
import DatePicker from 'react-datepicker'
import {useIntl} from 'react-intl'
import moment from 'moment'
import {PageTitle} from '../../../_metronic/layout/core'
import DataTable from 'react-data-table-component'
import {ApiGet, ApiDelete, ApiPut, ApiPost} from '../../../helpers/API/ApiData'
import {toast} from 'react-toastify'
import Dialog from '@material-ui/core/Dialog'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import {Modal} from 'react-bootstrap'
import ClearIcon from '@mui/icons-material/Clear'
import {KTSVG} from '../../../_metronic/helpers/components/KTSVG'
import {Box, CircularProgress, DialogContent, DialogTitle} from '@material-ui/core'
import '../../App.css'
import {MasterContext} from '../../context/masterContext'

const OffersAndBanners = () => {
  const intl = useIntl()
  const {imgExtensions} = useContext(MasterContext)
  const [offers, setOffers] = useState([])
  // const [imageLoaded, setImageLoaded] = useState(false)
  const [open, setOpen] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [rowId, setRowId] = useState('')
  const [bannerImage, setBannerImage] = useState(null)
  const [inputValue, setInputValue] = useState({})
  const [loading, setLoading] = useState(false)
  const [loader, setLoader] = useState(false)
  const [show, setShow] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [errors, setErrors] = useState({})
  const [filterText, setFilterText] = useState('')
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false)
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)

  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    setShow(false)
    setAddOpen(false)
    setErrors({})
    setPreviewImage('')
    setStartDate(null)
    setEndDate(null)
  }

  useEffect(() => {
    getOffers()
  }, [])

  useEffect(() => {
    if (!bannerImage) {
      setPreviewImage(null)
      return
    }
    const objectUrl = URL.createObjectURL(bannerImage)
    setPreviewImage(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [bannerImage])

  const getOffers = async () => {
    try {
      setLoader(true)
      const response = await ApiGet(`offer`)
      if (response.status === 200) {
        setOffers(response.data.data)
      }
      setLoader(false)
    } catch (err) {
      toast.error(err.message)
      setLoader(false)
    }
  }

  const handleDelete = async () => {
    try {
      setLoading(true)
      const response = await ApiDelete(`offer?_id=${rowId}`)

      if (response.status === 200) {
        getOffers()
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

    if (inputValue && !inputValue?.title) {
      formIsValid = false
      errors['title'] = '*Please Enter Title!'
    }

    if (inputValue && !inputValue?.description) {
      formIsValid = false
      errors['description'] = '*Please Enter Description!'
    }
    if (inputValue && !inputValue?.image && !bannerImage) {
      formIsValid = false
      errors['bannerImage'] = '*Please Select Banner Image!'
    }
    if (inputValue && !inputValue?.code) {
      formIsValid = false
      errors['code'] = '*Please Enter Offer Code!'
    }
    if (inputValue && !inputValue?.discount) {
      formIsValid = false
      errors['discount'] = '*Please Enter Discount!'
    }
    if (inputValue && !inputValue?.startDate && !startDate) {
      formIsValid = false
      errors['startDate'] = '*Please Select Start Date!'
    }

    if (inputValue && !inputValue?.endDate && !endDate) {
      formIsValid = false
      errors['endDate'] = '*Please Select End Date!'
    }
    setErrors(errors)
    return formIsValid
  }

  const handleUpdate = async () => {
    if (validateForm()) {
      const offerData = new FormData()
      offerData.append('image', bannerImage || '')
      offerData.append('title', inputValue.title)
      offerData.append('description', inputValue.description)
      offerData.append('code', inputValue.code)
      offerData.append('discount', inputValue.discount)
      offerData.append('startDate', startDate)
      offerData.append('endDate', endDate)
      try {
        const response = await ApiPut(`offer?_id=${rowId}`, offerData)
        if (response.status === 200) {
          toast.success('Updated Successfully')
          setInputValue({})
          getOffers()
          handleClose()
        }
      } catch (err) {
        toast.error(err.error || err.message)
        setErrors({[err.field]: err.error})
      }
    }
  }

  const handleAdd = async () => {
    if (validateForm()) {
      const offerData = new FormData()
      offerData.append('image', bannerImage || '')
      offerData.append('title', inputValue.title)
      offerData.append('description', inputValue.description)
      offerData.append('code', inputValue.code)
      offerData.append('discount', inputValue.discount)
      offerData.append('startDate', startDate)
      offerData.append('endDate', endDate)

      try {
        const response = await ApiPost(`offer`, offerData)
        if (response.status === 200) {
          toast.success('Added Successfully')
          getOffers()
          setInputValue({})
          handleClose()
        }
      } catch (err) {
        toast.error(err[0] || err.message)
        setErrors({[err[1]]: err[0]})
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

  const userProfileImg = previewImage
    ? previewImage
    : inputValue.image
    ? `${process.env.REACT_APP_SERVER_URL}${inputValue.image}`
    : ''

  const columns = [
    {
      name: 'Banner Image',
      selector: (row) => row.image,
      cell: (row) => {
        return (
          <>
            <div className='d-flex align-items-center'>
              <div
                className='image-input image-input-outline'
                data-kt-image-input='true'
                style={
                  !row.image
                    ? {
                        // backgroundImage: `url(${blankImg})`,
                        width: '250px',
                        height: '131px',
                        border: '3px dashed #E5E9F2',
                      }
                    : {
                        width: '250px',
                        height: '131px',
                      }
                }
              >
                {row.image ? (
                  <div
                    className='image-input-wrapper'
                    style={{
                      backgroundImage: `url('${process.env.REACT_APP_SERVER_URL + row.image}')`,
                      width: '250px',
                      height: '131px',
                    }}
                  ></div>
                ) : (
                  <div
                    style={{
                      fontSize: '20px',
                      color: '#ccc',
                      fontFamily: 'inherit',
                      fontWeight: '500',
                      textAlign: 'center',
                      lineHeight: '131px',
                    }}
                  >
                    Banner Image
                  </div>
                )}
              </div>
            </div>
          </>
        )
      },
      sortable: true,
      width: '300px',
    },
    {
      name: 'Title',
      selector: (row) => row.title,
      sortable: true,
    },
    {
      name: 'Description',
      selector: (row) => row.description,
      sortable: true,
    },
    {
      name: 'Offer Code',
      selector: (row) => row.code,
      sortable: true,
    },
    {
      name: 'Discount',
      selector: (row) => row.discount,
      sortable: true,
    },
    {
      name: 'Start Date',
      selector: (row) => moment(row.startDate).format('DD MMM YY'),
      sortable: true,
    },
    {
      name: 'End Date',
      selector: (row) => moment(row.endDate).format('DD MMM YY'),
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
                setStartDate(row.startDate)
                setEndDate(row.endDate)
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

  const data = offers?.map((offer) => {
    return {
      id: offer._id,
      image: offer.image,
      title: offer.title,
      description: offer.description,
      code: offer.code,
      discount: offer.discount,
      startDate: new Date(offer.startDate),
      endDate: new Date(offer.endDate),
    }
  })

  const filteredItems = data.filter(
    (item) =>
      (item.title && item.title.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.description && item.description.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.code && item.code.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.discount &&
        item.discount.toString().toLowerCase().includes(filterText.toLowerCase())) ||
      (item.startDate &&
        moment(item.startDate)
          .format('DD MMM YY')
          .toLowerCase()
          .includes(filterText.toLowerCase())) ||
      (item.endDate &&
        moment(item.endDate).format('DD MMM YY').toLowerCase().includes(filterText.toLowerCase()))
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
            setInputValue({})
          }}
        >
          <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-2' />
          Add Offer
        </button>
      </Box>
    )
  }, [filterText, resetPaginationToggle])

  const handleClearStartDate = () => {
    setStartDate(null)
    setInputValue({...inputValue, startDate: null})
  }

  const handleClearEndDate = () => {
    setEndDate(null)
    setInputValue({...inputValue, endDate: null})
  }

  if (loader) {
    return (
      <Box className='loader'>
        <CircularProgress color='secondary' />
      </Box>
    )
  }

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

  const OffersBreadCrumbs = [
    {
      title: 'Offers & Banners',
      path: '/offers-and-banners',
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

  return (
    <>
      <PageTitle breadcrumbs={OffersBreadCrumbs}>
        {intl.formatMessage({id: 'MENU.USER_MANAGEMENT.CUSTOMERS'})}
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
            <label className='d-block fw-bold fs-6 mb-5'>Banner Image</label>
            <div
              className='image-input image-input-outline'
              data-kt-image-input='true'
              style={
                !userProfileImg
                  ? {
                      // backgroundImage: `url(${blankImg})`,
                      width: '367px',
                      height: '131px',
                      border: '3px dashed #E5E9F2',
                    }
                  : {
                      width: '367px',
                      height: '131px',
                    }
              }
            >
              {userProfileImg ? (
                <div
                  className='image-input-wrapper'
                  style={{
                    backgroundImage: `url('${userProfileImg}')`,
                    width: '367px',
                    height: '131px',
                    // backgroundSize: 'contain',
                  }}
                ></div>
              ) : (
                <div
                  style={{
                    fontSize: '20px',
                    color: '#ccc',
                    fontFamily: 'inherit',
                    fontWeight: '500',
                    textAlign: 'center',
                    lineHeight: '131px',
                  }}
                >
                  Banner Image
                </div>
              )}
              <label
                className='btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow'
                data-kt-image-input-action='change'
                data-bs-toggle='tooltip'
                title='Change Banner image'
              >
                <i className='bi bi-pencil-fill fs-7'></i>

                <input
                  type='file'
                  name='bannerImage'
                  accept={imgExtensions.join(', ')}
                  onChange={(e) => {
                    setBannerImage(e.target.files[0])
                    setErrors({...errors, bannerImage: ''})
                  }}
                />
                <input type='hidden' name='remove profile image' />
              </label>

              <span
                className='btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow'
                data-kt-image-input-action='remove'
                data-bs-toggle='tooltip'
                title='Remove Banner image'
                onClick={() => {
                  setPreviewImage('')
                  setBannerImage(null)
                  setInputValue({...inputValue, image: ''})
                }}
              >
                <i className='bi bi-x fs-2'></i>
              </span>
            </div>
            <div className='form-text'>{`Allowed file types: ${imgExtensions.join(', ')}`}</div>
            <span className='error-msg'>{errors['bannerImage']}</span>
          </div>

          <label className='col-lg-4 col-form-label required fw-bold fs-6'>Title</label>
          <input
            type='text'
            className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
            placeholder='Title'
            onChange={(e) => handleChange(e)}
            name='title'
            value={inputValue?.title || ''}
            required
          />
          <span className='error-msg'>{errors['title']}</span>

          <label className='col-lg-4 col-form-label required fw-bold fs-6'>Description</label>
          <input
            type='text'
            className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
            placeholder='Description'
            onChange={(e) => handleChange(e)}
            name='description'
            value={inputValue?.description || ''}
            required
          />
          <span className='error-msg'>{errors['description']}</span>

          <label className='col-lg-4 col-form-label required fw-bold fs-6'>Code</label>
          <input
            type='text'
            className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
            placeholder='Offer Code'
            onChange={(e) => handleChange(e)}
            name='code'
            value={inputValue?.code || ''}
            required
          />
          <span className='error-msg'>{errors['code']}</span>

          <label className='col-lg-4 col-form-label required fw-bold fs-6'>Discount</label>
          <input
            type='text'
            className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
            placeholder='Discount'
            onChange={(e) => handleChange(e)}
            name='discount'
            value={inputValue?.discount || ''}
            required
          />
          <span className='error-msg'>{errors['discount']}</span>

          <label className='col-lg-4 col-form-label required fw-bold fs-6'>Start Date</label>
          <div
            style={{
              position: 'relative',
            }}
          >
            <DatePicker
              className='form-control form-control-lg form-control-solid mb-3 mb-lg-0 px-3 date-picker'
              popperClassName='date-picker-popper'
              showPopperArrow={false}
              popperPlacement='top-start'
              placeholderText='Select Offer Start Date'
              maxDate={endDate || inputValue?.endDate}
              selected={startDate || inputValue?.startDate}
              onChange={(date) => {
                setStartDate(date)
                setErrors({...errors, startDate: ''})
              }}
            />
            <ClearIcon
              className='input-clear-button'
              style={{
                position: 'absolute',
                right: '10px',
                top: '30%',
              }}
              onClick={handleClearStartDate}
            />
          </div>
          <span className='error-msg'>{errors['startDate']}</span>

          <label className='col-lg-4 col-form-label required fw-bold fs-6'>End Date</label>
          <div
            style={{
              position: 'relative',
            }}
          >
            <DatePicker
              className='form-control form-control-lg form-control-solid mb-3 mb-lg-0 px-3 date-picker'
              popperClassName='date-picker-popper'
              showPopperArrow={false}
              popperPlacement='top-start'
              placeholderText='Select Offer End Date'
              minDate={startDate || inputValue?.startDate}
              selected={endDate || inputValue?.endDate}
              onChange={(date) => {
                setEndDate(date)
                setErrors({...errors, endDate: ''})
              }}
            />
            <ClearIcon
              className='input-clear-button'
              style={{
                position: 'absolute',
                right: '10px',
                top: '30%',
              }}
              onClick={handleClearEndDate}
            />
          </div>
          <span className='error-msg'>{errors['endDate']}</span>
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
            <label className='d-block fw-bold fs-6 mb-5'>Banner Image</label>
            <div
              className='image-input image-input-outline'
              data-kt-image-input='true'
              style={
                !userProfileImg
                  ? {
                      // backgroundImage: `url(${blankImg})`,
                      width: '367px',
                      height: '131px',
                      border: '3px dashed #E5E9F2',
                    }
                  : {
                      width: '367px',
                      height: '131px',
                    }
              }
            >
              {userProfileImg ? (
                <div
                  className='image-input-wrapper'
                  style={{
                    backgroundImage: `url('${userProfileImg}')`,
                    width: '367px',
                    height: '131px',
                    // backgroundSize: 'contain',
                  }}
                ></div>
              ) : (
                <div
                  style={{
                    fontSize: '20px',
                    color: '#ccc',
                    fontFamily: 'inherit',
                    fontWeight: '500',
                    textAlign: 'center',
                    lineHeight: '131px',
                  }}
                >
                  Banner Image
                </div>
              )}
              <label
                className='btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow'
                data-kt-image-input-action='change'
                data-bs-toggle='tooltip'
                title='Change Banner image'
              >
                <i className='bi bi-pencil-fill fs-7'></i>

                <input
                  type='file'
                  name='bannerImage'
                  accept={imgExtensions.join(', ')}
                  onChange={(e) => {
                    setBannerImage(e.target.files[0])
                    setErrors({...errors, bannerImage: ''})
                  }}
                />
                <input type='hidden' name='remove profile image' />
              </label>

              <span
                className='btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow'
                data-kt-image-input-action='remove'
                data-bs-toggle='tooltip'
                title='Remove Banner image'
                onClick={() => {
                  setPreviewImage('')
                  setBannerImage(null)
                  setInputValue({...inputValue, image: ''})
                }}
              >
                <i className='bi bi-x fs-2'></i>
              </span>
            </div>
            <div className='form-text'>{`Allowed file types: ${imgExtensions.join(', ')}`}</div>
            <span className='error-msg'>{errors['bannerImage']}</span>
          </div>

          <label className='col-lg-4 col-form-label required fw-bold fs-6'>Title</label>
          <input
            type='text'
            className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
            placeholder='Title'
            onChange={(e) => handleChange(e)}
            name='title'
            value={inputValue?.title || ''}
            required
          />
          <span className='error-msg'>{errors['title']}</span>

          <label className='col-lg-4 col-form-label required fw-bold fs-6'>Description</label>
          <input
            type='text'
            className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
            placeholder='Description'
            onChange={(e) => handleChange(e)}
            name='description'
            value={inputValue?.description || ''}
            required
          />
          <span className='error-msg'>{errors['description']}</span>

          <label className='col-lg-4 col-form-label required fw-bold fs-6'>Code</label>
          <input
            type='text'
            className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
            placeholder='Offer Code'
            onChange={(e) => handleChange(e)}
            name='code'
            value={inputValue?.code || ''}
            required
          />
          <span className='error-msg'>{errors['code']}</span>

          <label className='col-lg-4 col-form-label required fw-bold fs-6'>Discount</label>
          <input
            type='text'
            className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
            placeholder='Discount'
            onChange={(e) => handleChange(e)}
            name='discount'
            value={inputValue?.discount || ''}
            required
          />
          <span className='error-msg'>{errors['discount']}</span>

          <label className='col-lg-4 col-form-label required fw-bold fs-6'>Start Date</label>
          <div
            style={{
              position: 'relative',
            }}
          >
            <DatePicker
              className='form-control form-control-lg form-control-solid mb-3 mb-lg-0 px-3 date-picker'
              popperClassName='date-picker-popper'
              showPopperArrow={false}
              selected={startDate || inputValue?.startDate}
              maxDate={endDate || inputValue?.endDate}
              popperPlacement='top-start'
              placeholderText='Select Offer Start Date'
              onChange={(date) => {
                setStartDate(date)
                setErrors({...errors, startDate: ''})
              }}
            />
            <ClearIcon
              className='input-clear-button'
              style={{
                position: 'absolute',
                right: '10px',
                top: '30%',
              }}
              onClick={handleClearStartDate}
            />
          </div>
          <span className='error-msg'>{errors['startDate']}</span>

          <label className='col-lg-4 col-form-label required fw-bold fs-6'>End Date</label>
          <div
            style={{
              position: 'relative',
            }}
          >
            <DatePicker
              className='form-control form-control-lg form-control-solid mb-3 mb-lg-0 px-3 date-picker'
              popperClassName='date-picker-popper'
              showPopperArrow={false}
              minDate={startDate || inputValue?.startDate}
              selected={endDate || inputValue?.endDate}
              popperPlacement='top-start'
              placeholderText='Select Offer End Date'
              onChange={(date) => {
                setEndDate(date)
                setErrors({...errors, endDate: ''})
              }}
            />
            <ClearIcon
              className='input-clear-button'
              style={{
                position: 'absolute',
                right: '10px',
                top: '30%',
              }}
              onClick={handleClearEndDate}
            />
          </div>
          <span className='error-msg'>{errors['endDate']}</span>
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

export {OffersAndBanners}
