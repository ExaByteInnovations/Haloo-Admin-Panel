/* eslint-disable jsx-a11y/anchor-is-valid */
import {useEffect, useMemo, useState} from 'react'
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
import ClearIcon from '@mui/icons-material/Clear'
import userImage from '../../../assets/user.png'
import _ from 'lodash'
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
import {Chip} from '@mui/material'

const Vendors = () => {
  const intl = useIntl()
  const [vendors, setVendors] = useState([])
  const [cities, setCities] = useState([])
  const [states, setStates] = useState([])
  const [profileImage, setProfileImage] = useState()
  const [showImage, setShowImage] = useState(false)
  const [previewImage, setPreviewImage] = useState()
  const [skills, setSkills] = useState([])
  const [imageLoaded, setImageLoaded] = useState(false)
  const [categories, setCategories] = useState([])
  const [open, setOpen] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [rowId, setRowId] = useState('')
  const [inputValue, setInputValue] = useState({})
  const [loading, setLoading] = useState(false)
  const [show, setShow] = useState(false)
  const [errors, setErrors] = useState({})
  const [filterText, setFilterText] = useState('')
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    setShow(false)
    setAddOpen(false)
    setErrors({})
    setShowImage(false)
    setProfileImage(null)
  }

  useEffect(() => {
    getVendors()
  }, [])

  useEffect(() => {
    getCategories()
  }, [])

  useEffect(() => {
    if (!profileImage) {
      setPreviewImage(null)
      return
    }
    const objectUrl = URL.createObjectURL(profileImage)
    setPreviewImage(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [profileImage])

  const getVendors = async () => {
    try {
      setLoading(true)
      const response = await ApiGet(`usermanagement/customer?type=vendor`)
      if (response.status === 200) {
        setVendors(response.data.data)
      }
      setLoading(false)
    } catch (err) {
      toast.error(err.message)
      setLoading(false)
    }
  }

  const getStates = async () => {
    try {
      const response = await ApiGet(`serviceinfo/state?status=Active`)
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
      const response = await ApiGet(`serviceinfo/city?status=Active&stateId=${stateId}`)
      if (response.status === 200) {
        const cityList = response?.data?.data?.map((city) => {
          return {name: city?.cityName, id: city?._id}
        })
        console.log(cityList, 'cityList')
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
      const response = await ApiGet(`serviceinfo/category?status=Active`)
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

  const handleDelete = async () => {
    try {
      setLoading(true)
      const response = await ApiDelete(`usermanagement/customer?_id=${rowId}`)

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

    if (inputValue && !inputValue?.customerName) {
      formIsValid = false
      errors['customerName'] = '*Please Enter Customer Name!'
    }
    if (inputValue && !inputValue?.customerName?.match(/^\S[a-zA-Z ]+$/)) {
      formIsValid = false
      errors['customerName'] = '*Please Enter Valid Customer Name Only!'
    }

    if (inputValue && !inputValue?.phone) {
      formIsValid = false
      errors['phone'] = '*Please Enter Phone Number!'
    }
    if (inputValue && !inputValue?.phone?.match(/^\d{10}$/)) {
      formIsValid = false
      errors['phone'] = '*Please Enter Valid Phone Number!'
    }

    if (inputValue && !inputValue?.profileImage && !profileImage && addOpen) {
      formIsValid = false
      errors['profileImage'] = '*Please Select ProfileImage!'
    }

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
    }
    if (inputValue && !inputValue?.pincode?.match(/^\d{6}$/)) {
      formIsValid = false
      errors['pincode'] = '*Please Enter Valid Postal Code!'
    }

    if (inputValue && !inputValue?.address) {
      formIsValid = false
      errors['address'] = '*Please Enter Address!'
    }

    if (_.isEmpty(skills)) {
      formIsValid = false
      errors['jobSkills'] = '*Please Select Job Skills!'
    }
    if (skills?.length > 5) {
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
      imageData.append('customerName', inputValue.customerName)
      imageData.append('phone', inputValue.phone)
      imageData.append('cityId', inputValue.cityId || '')
      imageData.append('stateId', inputValue.stateId || '')
      imageData.append('address', inputValue.address || '')
      imageData.append('pincode', inputValue.pincode || '')
      skills.forEach((skill) => imageData.append('jobSkills[]', skill || ''))
      // imageData.append('status', inputValue.status)
      try {
        setLoading(true)
        const response = await ApiPut(`usermanagement/customer?_id=${rowId}`, imageData)

        if (response.status === 200) {
          toast.success('Updated Successfully')
          setInputValue({})
          setSkills([])
          getVendors()
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

  const handleAdd = async () => {
    if (validateForm()) {
      const imageData = new FormData()
      imageData.append('profileImage', profileImage || '')
      imageData.append('customerName', inputValue?.customerName)
      imageData.append('phone', inputValue?.phone)
      imageData.append('cityId', inputValue?.cityId || '')
      imageData.append('stateId', inputValue?.stateId || '')
      imageData.append('address', inputValue?.address || '')
      imageData.append('pincode', inputValue?.pincode || '')
      imageData.append('type', 'vendor')
      skills.forEach((skill) => imageData.append('jobSkills[]', skill || ''))
      // imageData.append('status', inputValue.status)

      try {
        setLoading(true)
        const response = await ApiPost(`usermanagement/customer`, imageData)
        if (response.status === 200) {
          toast.success('Added Successfully')
          getVendors()
          setInputValue({})
          setSkills([])
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

  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  const imageStyles = !imageLoaded ? {display: 'none'} : {}

  const columns = [
    {
      name: 'Profile Image',
      cell: (row) => {
        return (
          <Box>
            {!imageLoaded && <Image className='image' src={userImage} />}
            <Image
              className='image'
              style={imageStyles}
              onLoad={handleImageLoad}
              onClick={() => {
                setShowImage(true)
                setInputValue({...inputValue, profileImage: row.profileImage})
              }}
              src={
                row.profileImage ? process.env.REACT_APP_SERVER_URL + row.profileImage : userImage
              }
            />
          </Box>
        )
      },
    },
    {
      name: 'Vendor Name',
      selector: (row) => row.customerName,
      cell: (row) => <Box>{row.customerName}</Box>,
      sortable: true,
      width: '150px',
    },
    {
      name: 'Phone Number',
      selector: (row) => row.phone,
      sortable: true,
      width: '150px',
    },
    {
      name: 'Postal Code',
      selector: (row) => row.pincode,
      sortable: true,
      width: '150px',
    },
    {
      name: 'City',
      selector: (row) => row.city,
      sortable: true,
      width: '150px',
    },
    {
      name: 'State',
      selector: (row) => row.state,
      sortable: true,
      width: '150px',
    },
    {
      name: 'Address',
      selector: (row) => row.address,
      cell: (row) => <Box>{row.address}</Box>,
      sortable: true,
      width: '200px',
    },
    {
      name: 'No. of Jobs',
      selector: (row) => row.noOfJobs,
      sortable: true,
      width: '150px',
    },
    {
      name: 'Job Skills',
      selector: (row) => row.jobSkills,
      cell: (row) => (
        <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 1}}>
          {row?.jobSkills?.map((skill) => (
            <Chip
              key={skill}
              label={skill.trim().charAt(0).toUpperCase() + skill.trim().substr(1).toLowerCase()}
              sx={{color: '#000', backgroundColor: '#f5cb5c', fontWeight: 'bold'}}
            />
          ))}
        </Box>
      ),
      sortable: true,
      width: '200px',
    },

    {
      name: 'Member Since',
      selector: (row) => row.memberSince,
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
            <Edit
              className='icon'
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
                getCities(row.stateId)
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

  const data = vendors?.map((vendor) => {
    return {
      id: vendor?._id,
      profileImage: vendor?.profileImage,
      customerName: vendor?.customerName,
      phone: vendor?.phone,
      address: vendor?.address,
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
      // status: vendor?.status?.charAt(0)?.toUpperCase() + vendor?.status?.substr(1)?.toLowerCase(),
    }
  })

  const filteredItems = data.filter(
    (item) =>
      (item.phone && item.phone.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.customerName && item.customerName.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.pincode && item.pincode.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.city && item.city.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.state && item.state.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.address && item.address.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.noOfJobs &&
        item.noOfJobs.toString().toLowerCase().includes(filterText.toLowerCase())) ||
      (item.memberSince && item.memberSince.toLowerCase().includes(filterText.toLowerCase()))
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

  // const status = [
  //   {label: 'Active', value: 'Active'},
  //   {label: 'Inactive', value: 'Inactive'},
  // ]

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
        {intl.formatMessage({id: 'MENU.USER_MANAGEMENT.VENDORS'})}
      </PageTitle>
      <Box className='add-button-wrapper'>
        <Button
          className='add-button'
          variant='success'
          onClick={() => {
            setAddOpen(true)
            setSkills([])
            getStates()
            setInputValue({})
          }}
        >
          Add New +
        </Button>
      </Box>
      <DataTable
        columns={columns}
        data={filteredItems}
        fixedHeader
        fixedHeaderScrollHeight='51vh'
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

      <Modal show={showImage} onHide={handleClose}>
        <>
          <Modal.Header closeButton>
            <Modal.Title>Vendor Profile Image</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Image
              className='model-image'
              src={
                inputValue?.profileImage
                  ? process.env.REACT_APP_SERVER_URL + inputValue?.profileImage
                  : userImage
              }
            />
          </Modal.Body>
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
          <Image
            className='image'
            src={
              inputValue?.profileImage
                ? process.env.REACT_APP_SERVER_URL + inputValue?.profileImage
                : previewImage
                ? previewImage
                : userImage
            }
          />
          <TextField
            InputLabelProps={{shrink: true}}
            label='ProfileImage'
            name='profileImage'
            type={'file'}
            onChange={(e) => setProfileImage(e.target.files[0])}
            variant='standard'
            margin='dense'
            fullWidth
            helperText='Please upload images of format jpg, jpeg, png'
          />
          <span
            style={{
              color: 'red',
              top: '5px',
              fontSize: '12px',
            }}
          >
            {errors['profileImage']}
          </span>
          <TextField
            label='Vendor Name'
            type={'text'}
            name='customerName'
            onChange={handleChange}
            variant='standard'
            margin='dense'
            fullWidth
            value={inputValue?.customerName}
            required
          />
          <span
            style={{
              color: 'red',
              top: '5px',
              fontSize: '12px',
            }}
          >
            {errors['customerName']}
          </span>
          <TextField
            label='Phone Number'
            type={'tel'}
            name='phone'
            onChange={handleChange}
            variant='standard'
            margin='dense'
            fullWidth
            value={inputValue?.phone}
            required
          />
          <span
            style={{
              color: 'red',
              top: '5px',
              fontSize: '12px',
            }}
          >
            {errors['phone']}
          </span>
          <TextField
            label='Postal Code'
            inputProps={{inputMode: 'numeric', pattern: '[0-9]*'}}
            name='pincode'
            onChange={handleChange}
            variant='standard'
            margin='dense'
            fullWidth
            value={inputValue?.pincode}
            required
          />
          <span
            style={{
              color: 'red',
              top: '5px',
              fontSize: '12px',
            }}
          >
            {errors['pincode']}
          </span>
          <TextField
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
            value={inputValue?.stateId}
            required
            SelectProps={{
              MenuProps: {
                style: {height: '300px'},
              },
            }}
          >
            {states.map((option) => (
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
          </span>
          <TextField
            label='City Name'
            type={'text'}
            onChange={(e) => handleChange(e)}
            name='cityId'
            fullWidth
            variant='standard'
            margin='dense'
            select
            value={inputValue?.cityId}
            required
            SelectProps={{
              MenuProps: {
                style: {height: '300px'},
              },
            }}
          >
            {cities.map((option) => (
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
          </span>
          <TextField
            label='Address'
            type={'text'}
            name='address'
            onChange={handleChange}
            variant='standard'
            margin='dense'
            fullWidth
            value={inputValue?.address}
            required
          />
          <span
            style={{
              color: 'red',
              top: '5px',
              fontSize: '12px',
            }}
          >
            {errors['address']}
          </span>
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
          <TextField
            label='Job Skills'
            helperText='Select max upto 5 skills'
            name='jobSkills'
            fullWidth
            variant='standard'
            margin='dense'
            select
            required
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
            {categories?.map((option) => (
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
          <Image
            className='image'
            src={
              inputValue?.profileImage
                ? process.env.REACT_APP_SERVER_URL + inputValue?.profileImage
                : previewImage
                ? previewImage
                : userImage
            }
          />
          <TextField
            InputLabelProps={{shrink: true}}
            label='profileImage'
            name='profileImage'
            type={'file'}
            onChange={(e) => setProfileImage(e.target.files[0])}
            variant='standard'
            margin='dense'
            fullWidth
            required
            helperText='Please upload images of format jpg, jpeg, png'
          />
          <span
            style={{
              color: 'red',
              top: '5px',
              fontSize: '12px',
            }}
          >
            {errors['profileImage']}
          </span>
          <TextField
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
          </span>
          <TextField
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
          </span>
          <TextField
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
          </span>
          <TextField
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
            {states.map((option) => (
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
          </span>
          <TextField
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
            {cities.map((option) => (
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
          </span>
          <TextField
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
          </span>
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
          <TextField
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
            {categories?.map((option) => (
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
          </span>
        </DialogContent>
        <Button className='button' size='lg' variant='success' onClick={handleAdd}>
          Save
        </Button>
      </Dialog>
    </>
  )
}

export {Vendors}
