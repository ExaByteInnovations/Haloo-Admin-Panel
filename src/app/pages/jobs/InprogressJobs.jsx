/* eslint-disable jsx-a11y/anchor-is-valid */
import {useEffect, useMemo, useState} from 'react'
import {useIntl} from 'react-intl'
import moment from 'moment'
import {PageTitle} from '../../../_metronic/layout/core'
import DataTable from 'react-data-table-component'
import {
  ApiGet,
  ApiDelete,
  //  ApiPut
} from '../../../helpers/API/ApiData'
import {toast} from 'react-toastify'
import ClearIcon from '@mui/icons-material/Clear'
// import Dialog from '@material-ui/core/Dialog'
// import IconButton from '@material-ui/core/IconButton'
// import CloseIcon from '@material-ui/icons/Close'
import {Modal} from 'react-bootstrap'
import {KTSVG} from '../../../_metronic/helpers/components/KTSVG'
import {
  Box,
  CircularProgress,
  // DialogContent,
  // DialogTitle,
  // MenuItem,
} from '@material-ui/core'
import '../../App.css'

const InprogressJobs = () => {
  const intl = useIntl()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const [loader, setLoader] = useState(false)
  // const [open, setOpen] = useState(false)
  const [show, setShow] = useState(false)
  const [rowId, setRowId] = useState('')
  const [filterText, setFilterText] = useState('')
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false)
  // const [inputValue, setInputValue] = useState({})
  // const handleOpen = () => setOpen(true)
  const handleClose = () => {
    // setOpen(false)
    setShow(false)
  }

  useEffect(() => {
    getJobs()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const getJobs = async () => {
    setLoader(true)
    try {
      const response = await ApiGet(`job?status=inprogress`)
      if (response.status === 200) {
        setJobs(response.data.data)
      }
      setLoader(false)
    } catch (err) {
      toast.error(err.message)
      setLoader(false)
    }
  }

  const handleDelete = async () => {
    setLoading(true)
    try {
      const response = await ApiDelete(`job?_id=${rowId}`)
      if (response.status === 200) {
        getJobs()
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

  // const handleUpdate = async (rowId) => {
  //   try {
  //     setLoading(true)
  //     const response = await ApiPut(`job?_id=${rowId}`, inputValue)
  //     if (response.status === 200) {
  //       toast.success('Updated Successfully')
  //       setInputValue({})
  //       getJobs()
  //     }
  //     setLoading(false)
  //   } catch (err) {
  //     toast.error(err.message)
  //     setLoading(false)
  //   }
  // }

  // const handleChange = (e) => {
  //   const {name, value} = e.target
  //   setInputValue({...inputValue, [name]: value})
  // }

  const columns = [
    {
      name: 'Job',
      selector: (row) => (row.jobTitle ? row.jobTitle : '-'),
      sortable: true,
      width: '200px',
    },
    // {
    //   name: 'Quote',
    //   selector: (row) => row.quote,
    //   sortable: true,
    //   width: '150px',
    // },
    {
      name: 'City',
      selector: (row) => (row.city ? row.city : '-'),
      sortable: true,
      width: '150px',
    },
    {
      name: 'Job Total',
      selector: (row) => (row.jobTotal ? row.jobTotal : '-'),
      sortable: true,
      width: '150px',
    },
    {
      name: 'Customer',
      selector: (row) =>
        row.customer &&
        row.customer.toLowerCase() !== 'undefined undefined' &&
        row.customer.toLowerCase() !== 'undefined'
          ? row.customer
          : '- -',
      sortable: true,
      width: '150px',
    },
    // {
    //   name: 'Property Name',
    //   selector: (row) => row.propertyName,
    //   sortable: true,
    //   width: '150px',
    // },
    // {
    //   name: 'Category/Subcategory',
    //   selector: (row) => row.categorySubcategory,
    //   sortable: true,
    //   width: '200px',
    // },
    {
      name: 'Vendor',
      selector: (row) =>
        row.vendor &&
        row.vendor.toLowerCase() !== 'undefined undefined' &&
        row.vendor.toLowerCase() !== 'undefined'
          ? row.vendor
          : '- -',
      sortable: true,
      width: '150px',
    },
    {
      name: 'Posted Date',
      selector: (row) => (row.postedDate ? row.postedDate : '-'),
      sortable: true,
      width: '200px',
    },
    {
      name: 'Status',
      selector: (row) => row.status,
      cell: (row) => {
        return (
          <span
            className={`badge badge-light-${
              (row.status.toLowerCase() === 'completed' && 'success') ||
              (row.status.toLowerCase() === 'inprogress' && 'warning') ||
              (row.status.toLowerCase() === 'cancelled' && 'danger')
            }`}
          >
            {row.status}
          </span>
        )
      },
      sortable: true,
      width: '150px',
    },
    {
      name: 'Action',
      cell: (row) => {
        return (
          <>
            {/* <span
              className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
              onClick={() => {
                handleOpen()
                setRowId(row.id)
                setInputValue(row)
              }}
            >
              <KTSVG path='/media/icons/duotune/art/art005.svg' className='svg-icon-3' />
            </span> */}
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

  const data = jobs?.map((job) => {
    return {
      id: job?._id,
      jobTitle: job?.jobTitle,
      // quote: job?.quote,
      city: job?.city,
      jobTotal: job?.jobTotal,
      customer: `${job?.customerDetails[0]?.firstName} ${job?.customerDetails[0]?.lastName}`,
      // propertyName: job?.propertyName,
      // categorySubcategory: job?.category || job?.subCategory,
      vendor: `${job?.vendorDetails[0]?.firstName} ${job?.vendorDetails[0]?.lastName}`,
      postedDate: moment(job?.createdAt).format('DD MMM YY hh:mmA'),
      status: job?.status?.toLowerCase(),
    }
  })

  const filteredItems = data?.filter(
    (item) =>
      (item?.jobTitle && item?.jobTitle?.toLowerCase()?.includes(filterText?.toLowerCase())) ||
      (item?.jobTotal?.toString() &&
        item?.jobTotal?.toString()?.toLowerCase()?.includes(filterText?.toLowerCase())) ||
      (item?.city && item?.city?.toLowerCase()?.includes(filterText?.toLowerCase())) ||
      (item?.customer && item?.customer?.toLowerCase()?.includes(filterText?.toLowerCase())) ||
      (item?.vendor && item?.vendor?.toLowerCase()?.includes(filterText?.toLowerCase()))
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
      </Box>
    )
  }, [filterText, resetPaginationToggle])

  // const status = [
  //   {label: 'pending', value: 'pending'},
  //   {label: 'completed', value: 'completed'},
  //   {label: 'disputed', value: 'disputed'},
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

  const InprogressBreadCrumbs = [
    {
      title: 'Jobs',
      path: '/jobs/inprogress-jobs',
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

  const click = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }

  return (
    <>
      <PageTitle breadcrumbs={InprogressBreadCrumbs}>
        {intl.formatMessage({id: 'MENU.JOBS.INPROGRESS_JOBS'})}
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

      {/* <Dialog open={open} onClose={handleClose} fullWidth maxWidth='xs'>
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
            label='Job'
            type={'text'}
            onChange={(e) => handleChange(e)}
            name='jobTitle'
            fullWidth
            variant='standard'
            margin='dense'
            value={inputValue?.jobTitle}
          />
          <TextField
            label='Quote'
            type={'text'}
            onChange={(e) => handleChange(e)}
            name='quote'
            fullWidth
            variant='standard'
            margin='dense'
            value={inputValue?.quote}
          />
          <TextField
            label='City'
            type={'text'}
            onChange={(e) => handleChange(e)}
            name='city'
            fullWidth
            variant='standard'
            margin='dense'
            value={inputValue?.city}
          />
          <TextField
            label='Job Total'
            inputProps={{inputMode: 'numeric', pattern: '[0-9]*'}}
            onChange={(e) => handleChange(e)}
            name='jobTotal'
            fullWidth
            variant='standard'
            margin='dense'
            value={inputValue?.jobTotal}
          />
          <TextField
            label='Customer'
            type={'text'}
            onChange={(e) => handleChange(e)}
            name='customer'
            fullWidth
            variant='standard'
            margin='dense'
            value={inputValue?.customer}
          />
          <TextField
            label='Property Name'
            type={'text'}
            onChange={(e) => handleChange(e)}
            name='propertyName'
            fullWidth
            variant='standard'
            margin='dense'
            value={inputValue?.propertyName}
          />
          <TextField
            label='Category / Subcategory'
            type={'text'}
            onChange={(e) => handleChange(e)}
            name='categorySubcategory'
            fullWidth
            variant='standard'
            margin='dense'
            value={inputValue?.categorySubcategory}
          />
          <TextField
            label='Vendor'
            type={'text'}
            onChange={(e) => handleChange(e)}
            name='vendor'
            fullWidth
            variant='standard'
            margin='dense'
            value={inputValue?.vendor}
          />
          <TextField
            label='Status'
            type={'text'}
            onChange={(e) => handleChange(e)}
            name='status'
            fullWidth
            variant='standard'
            margin='dense'
            select
            value={inputValue?.status?.toLowerCase()}
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
          size='lg'
          variant='success'
          onClick={() => {
            handleUpdate(rowId)
            handleClose()
          }}
        >
          Save
        </Button>
      </Dialog> */}
    </>
  )
}
export {InprogressJobs}
