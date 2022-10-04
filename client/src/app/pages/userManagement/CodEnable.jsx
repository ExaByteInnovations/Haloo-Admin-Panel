/* eslint-disable jsx-a11y/anchor-is-valid */
import {useEffect, useMemo, useState} from 'react'
import {useIntl} from 'react-intl'
import {PageTitle} from '../../../_metronic/layout/core'
import DataTable from 'react-data-table-component'
import {ApiGet, ApiPut} from '../../../helpers/API/ApiData'
import {toast} from 'react-toastify'
import {Modal} from 'react-bootstrap'
import {Box, CircularProgress} from '@material-ui/core'
import ClearIcon from '@mui/icons-material/Clear'
import {KTSVG} from '../../../_metronic/helpers/components/KTSVG'
import '../../App.css'

const CodEnable = () => {
  const intl = useIntl()
  const [cod, setCod] = useState([])
  const [loading, setLoading] = useState(false)
  const [Loader, setLoader] = useState(false)
  const [show, setShow] = useState(false)
  const [rowId, setRowId] = useState('')
  const [codStatus, setCodStatus] = useState('')
  const [filterText, setFilterText] = useState('')
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false)
  const handleClose = () => {
    setShow(false)
  }

  useEffect(() => {
    getCod()
  }, [])

  const getCod = async () => {
    setLoader(true)
    try {
      const response = await ApiGet(`codrequest`)
      if (response.status === 200) {
        setCod(response.data.data)
      }
      setLoader(false)
    } catch (err) {
      toast.error(err.message)
      setLoader(false)
    }
  }

  const handleUpdate = async () => {
    setLoading(true)
    try {
      const response = await ApiPut(`codrequest?_id=${rowId}`, {
        status: codStatus,
      })
      if (response.status === 200) {
        toast.success('Updated Successfully')
        getCod()
      }
      setShow(false)
      setLoading(false)
    } catch (err) {
      toast.error(err.message)
      setShow(false)
      setLoading(false)
    }
  }

  const handleChange = (status) => {
    status?.toLowerCase() === 'disabled' ? setCodStatus('enabled') : setCodStatus('disabled')
  }

  const columns = [
    {
      name: 'User Name',
      selector: (row) => row.userName,
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
            row.status.toLowerCase() === 'disabled' ? 'warning' : 'success'
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

  const data = cod?.map((item) => {
    return {
      id: item?._id,
      userName: `${item?.customerDetails[0]?.firstName} ${item?.customerDetails[0]?.lastName}`,
      status: item?.status?.charAt(0)?.toUpperCase() + item?.status?.substr(1)?.toLowerCase(),
    }
  })

  const filteredItems = data.filter(
    (item) =>
      (item.userName && item.userName.toLowerCase().includes(filterText.toLowerCase())) ||
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
      },
    },
  }

  const CODBreadCrumbs = [
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

  const click = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }

  return (
    <>
      <PageTitle breadcrumbs={CODBreadCrumbs}>
        {intl.formatMessage({id: 'MENU.USER_MANAGEMENT.COD_ENABLE_REQUESTS'})}
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
          <Modal.Body>Are you sure you want to change the COD Request Status.</Modal.Body>
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
export {CodEnable}
