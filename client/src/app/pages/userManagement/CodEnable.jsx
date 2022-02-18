/* eslint-disable jsx-a11y/anchor-is-valid */
import {useEffect, useState} from 'react'
import {useIntl} from 'react-intl'
import {PageTitle} from '../../../_metronic/layout/core'
import DataTable from 'react-data-table-component'
import {ApiGet, ApiPut} from '../../../helpers/API/ApiData'
import {toast} from 'react-toastify'
import {Button} from 'react-bootstrap'
import {Modal} from 'react-bootstrap'
import {Box, CircularProgress} from '@material-ui/core'
import '../../App.css'

const CodEnable = () => {
  const intl = useIntl()
  const [cod, setCod] = useState([])
  const [loading, setLoading] = useState(false)
  const [show, setShow] = useState(false)
  const [rowId, setRowId] = useState('')
  const [codStatus, setCodStatus] = useState('')
  const handleClose = () => {
    setShow(false)
  }

  useEffect(() => {
    getCod()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const getCod = async () => {
    setLoading(true)
    try {
      const response = await ApiGet(`usermanagement/codrequest`)
      if (response.status === 200) {
        setCod(response.data.data)
      }
      setLoading(false)
    } catch (err) {
      toast.error(err.message)
      setLoading(false)
    }
  }

  const handleUpdate = async () => {
    try {
      const response = await ApiPut(`usermanagement/codrequest?_id=${rowId}`, {
        status: codStatus,
      })
      if (response.status === 200) {
        toast.success('Updated Successfully')
        getCod()
      }
      setLoading(false)
      setShow(false)
    } catch (err) {
      toast.error(err.message)
      setLoading(false)
      setShow(false)
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
        <Button
          className='status-btn'
          variant={row.status.toLowerCase() === 'disabled' ? 'warning' : 'success'}
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

  const data = cod?.map((item) => {
    return {
      id: item?._id,
      userName: item?.customerDetails[0]?.customerName || 'Mayank',
      status: item?.status?.charAt(0)?.toUpperCase() + item?.status?.substr(1)?.toLowerCase(),
    }
  })

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
        {intl.formatMessage({id: 'MENU.USER_MANAGEMENT.COD_ENABLE_REQUESTS'})}
      </PageTitle>
      <DataTable
        columns={columns}
        data={data}
        fixedHeader
        fixedHeaderScrollHeight='61vh'
        pagination
        highlightOnHover
        responsive
        striped
      />
      <Modal show={show} onHide={handleClose}>
        <>
          <Modal.Header closeButton>
            <Modal.Title className='text-danger'>Alert!</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to change the COD Request Status.</Modal.Body>
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
export {CodEnable}
