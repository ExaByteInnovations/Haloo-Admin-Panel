/* eslint-disable jsx-a11y/anchor-is-valid */
import {useEffect, useMemo, useState} from 'react'
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

const City = () => {
  const intl = useIntl()
  const [cities, setCities] = useState([])
  const [states, setStates] = useState([])
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

  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    setShow(false)
    setAddOpen(false)
    setErrors({})
    setInputValue({})
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
    getCities()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const getCities = async () => {
    setLoader(true)
    try {
      const response = await ApiGet(`serviceinfo/city`)
      if (response.status === 200) {
        setCities(response.data.data)
      }
      setLoader(false)
    } catch (err) {
      toast.error(err.message)
      setLoader(false)
    }
  }

  const getStates = async () => {
    try {
      const response = await ApiGet(`serviceinfo/state`)
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

  const handleDelete = async () => {
    setLoading(true)
    try {
      const response = await ApiDelete(`serviceinfo/city?_id=${rowId}`)
      if (response.status === 200) {
        getCities()
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
  const validateForm = () => {
    let formIsValid = true
    let errors = {}

    if (inputValue && !inputValue.cityName) {
      formIsValid = false
      errors['cityName'] = '*Please Enter City Name !'
    }
    if (inputValue && !inputValue.stateId) {
      formIsValid = false
      errors['stateId'] = '*Please Enter State Name!'
    }
    if (inputValue && !inputValue.status) {
      formIsValid = false
      errors['status'] = '*Please Select Status!'
    }

    setErrors(errors)
    return formIsValid
  }

  const handleUpdate = async () => {
    if (validateForm()) {
      try {
        const response = await ApiPut(`serviceinfo/city?_id=${rowId}`, {
          ...inputValue,
          status: inputValue.status.toLowerCase(),
        })
        if (response.status === 200) {
          toast.success('Updated Successfully')
          setInputValue({})
          getCities()
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
      try {
        const response = await ApiPost(`serviceinfo/city`, {
          ...inputValue,
          status: inputValue.status.toLowerCase(),
        })
        if (response.status === 200) {
          toast.success('Added Successfully')
          setInputValue({})
          getCities()
          handleClose()
        }
      } catch (err) {
        toast.error(err[0] || err.message)
        setErrors({[err[1]]: err[0]})
      }
    }
  }

  const handleChange = (e) => {
    const {name, value} = e.target
    setInputValue({...inputValue, [name]: value})
    setErrors({...errors, [name]: ''})
  }

  const columns = [
    {
      name: 'City Name',
      selector: (row) => (row.cityName ? row.cityName : '-'),
      sortable: true,
    },
    {
      name: 'State Name',
      selector: (row) => (row.stateName ? row.stateName : '-'),
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
                getStates()
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

  const data = cities?.map((city) => {
    return {
      id: city?._id,
      cityName: city?.cityName,
      stateName: city?.stateDetails[0]?.stateName,
      stateId: city?.stateId,
      status: city?.status?.charAt(0)?.toUpperCase() + city?.status?.substr(1)?.toLowerCase(),
    }
  })

  const filteredItems = data.filter(
    (item) =>
      (item.cityName && item.cityName.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.stateName && item.stateName.toLowerCase().includes(filterText.toLowerCase())) ||
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
            getStates()
          }}
        >
          <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-2' />
          Add City
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

  const CityBreadCrumbs = [
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

  return (
    <>
      <PageTitle breadcrumbs={CityBreadCrumbs}>
        {intl.formatMessage({id: 'MENU.SERVICE_INFO.CITY'})}
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
          <label className='col-lg-4 col-form-label required fw-bold fs-6'>City Name</label>
          <input
            type='text'
            className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
            placeholder='City name'
            onChange={(e) => handleChange(e)}
            name='cityName'
            value={inputValue?.cityName || ''}
            required
          />
          <span className='error-msg'>{errors['cityName']}</span>
          <label className='col-lg-4 col-form-label required fw-bold fs-6'>State Name</label>
          <select
            className='form-select form-select-solid form-select-lg fw-bold'
            onChange={(e) => handleChange(e)}
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
          <span className='error-msg'>{errors['stateId']}</span>
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
          <label className='col-lg-4 col-form-label required fw-bold fs-6'>City Name</label>
          <input
            type='text'
            className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
            placeholder='City name'
            onChange={(e) => handleChange(e)}
            name='cityName'
            value={inputValue?.cityName || ''}
            required
          />
          <span className='error-msg'>{errors['cityName']}</span>
          <label className='col-lg-4 col-form-label required fw-bold fs-6'>State Name</label>
          <select
            className='form-select form-select-solid form-select-lg fw-bold'
            onChange={(e) => handleChange(e)}
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
          <span className='error-msg'>{errors['stateId']}</span>
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
export {City}
