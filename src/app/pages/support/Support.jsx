/* eslint-disable jsx-a11y/anchor-is-valid */
import {useEffect, useMemo, useState} from 'react'
import {useIntl} from 'react-intl'
import moment from 'moment'
import {PageTitle} from '../../../_metronic/layout/core'
import DataTable from 'react-data-table-component'
import {ApiGet, ApiPut} from '../../../helpers/API/ApiData'
import {toast} from 'react-toastify'
import {Modal} from 'react-bootstrap'
import {Box, CircularProgress} from '@material-ui/core'
import ClearIcon from '@mui/icons-material/Clear'
import {KTSVG} from '../../../_metronic/helpers/components/KTSVG'
import '../../App.css'

const Support = () => {
  const intl = useIntl()
  const [support, setSupport] = useState([])
  const [loading, setLoading] = useState(false)
  const [Loader, setLoader] = useState(false)
  const [show, setShow] = useState(false)
  const [rowId, setRowId] = useState('')
  const [queryStatus, setQueryStatus] = useState('')

  const [filterText, setFilterText] = useState('')
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false)

  const handleClose = () => {
    setShow(false)
  }
  useEffect(() => {
    getSupport()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const getSupport = async () => {
    setLoader(true)
    try {
      const response = await ApiGet(`support/support`)
      if (response.status === 200) {
        setSupport(response.data.data)
      }
      setLoader(false)
    } catch (err) {
      toast.error(err.message)
      setLoader(false)
    }
  }

  const handleUpdate = async () => {
    try {
      const response = await ApiPut(`support/support?_id=${rowId}`, {
        status: queryStatus,
      })
      if (response.status === 200) {
        toast.success('Updated Successfully')
        getSupport()
      }
      setShow(false)
    } catch (err) {
      toast.error(err.message)
      setShow(false)
    }
  }

  const handleChange = (status) => {
    status?.toLowerCase() === 'pending' ? setQueryStatus('resolved') : setQueryStatus('pending')
  }

  const columns = [
    {
      name: 'Customer Name',
      selector: (row) => row.customerName,
      sortable: true,
    },
    {
      name: 'Phone Number',
      selector: (row) => (row.phoneNumber ? row.phoneNumber : '-'),
      sortable: true,
    },
    // {
    //   name: 'Email Address',
    //   selector: (row) => row.emailAddress,
    //   sortable: true,
    // },
    {
      name: 'Query',
      selector: (row) => (row.query ? row.query : '-'),
      sortable: true,
    },
    {
      name: 'Posted Date',
      selector: (row) => (row.postedDate ? row.postedDate : '-'),
      sortable: true,
    },
    {
      name: 'Status',
      selector: (row) => row.status,
      cell: (row) => (
        <span
          style={{
            cursor: 'pointer',
          }}
          className={`badge badge-light-${
            row.status.toLowerCase() === 'pending' ? 'warning' : 'success'
          } me-1`}
          onClick={() => {
            setShow(true)
            setRowId(row.id)
            handleChange(row.status)
          }}
        >
          {row.status}
        </span>
      ),
      sortable: true,
    },
  ]

  const data = support?.map((sup) => {
    return {
      id: sup?._id,
      customerName: `${
        sup?.customerDetails[0]?.firstName ? sup?.customerDetails[0]?.firstName : '-'
      } ${sup?.customerDetails[0]?.lastName ? sup?.customerDetails[0]?.lastName : '-'}`,
      query: sup?.query,
      phoneNumber: sup?.customerDetails[0]?.phone,
      // emailAddress: sup?.customerDetails[0]?.emailAddress,
      postedDate: moment(sup?.createdAt).format('DD MMM YY hh:mmA'),
      status: sup?.status?.charAt(0)?.toUpperCase() + sup?.status?.substr(1)?.toLowerCase(),
    }
  })

  const filteredItems = data.filter(
    (item) =>
      (item?.phoneNumber &&
        item?.phoneNumber?.toString()?.toLowerCase()?.includes(filterText?.toLowerCase())) ||
      (item?.customerName &&
        item?.customerName?.toLowerCase()?.includes(filterText?.toLowerCase())) ||
      (item?.emailAddress &&
        item?.emailAddress?.toLowerCase()?.includes(filterText?.toLowerCase())) ||
      (item?.query && item?.query?.toLowerCase()?.includes(filterText?.toLowerCase())) ||
      (item?.status && item?.status?.toLowerCase()?.includes(filterText?.toLowerCase()))
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

  if (Loader) {
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

  const SupportBreadCrumbs = [
    {
      title: 'Support',
      path: '/support',
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
      <PageTitle breadcrumbs={SupportBreadCrumbs}>
        {intl.formatMessage({id: 'MENU.SUPPORT'})}
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
          <Modal.Body>Are you sure you want to change the status of this query</Modal.Body>
          <Modal.Footer>
            <button className='btn btn-white btn-active-light-danger me-2' onClick={handleClose}>
              Discard
            </button>
            <button
              className='btn btn-danger'
              onClick={() => {
                handleUpdate()
                click()
              }}
            >
              {!loading && 'Update'}
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
    </>
  )
}
export {Support}
