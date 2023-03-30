/* eslint-disable jsx-a11y/anchor-is-valid */
import {useContext, useEffect, useMemo, useState} from 'react'
import {useIntl} from 'react-intl'
import moment from 'moment'
import clsx from 'clsx'
import {PageTitle} from '../../../_metronic/layout/core'
import DataTable from 'react-data-table-component'
import {ApiGet, ApiDelete, ApiPut, ApiPost} from '../../../helpers/API/ApiData'
import {toast} from 'react-toastify'
import Dialog from '@material-ui/core/Dialog'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import {Modal} from 'react-bootstrap'
import ClearIcon from '@mui/icons-material/Clear'
import userImage from '../../../assets/user.png'
import _, {isEmpty} from 'lodash'
import {KTSVG} from '../../../_metronic/helpers/components/KTSVG'
import {toAbsoluteUrl} from '../../../_metronic/helpers/AssetHelpers'
import {
  Box,
  CircularProgress,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
} from '@material-ui/core'
import '../../App.css'
import {Image} from 'react-bootstrap-v5'
import {Chip} from '@mui/material'
import {MasterContext} from '../../context/masterContext'

const state = ['warning', 'danger', 'primary', 'success', 'info']

const Vendors = () => {
  const intl = useIntl()
  const {imgExtensions} = useContext(MasterContext)
  const [vendors, setVendors] = useState([])
  const [cities, setCities] = useState([])
  const [states, setStates] = useState([])
  const [profileImage, setProfileImage] = useState(null)
  const [showImage, setShowImage] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [skills, setSkills] = useState([])
  // const [imageLoaded, setImageLoaded] = useState(false)
  const [categories, setCategories] = useState([])
  const [open, setOpen] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [rowId, setRowId] = useState('')
  const [inputValue, setInputValue] = useState({})
  const [loading, setLoading] = useState(false)
  const [loader, setLoader] = useState(false)
  const [show, setShow] = useState(false)
  const [errors, setErrors] = useState({})
  const [filterText, setFilterText] = useState('')
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false)
  const [blockReason, setBlockReason] = useState('')
  const [showBlock, setShowBlock] = useState(false)
  const [showUnblock, setShowUnblock] = useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    setShow(false)
    setAddOpen(false)
    setErrors({})
    setShowImage(false)
    setProfileImage(null)
    setShowBlock(false)
    setBlockReason('')
    setShowUnblock(false)
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
    getVendors()
  }, [])

  useEffect(() => {
    getCategories()
  }, [])

  useEffect(() => {
    if (!profileImage) {
      setPreviewImage('')
      return
    }
    const objectUrl = URL.createObjectURL(profileImage)
    setPreviewImage(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [profileImage])

  const getVendors = async () => {
    try {
      setLoader(true)
      const response = await ApiGet(`customer?type=vendor`)
      if (response.status === 200) {
        setVendors(response.data.data)
      }
      setLoader(false)
    } catch (err) {
      toast.error(err.message)
      setLoader(false)
    }
  }

  const getStates = async () => {
    try {
      const response = await ApiGet(`serviceinfo/state?status=active`)
      if (response.status === 200) {
        setStates(
          response?.data?.data?.map((state) => {
            return {name: state?.stateName, id: state?._id}
          })
        )
      }
    } catch (err) {
      console.log(err)
    }
  }

  const getCities = async (stateId) => {
    try {
      const response = await ApiGet(`serviceinfo/city?status=active&stateId=${stateId}`)
      if (response.status === 200) {
        const cityList = response?.data?.data?.map((city) => {
          return {name: city?.cityName, id: city?._id}
        })
        _.isEmpty(cityList)
          ? setCities([{name: 'No Cities Found', id: 'No Cities Found'}])
          : setCities(cityList)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const getCategories = async () => {
    try {
      const response = await ApiGet(`serviceinfo/category?status=active`)
      if (response.status === 200) {
        setCategories(
          response?.data?.data?.map((category) => {
            return {name: category?.categoryName, id: category?._id}
          })
        )
      }
    } catch (err) {
      console.log(err)
    }
  }

  const blockCustomer = async (customerId) => {
    try {
      setLoading(true)
      const response = await ApiPut(`customer/block?_id=${customerId}`, {
        blockReason: blockReason,
      })
      if (response.status === 200) {
        toast.success('Vendor Blocked Successfully')
        getVendors()
        handleClose()
      }
      setLoading(false)
    } catch (err) {
      toast.error(err.error || err.message)
      setErrors({[err.field]: err.error})
      setLoading(false)
    }
  }

  const unblockCustomer = async (customerId) => {
    try {
      setLoading(true)
      const response = await ApiPut(`customer/unblock?_id=${customerId}`)
      if (response.status === 200) {
        toast.success('Vendor Unblocked Successfully')
        getVendors()
        handleClose()
      }
      setLoading(false)
    } catch (err) {
      toast.error(err.error || err.message)
      setErrors({[err.field]: err.error})
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      setLoading(true)
      const response = await ApiDelete(`customer?_id=${rowId}`)

      if (response.status === 200) {
        getVendors()
        toast.success('Deleted Successfully')
        setSkills([])
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

    if (inputValue && !inputValue?.firstName) {
      formIsValid = false
      errors['firstName'] = '*Please Enter First Name!'
    } else if (inputValue && !inputValue?.firstName?.match(/^\S[a-zA-Z ]+$/)) {
      formIsValid = false
      errors['firstName'] = '*Please Enter Valid First Name Only!'
    }

    if (inputValue && !inputValue?.lastName) {
      formIsValid = false
      errors['lastName'] = '*Please Enter Last Name!'
    } else if (inputValue && !inputValue?.lastName?.match(/^\S[a-zA-Z ]+$/)) {
      formIsValid = false
      errors['lastName'] = '*Please Enter Valid Last Name Only!'
    }

    if (inputValue && !inputValue?.phone) {
      formIsValid = false
      errors['phone'] = '*Please Enter Phone Number!'
    } else if (inputValue && !inputValue?.phone?.match(/^\d{10}$/)) {
      formIsValid = false
      errors['phone'] = '*Please Enter Valid Phone Number!'
    }

    // if (inputValue && !inputValue?.profileImage && !profileImage && addOpen) {
    //   formIsValid = false
    //   errors['profileImage'] = '*Please Select ProfileImage!'
    // }

    if (inputValue && !inputValue?.cityId) {
      formIsValid = false
      errors['city'] = '*Please Select City!'
    }

    if (inputValue && !inputValue?.stateId) {
      formIsValid = false
      errors['state'] = '*Please Select State!'
    }

    if (inputValue && !inputValue?.pincode) {
      formIsValid = false
      errors['pincode'] = '*Please Enter Postal Code!'
    } else if (inputValue && !inputValue?.pincode?.match(/^\d{6}$/)) {
      formIsValid = false
      errors['pincode'] = '*Please Enter Valid Postal Code!'
    }

    // if (inputValue && !inputValue?.address) {
    //   formIsValid = false
    //   errors['address'] = '*Please Enter Address!'
    // }

    if (_.isEmpty(skills)) {
      formIsValid = false
      errors['jobSkills'] = '*Please Select Job Skills!'
    } else if (skills?.length > 5) {
      formIsValid = false
      errors['jobSkills'] = '*Maximum 5 Skills are allowed!'
    }
    setErrors(errors)
    return formIsValid
  }

  const handleUpdate = async () => {
    if (validateForm()) {
      const imageData = new FormData()
      imageData.append('profileImage', profileImage || '')
      imageData.append('firstName', inputValue.firstName)
      imageData.append('lastName', inputValue.lastName)
      imageData.append('phone', inputValue.phone)
      imageData.append('cityId', inputValue.cityId || '')
      imageData.append('stateId', inputValue.stateId || '')
      // imageData.append('address', inputValue.address || '')
      imageData.append('pincode', inputValue.pincode || '')
      skills.forEach((skill) => imageData.append('jobSkills[]', skill || ''))
      // imageData.append('status', inputValue.status)
      try {
        const response = await ApiPut(`customer?_id=${rowId}`, imageData)

        if (response.status === 200) {
          toast.success('Updated Successfully')
          setInputValue({})
          setSkills([])
          getVendors()
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
      const imageData = new FormData()
      imageData.append('profileImage', profileImage || '')
      imageData.append('firstName', inputValue?.firstName)
      imageData.append('lastName', inputValue?.lastName)
      imageData.append('phone', inputValue?.phone)
      imageData.append('cityId', inputValue?.cityId || '')
      imageData.append('stateId', inputValue?.stateId || '')
      // imageData.append('address', inputValue?.address || '')
      imageData.append('pincode', inputValue?.pincode || '')
      imageData.append('type', 'vendor')
      skills.forEach((skill) => imageData.append('jobSkills[]', skill || ''))
      // imageData.append('status', inputValue.status)

      try {
        const response = await ApiPost(`customer`, imageData)
        if (response.status === 200) {
          toast.success('Added Successfully')
          getVendors()
          setInputValue({})
          setSkills([])
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

  const handleSkills = (e) => {
    const {
      target: {value},
    } = e
    setSkills(typeof value === 'string' ? value.split(',') : value)
  }

  const handleSkillDelete = (skill) => {
    const newSkills = skills.filter((item) => item !== skill)
    setSkills(newSkills)
  }

  // const handleImageLoad = () => {
  //   setImageLoaded(true)
  // }

  // const imageStyles = !imageLoaded ? {display: 'none'} : {}

  const blankImg = toAbsoluteUrl('/media/svg/avatars/blank.svg')
  const userProfileImg = previewImage
    ? previewImage
    : inputValue.profileImage
    ? `${inputValue.profileImage}`
    : blankImg

  const columns = [
    // {
    //   name: 'Profile Image',
    //   cell: (row) => {
    //     return (
    //       <Box>
    //         {!imageLoaded && <Image className='image' src={userImage} />}
    //         <Image
    //           className='image'
    //           style={imageStyles}
    //           onLoad={handleImageLoad}
    //           onClick={() => {
    //             setShowImage(true)
    //             setInputValue({...inputValue, profileImage: row.profileImage})
    //           }}
    //           src={
    //             row.profileImage ? process.env.REACT_APP_SERVER_URL + row.profileImage : userImage
    //           }
    //         />
    //       </Box>
    //     )
    //   },
    // },
    {
      name: 'Vendor',
      selector: (row) => row.firstName,
      cell: (row) => {
        const userState = _.sample(state)
        return (
          <>
            {/* {!imageLoaded && (
            <div className='symbol symbol-45px me-5 image'>
              <img src={blankImg} alt='Customer Profile pic' />
            </div>
          )} */}
            <div className='d-flex align-items-center'>
              <div className='symbol symbol-circle symbol-50px overflow-hidden me-3'>
                {row?.profileImage ? (
                  <div className='symbol-label image'>
                    <img
                      // style={imageStyles}
                      // onLoad={handleImageLoad}
                      className='w-100'
                      onClick={() => {
                        setShowImage(true)
                        setInputValue({...inputValue, profileImage: row.profileImage})
                      }}
                      src={row.profileImage ? row.profileImage : userImage}
                      alt='Vendor Profile pic'
                    />
                  </div>
                ) : (
                  <div
                    className={clsx(
                      'symbol-label fs-3',
                      `bg-light-${userState}`,
                      `text-${userState}`
                    )}
                  >
                    {row.firstName?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <div className='d-flex justify-content-start flex-column'>
                <span className='text-dark fw-bolder text-hover-primary fs-6'>{`${
                  row.firstName ? row.firstName : '-'
                } ${row.lastName ? row.lastName : '-'}`}</span>
              </div>
            </div>
          </>
        )
      },
      sortable: true,
      width: '200px',
    },
    {
      name: 'Phone Number',
      selector: (row) => (row.phone ? row.phone : '-'),
      sortable: true,
      width: '150px',
    },
    {
      name: 'Postal Code',
      selector: (row) => (row.pincode ? row.pincode : '-'),
      sortable: true,
      width: '150px',
    },
    {
      name: 'City',
      selector: (row) => (row.city ? row.city : '-'),
      sortable: true,
      width: '150px',
    },
    {
      name: 'State',
      selector: (row) => (row.state ? row.state : '-'),
      sortable: true,
      width: '150px',
    },
    // {
    //   name: 'Address',
    //   selector: (row) => row.address,
    //   cell: (row) => <Box>{row.address}</Box>,
    //   sortable: true,
    //   width: '200px',
    // },
    {
      name: 'No. of Jobs',
      selector: (row) => (row.noOfJobs ? row.noOfJobs : '-'),
      sortable: true,
      width: '150px',
    },
    {
      name: 'Job Skills',
      selector: (row) => row.jobSkills,
      cell: (row) =>
        !isEmpty(row.jobSkills) ? (
          <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 1}}>
            {row?.jobSkills?.map((skill) => (
              <span className='badge badge-light-danger me-1' key={skill}>
                {skill.trim().charAt(0).toUpperCase() + skill.trim().substr(1).toLowerCase()}
              </span>
            ))}
          </Box>
        ) : (
          '-'
        ),
      sortable: true,
      width: '200px',
    },

    {
      name: 'Member Since',
      selector: (row) => (row.memberSince ? row.memberSince : '-'),
      sortable: true,
      width: '200px',
    },
    // {
    //   name: 'Status',
    //   selector: (row) => row.status,
    //   sortable: true,
    //   width: '150px',
    // },
    {
      name: 'Action',
      cell: (row) => {
        return (
          <>
            <span
              className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
              onClick={() => {
                handleOpen()
                setInputValue(row)
                setRowId(row.id)
                setSkills(
                  categories
                    ?.filter((category) => row?.jobSkills?.includes(category.name))
                    .map((category) => category.id)
                )
                getStates()
                row.stateId && getCities(row.stateId)
              }}
            >
              <KTSVG path='/media/icons/duotune/art/art005.svg' className='svg-icon-3' />
            </span>
            <span
              className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
              onClick={() => {
                setShow(true)
                setRowId(row.id)
              }}
            >
              <KTSVG path='/media/icons/duotune/general/gen027.svg' className='svg-icon-3' />
            </span>
            <button
              className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
              onClick={() => {
                setShowBlock(true)
                setRowId(row.id)
              }}
              disabled={row.block}
              title={'Block'}
            >
              <KTSVG path='/media/icons/duotune/general/gen050.svg' className='svg-icon-3' />
            </button>
            <button
              className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm'
              onClick={() => {
                setShowUnblock(true)
                setRowId(row.id)
              }}
              disabled={!row.block}
              title={'Unblock'}
            >
              <KTSVG path='/media/icons/duotune/general/gen048.svg' className='svg-icon-3' />
            </button>
          </>
        )
      },
    },
  ]

  const data = vendors?.map((vendor) => {
    return {
      id: vendor?._id,
      profileImage: vendor?.profileImage,
      firstName: vendor?.firstName,
      lastName: vendor?.lastName,
      customerName: `${vendor?.firstName} ${vendor?.lastName}`,
      phone: vendor?.phone,
      // address: vendor?.address,
      city: vendor?.cityDetails[0]?.cityName,
      cityId: vendor?.cityId,
      state: vendor?.stateDetails[0]?.stateName,
      stateId: vendor?.stateId,
      pincode: vendor?.pincode,
      noOfJobs: vendor?.noOfJobs,
      memberSince: moment(vendor?.createdAt).format('DD MMM YY hh:mmA'),
      jobSkills: categories
        ?.filter((category) => vendor?.jobSkills?.includes(category.id))
        .map((category) => category.name),
      block: vendor?.block,
      // status: vendor?.status?.charAt(0)?.toUpperCase() + vendor?.status?.substr(1)?.toLowerCase(),
    }
  })

  const filteredItems = data.filter(
    (item) =>
      (item?.phone &&
        item?.phone?.toString()?.toLowerCase()?.includes(filterText?.toLowerCase())) ||
      (item?.customerName &&
        item?.customerName?.toLowerCase()?.includes(filterText?.toLowerCase())) ||
      // (item?.lastName && item?.lastName?.toLowerCase()?.includes(filterText?.toLowerCase())) ||
      (item?.pincode &&
        item?.pincode?.toString()?.toLowerCase()?.includes(filterText?.toLowerCase())) ||
      (item?.city && item?.city?.toLowerCase()?.includes(filterText?.toLowerCase())) ||
      (item?.state && item?.state?.toLowerCase()?.includes(filterText?.toLowerCase())) ||
      // (item?.address &&
      //   item?.address?.toString()?.toLowerCase()?.includes(filterText?.toLowerCase())) ||
      (item?.noOfJobs &&
        item?.noOfJobs?.toString()?.toLowerCase()?.includes(filterText?.toLowerCase())) ||
      (item?.memberSince && item?.memberSince?.toLowerCase()?.includes(filterText?.toLowerCase()))
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
            setSkills([])
            getStates()
            setInputValue({})
          }}
        >
          <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-2' />
          Add Vendor
        </button>
      </Box>
    )
  }, [filterText, resetPaginationToggle])

  // const status = [
  //   {label: 'Active', value: 'Active'},
  //   {label: 'Inactive', value: 'Inactive'},
  // ]

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
        color: '#6c757d',
      },
    },
  }

  const click = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }

  const VendorBreadCrumbs = [
    {
      title: 'User Management',
      path: '/user-management/customers',
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
      <PageTitle breadcrumbs={VendorBreadCrumbs}>
        {intl.formatMessage({id: 'MENU.USER_MANAGEMENT.VENDORS'})}
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

      <Modal show={showBlock} onHide={handleClose}>
        <>
          <Modal.Header closeButton>
            <Modal.Title className='text-danger'>Block Vendor!</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <label className='col-lg-4 col-form-label required fw-bold fs-6'>Reason To Block</label>
            <input
              type='text'
              className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
              placeholder='Reason To Block'
              onChange={(e) => {
                setBlockReason(e.target.value)
                setErrors({...errors, blockReason: ''})
              }}
              name='blockReason'
              value={blockReason}
              required
            />
            <span className='error-msg'>{errors['blockReason']}</span>
          </Modal.Body>
          <Modal.Footer>
            <button className='btn btn-white btn-active-light-danger me-2' onClick={handleClose}>
              Discard
            </button>
            <button
              className='btn btn-danger'
              onClick={() => {
                blockCustomer(rowId)
                click()
              }}
            >
              {!loading && 'Block'}
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

      <Modal show={showUnblock} onHide={handleClose}>
        <>
          <Modal.Header closeButton>
            <Modal.Title className='text-danger'>Alert!</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to unblock this vendor</Modal.Body>
          <Modal.Footer>
            <button className='btn btn-white btn-active-light-danger me-2' onClick={handleClose}>
              Discard
            </button>
            <button
              className='btn btn-danger'
              onClick={() => {
                unblockCustomer(rowId)
                click()
              }}
            >
              {!loading && 'Unblock'}
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

      <Modal show={showImage} onHide={handleClose}>
        <>
          <Modal.Header closeButton>
            <Modal.Title>Vendor Profile Image</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Image
              className='model-image'
              src={inputValue?.profileImage ? inputValue?.profileImage : userImage}
            />
          </Modal.Body>
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
            <label className='d-block fw-bold fs-6 mb-5'>Profile Image</label>
            <div
              className='image-input image-input-outline'
              data-kt-image-input='true'
              style={{backgroundImage: `url('${blankImg}')`}}
            >
              <div
                className='image-input-wrapper w-125px h-125px'
                style={{backgroundImage: `url('${userProfileImg}')`}}
              ></div>
              <label
                className='btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow'
                data-kt-image-input-action='change'
                data-bs-toggle='tooltip'
                title='Change profile image'
              >
                <i className='bi bi-pencil-fill fs-7'></i>

                <input
                  type='file'
                  name='profileImage'
                  accept={imgExtensions.join(', ')}
                  onChange={(e) => {
                    setProfileImage(e.target.files[0])
                  }}
                />
                <input type='hidden' name='remove profile image' />
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
                title='Remove profile image'
                onClick={() => {
                  setPreviewImage('')
                  setProfileImage(null)
                  // setInputValue({...inputValue, profileImage: ''})
                }}
              >
                <i className='bi bi-x fs-2'></i>
              </span>
            </div>
            <div className='form-text'>{`Allowed file types: ${imgExtensions.join(', ')}`}</div>
            <span className='error-msg'>{errors['profileImage']}</span>
          </div>
          <label className='col-lg-4 col-form-label required fw-bold fs-6'>First Name</label>
          <input
            type='text'
            className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
            placeholder='First Name'
            onChange={(e) => handleChange(e)}
            name='firstName'
            value={inputValue?.firstName || ''}
            required
          />
          <span className='error-msg'>{errors['firstName']}</span>
          <label className='col-lg-4 col-form-label required fw-bold fs-6'>Last Name</label>
          <input
            type='text'
            className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
            placeholder='Last Name'
            onChange={(e) => handleChange(e)}
            name='lastName'
            value={inputValue?.lastName || ''}
            required
          />
          <span className='error-msg'>{errors['lastName']}</span>
          {/* <label className='col-lg-4 col-form-label required fw-bold fs-6'>Phone</label>
          <input
            type='tel'
            className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
            placeholder='Phone Number'
            onChange={(e) => handleChange(e)}
            name='phone'
            value={inputValue?.phone || ''}
            required
          />
          <span className='error-msg'>{errors['phone']}</span> */}
          <label className='col-lg-4 col-form-label required fw-bold fs-6'>Postal Code</label>
          <input
            type='text'
            className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
            placeholder='Postal Code'
            onChange={(e) => handleChange(e)}
            name='pincode'
            value={inputValue?.pincode || ''}
            required
          />
          <span className='error-msg'>{errors['pincode']}</span>
          <label className='col-lg-4 col-form-label required fw-bold fs-6'>State Name</label>
          <select
            className='form-select form-select-solid form-select-lg fw-bold'
            onChange={(e) => {
              handleChange(e)
              getCities(e.target.value)
            }}
            name='stateId'
            value={inputValue?.stateId || ''}
            required
          >
            <option value=''>Select State</option>
            {states?.sort(compare)?.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
          <span className='error-msg'>{errors['state']}</span>
          <label className='col-lg-4 col-form-label required fw-bold fs-6'>City Name</label>
          <select
            className='form-select form-select-solid form-select-lg fw-bold'
            onChange={(e) => handleChange(e)}
            name='cityId'
            value={inputValue?.cityId || ''}
            required
          >
            <option value=''>Select City</option>
            {cities?.sort(compare)?.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
          <span className='error-msg'>{errors['city']}</span>
          {/* <label className='col-lg-4 col-form-label required fw-bold fs-6'>Address</label> */}
          {/* <input
            type='text'
            className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
            placeholder='Address'
            onChange={(e) => handleChange(e)}
            name='address'
            value={inputValue?.address || ''}
            required
          /> */}
          {/* <span className='error-msg'>{errors['address']}</span> */}
          {/* <TextField
              label='Status'
              name='status'
              onChange={handleChange}
              variant='standard'
              margin='dense'
              fullWidth
              required
              select
              value={inputValue?.status}
              defaultValue={
                inputValue?.status?.charAt(0)?.toUpperCase() +
                inputValue?.status?.substr(1)?.toLowerCase()
              }
            >
              {status.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField> */}
          <label className='col-lg-4 col-form-label required fw-bold fs-6'>Job Skills</label>
          <Select
            disableUnderline={true}
            className={`form-select form-select-solid form-select-lg fw-bold ${
              _.isEmpty(skills) && 'py-4'
            }`}
            multiple
            name='jobSkills'
            fullWidth
            required
            value={skills}
            onChange={handleSkills}
            IconComponent={() => <span style={{display: 'none'}}></span>}
            MenuProps={{
              style: {height: '300px'},
            }}
            renderValue={(selected) => (
              <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 1}}>
                {selected.map((value, index) => {
                  const skill = categories?.find((item) => item?.id === value)?.name
                  return (
                    <Chip
                      className='chip'
                      key={value + index}
                      label={skill}
                      onDelete={() => handleSkillDelete(value)}
                      onMouseDown={(event) => {
                        event.stopPropagation()
                      }}
                    />
                  )
                })}
              </Box>
            )}
          >
            {categories?.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </Select>
          <div className='form-text'>Maximum 5 skills are allowed to select</div>
          <span className='error-msg'>{errors['jobSkills']}</span>
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
            <label className='d-block fw-bold fs-6 mb-5'>Profile Image</label>
            <div
              className='image-input image-input-outline'
              data-kt-image-input='true'
              style={{backgroundImage: `url('${blankImg}')`}}
            >
              <div
                className='image-input-wrapper w-125px h-125px'
                style={{backgroundImage: `url('${userProfileImg}')`}}
              ></div>
              <label
                className='btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow'
                data-kt-image-input-action='change'
                data-bs-toggle='tooltip'
                title='Change profile image'
              >
                <i className='bi bi-pencil-fill fs-7'></i>

                <input
                  type='file'
                  name='profileImage'
                  accept={imgExtensions.join(', ')}
                  onChange={(e) => {
                    setProfileImage(e.target.files[0])
                  }}
                />
                <input type='hidden' name='remove profile image' />
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
                title='Remove profile image'
                onClick={() => {
                  setPreviewImage('')
                  setProfileImage(null)
                  // setInputValue({...inputValue, profileImage: ''})
                }}
              >
                <i className='bi bi-x fs-2'></i>
              </span>
            </div>
            <div className='form-text'>{`Allowed file types: ${imgExtensions.join(', ')}`}</div>
            <span className='error-msg'>{errors['profileImage']}</span>
          </div>
          <label className='col-lg-4 col-form-label required fw-bold fs-6'>First Name</label>
          <input
            type='text'
            className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
            placeholder='First Name'
            onChange={(e) => handleChange(e)}
            name='firstName'
            value={inputValue?.firstName || ''}
            required
          />
          <span className='error-msg'>{errors['firstName']}</span>
          <label className='col-lg-4 col-form-label required fw-bold fs-6'>Last Name</label>
          <input
            type='text'
            className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
            placeholder='Last Name'
            onChange={(e) => handleChange(e)}
            name='lastName'
            value={inputValue?.lastName || ''}
            required
          />
          <span className='error-msg'>{errors['lastName']}</span>
          <label className='col-lg-4 col-form-label required fw-bold fs-6'>Phone</label>
          <input
            type='tel'
            className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
            placeholder='Phone Number'
            onChange={(e) => handleChange(e)}
            name='phone'
            value={inputValue?.phone || ''}
            required
          />
          <span className='error-msg'>{errors['phone']}</span>
          <label className='col-lg-4 col-form-label required fw-bold fs-6'>Postal Code</label>
          <input
            type='text'
            className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
            placeholder='Postal Code'
            onChange={(e) => handleChange(e)}
            name='pincode'
            value={inputValue?.pincode || ''}
            required
          />
          <span className='error-msg'>{errors['pincode']}</span>
          <label className='col-lg-4 col-form-label required fw-bold fs-6'>State Name</label>
          <select
            className='form-select form-select-solid form-select-lg fw-bold'
            onChange={(e) => {
              handleChange(e)
              getCities(e.target.value)
            }}
            name='stateId'
            value={inputValue?.stateId || ''}
            required
          >
            <option value=''>Select State</option>
            {states?.sort(compare)?.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
          <span className='error-msg'>{errors['state']}</span>
          <label className='col-lg-4 col-form-label required fw-bold fs-6'>City Name</label>
          <select
            className='form-select form-select-solid form-select-lg fw-bold'
            onChange={(e) => handleChange(e)}
            name='cityId'
            value={inputValue?.cityId || ''}
            required
          >
            <option value=''>Select City</option>
            {cities?.sort(compare)?.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
          <span className='error-msg'>{errors['city']}</span>
          {/* <label className='col-lg-4 col-form-label required fw-bold fs-6'>Address</label> */}
          {/* <input
            type='text'
            className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
            placeholder='Address'
            onChange={(e) => handleChange(e)}
            name='address'
            value={inputValue?.address || ''}
            required
          /> */}
          {/* <span className='error-msg'>{errors['address']}</span> */}
          <label className='col-lg-4 col-form-label required fw-bold fs-6'>Job Skills</label>
          <Select
            disableUnderline={true}
            className={`form-select form-select-solid form-select-lg fw-bold ${
              _.isEmpty(skills) && 'py-4'
            }`}
            multiple
            name='jobSkills'
            fullWidth
            required
            value={skills}
            onChange={handleSkills}
            IconComponent={() => <span style={{display: 'none'}}></span>}
            MenuProps={{
              style: {height: '300px'},
            }}
            renderValue={(selected) => (
              <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 1}}>
                {selected.map((value, index) => {
                  const skill = categories?.find((item) => item?.id === value)?.name
                  return (
                    <Chip
                      className='chip'
                      key={value + index}
                      label={skill}
                      onDelete={() => handleSkillDelete(value)}
                      onMouseDown={(event) => {
                        event.stopPropagation()
                      }}
                    />
                  )
                })}
              </Box>
            )}
          >
            {categories?.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </Select>
          <div className='form-text'>Maximum 5 skills are allowed to select</div>
          <span className='error-msg'>{errors['jobSkills']}</span>
          {/* <Image
            className='image'
            src={
              inputValue?.profileImage
                ? process.env.REACT_APP_SERVER_URL + inputValue?.profileImage
                : previewImage
                ? previewImage
                : userImage
            }
          /> */}
          {/* <TextField
            InputLabelProps={{shrink: true}}
            label='profileImage'
            name='profileImage'
            type={'file'}
            onChange={(e) => setProfileImage(e.target.files[0])}
            variant='standard'
            margin='dense'
            fullWidth
            required
            helperText={`Please upload images of format ${imgExtensions.join(', ')}`}
          />
          <span
            style={{
              color: 'red',
              top: '5px',
              fontSize: '12px',
            }}
          >
            {errors['profileImage']}
          </span> */}
          {/* <TextField
            label='Vendor Name'
            type={'text'}
            name='customerName'
            onChange={(e) => handleChange(e)}
            variant='standard'
            margin='dense'
            fullWidth
            required
            value={inputValue?.customerName || ''}
          />
          <span
            style={{
              color: 'red',
              top: '5px',
              fontSize: '12px',
            }}
          >
            {errors['customerName']}
          </span> */}
          {/* <TextField
            label='Phone Number'
            type={'tel'}
            name='phone'
            onChange={(e) => handleChange(e)}
            variant='standard'
            margin='dense'
            fullWidth
            required
            value={inputValue?.phone || ''}
          />
          <span
            style={{
              color: 'red',
              top: '5px',
              fontSize: '12px',
            }}
          >
            {errors['phone']}
          </span> */}
          {/* <TextField
            label='Postal Code'
            inputProps={{inputMode: 'numeric', pattern: '[0-9]*'}}
            name='pincode'
            onChange={(e) => handleChange(e)}
            variant='standard'
            margin='dense'
            fullWidth
            required
            value={inputValue?.pincode || ''}
          />
          <span
            style={{
              color: 'red',
              top: '5px',
              fontSize: '12px',
            }}
          >
            {errors['pincode']}
          </span> */}
          {/* <TextField
            label='State Name'
            type={'text'}
            onChange={(e) => {
              handleChange(e)
              getCities(e.target.value)
            }}
            name='stateId'
            fullWidth
            variant='standard'
            margin='dense'
            select
            required
            defaultValue={''}
            value={inputValue?.stateId || ''}
            SelectProps={{
              MenuProps: {
                style: {height: '300px'},
              },
            }}
          >
            {states?.sort(compare)?.map((option) => (
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
            {errors['state']}
          </span> */}
          {/* <TextField
            label='City Name'
            type={'text'}
            onChange={(e) => handleChange(e)}
            name='cityId'
            fullWidth
            variant='standard'
            margin='dense'
            select
            required
            defaultValue={''}
            value={inputValue?.cityId || ''}
            SelectProps={{
              MenuProps: {
                style: {height: '300px'},
              },
            }}
          >
            {cities?.sort(compare)?.map((option) => (
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
            {errors['city']}
          </span> */}
          {/* <TextField
            label='Address'
            type={'text'}
            name='address'
            onChange={(e) => handleChange(e)}
            variant='standard'
            margin='dense'
            fullWidth
            required
            value={inputValue?.address || ''}
          />
          <span
            style={{
              color: 'red',
              top: '5px',
              fontSize: '12px',
            }}
          >
            {errors['address']}
          </span> */}
          {/* <TextField
              label='Status'
              name='status'
              onChange={(e) => handleChange(e)}
              variant='standard'
              margin='dense'
              fullWidth
              required
              select
            >
              {status.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField> */}
          {/* <TextField
            label='Job Skills'
            helperText='Select max upto 5 skills'
            name='jobSkills'
            fullWidth
            variant='standard'
            margin='dense'
            select
            required
            defaultValue={''}
            SelectProps={{
              multiple: true,
              value: skills,
              onChange: handleSkills,
              MenuProps: {
                style: {height: '300px'},
              },
              renderValue: (selected) => (
                <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 1}}>
                  {selected.map((value) => {
                    const skill = categories?.find((item) => item?.id === value)?.name
                    return (
                      <Chip
                        key={value}
                        label={skill}
                        onDelete={() => handleSkillDelete(value)}
                        onMouseDown={(event) => {
                          event.stopPropagation()
                        }}
                      />
                    )
                  })}
                </Box>
              ),
            }}
          >
            {categories?.sort(compare)?.map((option) => (
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
            {errors['jobSkills']}
          </span> */}
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

export {Vendors}
