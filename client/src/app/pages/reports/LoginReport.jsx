/* eslint-disable jsx-a11y/anchor-is-valid */
import {useEffect, useMemo, useState} from 'react'
import moment from 'moment'
import _ from 'lodash'
import {useIntl} from 'react-intl'
import {Edit, Delete} from '@mui/icons-material'
import DatePicker from 'react-datepicker'
import {CSVLink} from 'react-csv'
import {PageTitle} from '../../../_metronic/layout/core'
import DataTable from 'react-data-table-component'
import {ApiGet, ApiDelete} from '../../../helpers/API/ApiData'
import {toast} from 'react-toastify'
import ClearIcon from '@mui/icons-material/Clear'
import {Button} from 'react-bootstrap'
import {Modal} from 'react-bootstrap'
import {Box, CircularProgress, TextField} from '@material-ui/core'
import '../../App.css'
import 'react-datepicker/dist/react-datepicker.css'

const LoginReport = () => {
  const intl = useIntl()
  const [loginReport, setLoginReport] = useState([])
  const [loading, setLoading] = useState(false)
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
    setLoading(true)
    try {
      const response = await ApiGet(`report/adminreport`)
      if (response.status === 200) {
        setLoginReport(response.data)
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
      item.adminUser.toLowerCase().includes(filterText.toLowerCase()) ||
      item.ipAddress.toLowerCase().includes(filterText.toLowerCase()) ||
      item.adminEmail.toLowerCase().includes(filterText.toLowerCase()) ||
      item.adminRole.toLowerCase().includes(filterText.toLowerCase()) ||
      item.os.toLowerCase().includes(filterText.toLowerCase()) ||
      item.browser.toLowerCase().includes(filterText.toLowerCase()) ||
      item.platform.toLowerCase().includes(filterText.toLowerCase())
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

  const handleClear = () => {
    setResetPaginationToggle(!resetPaginationToggle)
    setReportData([])
    setDateRange([null, null])
  }

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
        {intl.formatMessage({id: 'MENU.REPORTS.LOGIN_REPORT'})}
      </PageTitle>
      <Box className='add-button-wrapper'>
        <Box
          sx={{
            display: 'flex',
            position: 'relative',
            lineHeight: '1.5',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          <DatePicker
            className='date-picker'
            popperClassName='date-picker-popper'
            selectsRange={true}
            placeholderText='Click to select date range'
            startDate={startDate}
            endDate={endDate}
            onChange={(update) => {
              setDateRange(update)
            }}
          />
          <ClearIcon className='input-clear-button' onClick={handleClear} />
        </Box>
        <Button className='add-button' variant='success' disabled={_.isEmpty(loginReport)}>
          <CSVLink className='export-csv' {...csvReport}>
            Export to CSV
          </CSVLink>
        </Button>
      </Box>
      <DataTable
        columns={columns}
        data={!_.isEmpty(reportData) ? reportData : filteredItems}
        fixedHeader
        fixedHeaderScrollHeight='58vh'
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
    </>
  )
}
export {LoginReport}
