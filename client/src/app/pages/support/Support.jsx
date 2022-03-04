/* eslint-disable jsx-a11y/anchor-is-valid */
import {useEffect, useMemo, useState} from 'react'
import {useIntl} from 'react-intl'
import moment from 'moment'
import {PageTitle} from '../../../_metronic/layout/core'
import DataTable from 'react-data-table-component'
import {ApiGet, ApiPut} from '../../../helpers/API/ApiData'
import {toast} from 'react-toastify'
import {Button} from 'react-bootstrap'
import {Modal} from 'react-bootstrap'
import {Box, CircularProgress, TextField} from '@material-ui/core'
import ClearIcon from '@mui/icons-material/Clear'
import '../../App.css'

const Support = () => {
  const intl = useIntl()
  const [support, setSupport] = useState([])
  const [loading, setLoading] = useState(false)
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
    setLoading(true)
    try {
      const response = await ApiGet(`support/support`)
      if (response.status === 200) {
        setSupport(response.data.data)
      }
      setLoading(false)
    } catch (err) {
      toast.error(err.message)
      setLoading(false)
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
      selector: (row) => row.phoneNumber,
      sortable: true,
    },
    // {
    //   name: 'Email Address',
    //   selector: (row) => row.emailAddress,
    //   sortable: true,
    // },
    {
      name: 'Query',
      selector: (row) => row.query,
      sortable: true,
    },
    {
      name: 'Posted Date',
      selector: (row) => row.postedDate,
      sortable: true,
    },
    {
      name: 'Status',
      selector: (row) => row.status,
      cell: (row) => (
        <Button
          className='status-btn'
          variant={row.status.toLowerCase() === 'pending' ? 'warning' : 'success'}
          size='sm'
          onClick={() => {
            setShow(true)
            setRowId(row.id)
            handleChange(row.status)
          }}
        >
          {row.status}
        </Button>
      ),
      sortable: true,
    },
  ]

  const data = support?.map((sup) => {
    return {
      id: sup?._id,
      customerName: sup?.customerDetails[0]?.customerName,
      query: sup?.query,
      phoneNumber: sup?.customerDetails[0]?.phone,
      // emailAddress: sup?.customerDetails[0]?.emailAddress,
      postedDate: moment(sup?.createdAt).format('DD MMM YY hh:mmA'),
      status: sup?.status?.charAt(0)?.toUpperCase() + sup?.status?.substr(1)?.toLowerCase(),
    }
  })

  const filteredItems = data.filter(
    (item) =>
      (item?.phoneNumber && item?.phoneNumber.toLowerCase().includes(filterText.toLowerCase())) ||
      (item?.customerName && item?.customerName.toLowerCase().includes(filterText.toLowerCase())) ||
      (item?.emailAddress && item?.emailAddress.toLowerCase().includes(filterText.toLowerCase())) ||
      (item?.query && item?.query.toLowerCase().includes(filterText.toLowerCase())) ||
      (item?.status && item?.status.toLowerCase().includes(filterText.toLowerCase()))
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

  if (loading) {
    return (
      <Box className='loader'>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.SUPPORT'})}</PageTitle>
      <DataTable
        columns={columns}
        data={filteredItems}
        fixedHeader
        fixedHeaderScrollHeight='61vh'
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
          <Modal.Body>Are you sure you want to change the status of this query</Modal.Body>
          <Modal.Footer>
            <Button variant='secondary' onClick={handleClose}>
              Cancel
            </Button>
            <Button variant='danger' onClick={handleUpdate}>
              Update
            </Button>
          </Modal.Footer>
        </>
      </Modal>
    </>
  )
}
export {Support}
