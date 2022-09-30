/* eslint-disable jsx-a11y/anchor-is-valid */
import {useEffect, useMemo, useState} from 'react'
import {useIntl} from 'react-intl'
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
import {Loader} from '../../components/Loader'

const ContactUs = () => {
  const intl = useIntl()
  const [contactUs, setContactUs] = useState([])
  const [loading, setLoading] = useState(false)
  const [loader, setLoader] = useState(false)
  const [show, setShow] = useState(false)
  const [rowId, setRowId] = useState('')
  const [filterText, setFilterText] = useState('')
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false)

  const handleClose = () => {
    setShow(false)
  }

  useEffect(() => {
    getContactUs()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const getContactUs = async () => {
    setLoader(true)
    try {
      const response = await ApiGet(`serviceinfo/state`)
      if (response.status === 200) {
        setContactUs(response.data.data)
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
        getContactUs()
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
      name: 'Name',
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: 'Phone Number',
      selector: (row) => row.phone,
      sortable: true,
    },
    {
      name: 'Comment',
      selector: (row) => row.comment,
      sortable: true,
    },
    {
      name: 'Topic',
      selector: (row) => row.topic,
      sortable: true,
    },
    {
      name: 'Date',
      selector: (row) => row.date,
      sortable: true,
    },
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

  //   const data = contactUs?.map((detail) => {
  //     return {
  //       id: detail?._id,
  //       name: detail?.name,
  //       phone: detail?.phone,
  //       comment: detail?.comment,
  //       topic: detail?.topic,
  //       date: detail?.date,
  //     }
  //   })

  const data = [
    {
      id: '8949594343',
      name: 'Raj Sharma',
      phone: '5564568768',
      comment: 'Enquiry about the product',
      topic: 'Product Enquiry',
      date: '2020-05-05',
    },
  ]

  const filteredItems = data.filter(
    (item) =>
      item.name.toLowerCase().includes(filterText.toLowerCase()) ||
      item.phone.toLowerCase().includes(filterText.toLowerCase()) ||
      item.comment.toLowerCase().includes(filterText.toLowerCase()) ||
      item.topic.toLowerCase().includes(filterText.toLowerCase()) ||
      item.date.toLowerCase().includes(filterText.toLowerCase())
  )

  const headers = [
    {label: 'Name', key: 'name'},
    {label: 'Phone Number', key: 'phone'},
    {label: 'Comment', key: 'comment'},
    {label: 'Topic', key: 'topic'},
    {label: 'Date', key: 'date'},
  ]

  const csvReport = {
    data: filteredItems,
    headers: headers,
    filename: 'Contact_Us_Report.csv',
  }

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

        <button className='btn btn-md btn-light-primary'>
          <KTSVG path='/media/icons/duotune/arrows/arr078.svg' className='svg-icon-2' />
          <CSVLink className='export-csv' {...csvReport}>
            Export to CSV
          </CSVLink>
        </button>
      </Box>
    )
  }, [filterText, resetPaginationToggle, csvReport])

  // if (Loader) {
  //   return (
  //     <Box className='loader'>
  //       <CircularProgress color='secondary' />
  //     </Box>
  //   )
  // }

  const customStyles = {
    headCells: {
      style: {
        paddingLeft: '8px',
        paddingRight: '8px',
      },
    },
  }

  const ContactUsReportBreadCrumbs = [
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
      <PageTitle breadcrumbs={ContactUsReportBreadCrumbs}>
        {intl.formatMessage({id: 'MENU.REPORTS.CONTACT_US'})}
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
    </>
  )
}
export {ContactUs}
