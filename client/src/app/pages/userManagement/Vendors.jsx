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
  }

  useEffect(() => {
    getVendors()
  }, [])

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
      setLoading(false)
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

    if (inputValue && !inputValue.customerName) {
      formIsValid = false
      errors['customerName'] = '*Please Enter Vendor Name!'
    }
    if (inputValue && !inputValue.phone) {
      formIsValid = false
      errors['phone'] = '*Please Enter Phone Number!'
    }
    if (inputValue && !inputValue.profileImage && addOpen) {
      formIsValid = false
      errors['profileImage'] = '*Please Select Profile Image!'
    }
    if (inputValue && !inputValue.city) {
      formIsValid = false
      errors['city'] = '*Please Enter City!'
    }
    if (inputValue && !inputValue.state) {
      formIsValid = false
      errors['state'] = '*Please Enter State!'
    }
    if (inputValue && !inputValue.pincode) {
      formIsValid = false
      errors['pincode'] = '*Please Enter Postal Code!'
    }
    if (inputValue && !inputValue.address) {
      formIsValid = false
      errors['address'] = '*Please Enter Address!'
    }
    if (_.isEmpty(skills)) {
      formIsValid = false
      errors['jobSkills'] = '*Please Select Job Skills!'
    }
    setErrors(errors)
    return formIsValid
  }

  const handleUpdate = async () => {
    if (validateForm()) {
      const imageData = new FormData()
      imageData.append('profileImage', inputValue.profileImage || '')
      imageData.append('customerName', inputValue.customerName)
      imageData.append('phone', inputValue.phone)
      imageData.append('city', inputValue.city || '')
      imageData.append('state', inputValue.state || '')
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
      imageData.append('profileImage', inputValue?.profileImage || '')
      imageData.append('customerName', inputValue?.customerName)
      imageData.append('phone', inputValue?.phone)
      imageData.append('city', inputValue?.city || '')
      imageData.append('state', inputValue?.state || '')
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

  const handleSkills = (e) => {
    const {
      target: {value},
    } = e
    setSkills(typeof value === 'string' ? value.split(',') : value)
  }

  const handleSkillDelete = (skill) => {
    console.log(skill, 'skill')
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
          {row.jobSkills.map((skill) => (
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
                getCategories()
                setSkills(row.jobSkills)
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
      city: vendor?.city,
      state: vendor?.state,
      pincode: vendor?.pincode,
      noOfJobs: vendor?.noOfJobs,
      memberSince: moment(vendor?.createdAt).format('DD MMM YY hh:mmA'),
      jobSkills: vendor?.jobSkills,
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
      (item.address && item.address.toLowerCase().includes(filterText.toLowerCase()))
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
            getCategories()
            setSkills([])
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
            InputLabelProps={{shrink: true}}
            label='ProfileImage'
            name='profileImage'
            type={'file'}
            onChange={handleChange}
            variant='standard'
            margin='dense'
            fullWidth
          />
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
            label='City'
            type={'text'}
            name='city'
            onChange={handleChange}
            variant='standard'
            margin='dense'
            fullWidth
            value={inputValue?.city}
            required
          />
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
            label='State'
            type={'text'}
            name='state'
            onChange={handleChange}
            variant='standard'
            margin='dense'
            fullWidth
            value={inputValue?.state}
            required
          />
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
                  {selected.map((value) => (
                    <Chip
                      key={value}
                      label={value}
                      onDelete={() => handleSkillDelete(value)}
                      onMouseDown={(event) => {
                        event.stopPropagation()
                      }}
                    />
                  ))}
                </Box>
              ),
            }}
          >
            {categories?.map((option) => (
              <MenuItem key={option.id} value={option.name}>
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
          <TextField
            InputLabelProps={{shrink: true}}
            label='profileImage'
            name='profileImage'
            type={'file'}
            onChange={(e) => handleChange(e)}
            variant='standard'
            margin='dense'
            fullWidth
            required
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
            label='City'
            type={'text'}
            name='city'
            onChange={(e) => handleChange(e)}
            variant='standard'
            margin='dense'
            fullWidth
            required
          />
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
            label='State'
            type={'text'}
            name='state'
            onChange={(e) => handleChange(e)}
            variant='standard'
            margin='dense'
            fullWidth
            required
          />
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
            label='Address'
            type={'text'}
            name='address'
            onChange={(e) => handleChange(e)}
            variant='standard'
            margin='dense'
            fullWidth
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
            SelectProps={{
              multiple: true,
              value: skills,
              onChange: handleSkills,
              MenuProps: {
                style: {height: '300px'},
              },
              renderValue: (selected) => (
                <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 1}}>
                  {selected.map((value) => (
                    <Chip
                      key={value}
                      label={value}
                      onDelete={() => handleSkillDelete(value)}
                      onMouseDown={(event) => {
                        event.stopPropagation()
                      }}
                    />
                  ))}
                </Box>
              ),
            }}
          >
            {categories?.map((option) => (
              <MenuItem key={option.id} value={option.name}>
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
