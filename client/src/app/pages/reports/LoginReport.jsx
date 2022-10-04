/* eslint-disable jsx-a11y/anchor-is-valid */
import {useEffect, useMemo, useState} from 'react'
import moment from 'moment'
import _ from 'lodash'
import {useIntl} from 'react-intl'
import DatePicker from 'react-datepicker'
import {CSVLink} from 'react-csv'
import {PageTitle} from '../../../_metronic/layout/core'
import DataTable from 'react-data-table-component'
import {ApiGet, ApiDelete} from '../../../helpers/API/ApiData'
import {toast} from 'react-toastify'
import ClearIcon from '@mui/icons-material/Clear'
import {Modal} from 'react-bootstrap'
import {Box, CircularProgress} from '@material-ui/core'
import {KTSVG} from '../../../_metronic/helpers/components/KTSVG'
import '../../App.css'
import 'react-datepicker/dist/react-datepicker.css'

const LoginReport = () => {
  const intl = useIntl()
  const [loginReport, setLoginReport] = useState([])
  const [loading, setLoading] = useState(false)
  const [loader, setLoader] = useState(false)
  const [show, setShow] = useState(false)
  const [rowId, setRowId] = useState('')
  const [filterText, setFilterText] = useState('')
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false)
  const [dateRange, setDateRange] = useState([null, null])
  const [startDate, endDate] = dateRange
  const [reportData, setReportData] = useState([])

  const handleClose = () => {
    setShow(false)
  }

  useEffect(() => {
    getLoginReport()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const getLoginReport = async () => {
    setLoader(true)
    try {
      const response = await ApiGet(`report/adminreport`)
      if (response.status === 200) {
        setLoginReport(response.data)
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
      const response = await ApiDelete(`serviceinfo/state?_id=${rowId}`)
      if (response.status === 200) {
        getLoginReport()
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

  const columns = [
    {
      name: 'Admin User',
      selector: (row) => row.adminUser,
      sortable: true,
      width: '200px',
    },
    {
      name: 'Admin Role',
      selector: (row) => row.adminRole,
      sortable: true,
      width: '200px',
    },
    {
      name: 'Admin Email',
      selector: (row) => row.adminEmail,
      sortable: true,
      width: '200px',
    },
    {
      name: 'IP Address',
      selector: (row) => row.ipAddress,
      sortable: true,
      width: '200px',
    },
    {
      name: 'OS',
      selector: (row) => row.os,
      sortable: true,
      width: '200px',
    },
    {
      name: 'Browser',
      selector: (row) => row.browser,
      sortable: true,
      width: '200px',
    },
    {
      name: 'Platform',
      selector: (row) => row.platform,
      sortable: true,
      width: '200px',
    },
    {
      name: 'Login Date',
      selector: (row) => row.loginDate,
      sortable: true,
      width: '200px',
    },
    // {
    //   name: 'Logout Date',
    //   selector: (row) => moment(row.logoutDate).format('MMMM Do YYYY'),
    //   sortable: true,
    // },
    {
      name: 'Action',
      cell: (row) => {
        return (
          <>
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

  const data = loginReport?.map((report) => {
    return {
      id: report?._id,
      adminUser: report?.adminUser,
      adminRole: report?.adminRole,
      adminEmail: report?.adminEmail,
      ipAddress: report?.ipAddress,
      os: report?.os,
      browser: report?.browser,
      platform: report?.platform,
      loginDate: moment(report?.adminLoginTime).format('DD MMM YY hh:mmA'),

      // logoutDate: report?.logoutDate,
    }
  })

  const filteredItems = data?.filter(
    (item) =>
      item?.adminUser?.toLowerCase()?.includes(filterText?.toLowerCase()) ||
      item?.ipAddress?.toLowerCase()?.includes(filterText?.toLowerCase()) ||
      item?.adminEmail?.toLowerCase()?.includes(filterText?.toLowerCase()) ||
      item?.adminRole?.toLowerCase()?.includes(filterText?.toLowerCase()) ||
      item?.os?.toLowerCase()?.includes(filterText?.toLowerCase()) ||
      item?.browser?.toLowerCase()?.includes(filterText?.toLowerCase()) ||
      item?.platform?.toLowerCase()?.includes(filterText?.toLowerCase())
  )

  useMemo(() => {
    if (startDate !== null && endDate !== null) {
      const loginData = data.filter((obj) => {
        return (
          moment(obj.loginDate.slice(0, 9)).valueOf() >= moment(startDate).valueOf() &&
          moment(obj.loginDate.slice(0, 9)).valueOf() <= moment(endDate).add(1, 'days').valueOf()
        )
      })
      setReportData(loginData)
    }
  }, [startDate, endDate])

  const headers = [
    {label: 'Admin User', key: 'adminUser'},
    {label: 'Admin Role', key: 'adminRole'},
    {label: 'Admin Email', key: 'adminEmail'},
    {label: 'IP Address', key: 'ipAddress'},
    {label: 'OS', key: 'os'},
    {label: 'Browser', key: 'browser'},
    {label: 'Platform', key: 'platform'},
    {label: 'Login Date', key: 'loginDate'},
  ]

  const csvReport = {
    data: !_.isEmpty(reportData) ? reportData : filteredItems,
    headers: headers,
    filename: 'Login_Report.csv',
  }

  const subHeaderComponentMemo = useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle)
        setFilterText('')
      }
    }

    const handleClearDateRangePicker = () => {
      setResetPaginationToggle(!resetPaginationToggle)
      setReportData([])
      setDateRange([null, null])
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
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <Box className='date-picker-wrapper'>
            <DatePicker
              className='form-control form-control-lg form-control-solid mb-3 mb-lg-0 px-3 date-picker'
              popperClassName='date-picker-popper'
              selectsRange={true}
              placeholderText='Select date range'
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => {
                setDateRange(update)
              }}
            />
            <ClearIcon className='input-clear-button' onClick={handleClearDateRangePicker} />
          </Box>
          <button className='btn btn-md btn-light-primary'>
            <KTSVG path='/media/icons/duotune/arrows/arr078.svg' className='svg-icon-2' />
            <CSVLink className='export-csv' {...csvReport}>
              Export to CSV
            </CSVLink>
          </button>
        </Box>
      </Box>
    )
  }, [filterText, resetPaginationToggle, startDate, endDate, csvReport])

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

  const LoginReportBreadCrumbs = [
    {
      title: 'Reports',
      path: '/reports/login-report',
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
      <PageTitle breadcrumbs={LoginReportBreadCrumbs}>
        {intl.formatMessage({id: 'MENU.REPORTS.LOGIN_REPORT'})}
      </PageTitle>
      <DataTable
        customStyles={customStyles}
        columns={columns}
        data={!_.isEmpty(reportData) ? reportData : filteredItems}
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
    </>
  )
}
export {LoginReport}
