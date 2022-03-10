/* eslint-disable jsx-a11y/anchor-is-valid */
import {useEffect, useMemo, useState} from 'react'
import {useIntl} from 'react-intl'
import {Edit, Delete} from '@mui/icons-material'
import {PageTitle} from '../../../_metronic/layout/core'
import DataTable from 'react-data-table-component'
import {ApiGet, ApiDelete} from '../../../helpers/API/ApiData'
import {toast} from 'react-toastify'
import ClearIcon from '@mui/icons-material/Clear'
import {Button} from 'react-bootstrap'
import {Modal} from 'react-bootstrap'
import {Box, CircularProgress, TextField} from '@material-ui/core'
import '../../App.css'

const ContactUs = () => {
  const intl = useIntl()
  const [contactUs, setContactUs] = useState([])
  const [loading, setLoading] = useState(false)
  const [show, setShow] = useState(false)
  const [rowId, setRowId] = useState('')
  //   const [filterText, setFilterText] = useState('')
  //   const [resetPaginationToggle, setResetPaginationToggle] = useState(false)

  const handleClose = () => {
    setShow(false)
  }

  useEffect(() => {
    getContactUs()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const getContactUs = async () => {
    setLoading(true)
    try {
      const response = await ApiGet(`serviceinfo/state`)
      if (response.status === 200) {
        setContactUs(response.data.data)
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

  //   const filteredItems = data.filter(
  //     (item) =>
  //       (item.stateName && item.stateName.toLowerCase().includes(filterText.toLowerCase())) ||
  //       (item.status && item.status.toLowerCase().includes(filterText.toLowerCase()))
  //   )

  //   const subHeaderComponentMemo = useMemo(() => {
  //     const handleClear = () => {
  //       if (filterText) {
  //         setResetPaginationToggle(!resetPaginationToggle)
  //         setFilterText('')
  //       }
  //     }
  //     return (
  //       <Box
  //         sx={{
  //           display: 'flex',
  //           position: 'relative',
  //           lineHeight: '1.5',
  //           justifyContent: 'flex-end',
  //           alignItems: 'center',
  //         }}
  //       >
  //         <TextField
  //           className='input-search'
  //           placeholder='Search'
  //           variant='outlined'
  //           margin='dense'
  //           onChange={(e) => setFilterText(e.target.value)}
  //           value={filterText}
  //         />
  //         <ClearIcon className='input-clear-button' onClick={handleClear} />
  //       </Box>
  //     )
  //   }, [filterText, resetPaginationToggle])

  if (loading) {
    return (
      <Box className='loader'>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.REPORTS.CONTACT_US'})}</PageTitle>
      <Box className='add-button-wrapper'>
        <Button className='add-button' variant='success' onClick={() => console.log('Demo')}>
          Export CSV
        </Button>
      </Box>
      <DataTable
        columns={columns}
        data={data}
        fixedHeader
        fixedHeaderScrollHeight='58vh'
        pagination
        // paginationResetDefaultPage={resetPaginationToggle}
        // subHeader
        // subHeaderComponent={subHeaderComponentMemo}
        // persistTableHead
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
export {ContactUs}
