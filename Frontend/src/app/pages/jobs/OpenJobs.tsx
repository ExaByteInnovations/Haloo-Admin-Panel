/* eslint-disable jsx-a11y/anchor-is-valid */
import {FC, useEffect, useState} from 'react'
import moment from 'moment'
import {useIntl} from 'react-intl'
import {PageTitle} from '../../../_metronic/layout/core'
import {Edit, Delete} from '@mui/icons-material'
import {ApiGet, ApiDelete, ApiPut} from '../../../helpers/API/ApiData'
import DataTable from 'react-data-table-component'
import '../../App.css'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import {TextField} from '@mui/material'

const OpenJobs: FC = () => {
  const intl = useIntl()
  const [jobs, setJobs] = useState([])
  const [updateJobs, setUpdatedJobs] = useState(false)
  const [open, setOpen] = useState(false)
  const [rowId, setRowId] = useState('')
  const [inputValue, setInputValue] = useState({})
  const [currentRow, setCurrentRow] = useState({})
  const [rowIndex, setRowIndex] = useState(0)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  }
  console.log(jobs, 'jobs')

  useEffect(() => {
    getJobs()
  }, [updateJobs])

  const getJobs = async () => {
    const response = await ApiGet(`job?jobCategory=open`)
    setJobs(response.data.data)
    setUpdatedJobs(false)
  }

  const handleDelete = async (rowId: string) => {
    try {
      await ApiDelete(`job?_id=${rowId}`)
      setUpdatedJobs(true)
    } catch (err) {
      console.log(err)
    }
  }

  const handleEdit = async (rowId: string) => {
    try {
      await ApiPut(`job?_id=${rowId}`, {...currentRow, ...inputValue})
      setUpdatedJobs(true)
      setInputValue({})
    } catch (err) {
      console.log(err)
    }
  }

  const handleChange = (e: any) => {
    const {name, value} = e.target
    setInputValue({...inputValue, [name]: value})
  }

  const columns = [
    {
      name: 'Job',
      selector: (row: any) => row.job,
      sortable: true,
      width: '200px',
    },
    {
      name: 'Quote',
      selector: (row: any) => row.quote,
      sortable: true,
    },
    {
      name: 'City',
      selector: (row: any) => row.city,
      sortable: true,
    },
    // {
    //   name: 'Job Total',
    //   selector: (row: any) => row.jobTotal,
    //   sortable: true,
    //   width: '150px',
    //   right: true,
    // },
    {
      name: 'Customer',
      selector: (row: any) => row.customer,
      sortable: true,
      width: '150px',
    },
    {
      name: 'Property Name',
      selector: (row: any) => row.propertyName,
      sortable: true,
      width: '150px',
    },
    {
      name: 'Category/Subcategory',
      selector: (row: any) => row.categorySubcategory,
      sortable: true,
      width: '200px',
    },
    // {
    //   name: 'Vendor',
    //   selector: (row: any) => row.vendor,
    //   sortable: true,
    //   width: '150px',
    // },
    {
      name: 'Posted Date',
      selector: (row: any) => row.postedDate,
      sortable: true,
      width: '200px',
    },
    {
      name: 'Status',
      selector: (row: any) => row.status,
      sortable: true,
    },
    {
      name: 'Action',
      cell: (row: any, index: number) => {
        return (
          <>
            <Edit
              className='icon'
              onClick={() => {
                handleOpen()
                setRowId(row.id)
                setRowIndex(index)
                setCurrentRow(row)
              }}
            />
            <Delete className='icon' color='error' onClick={() => handleDelete(row.id)} />
          </>
        )
      },
      sortable: true,
    },
  ]

  // const data = [
  //   {
  //     job: 'Plumbing',
  //     quote: '-',
  //     city: 'Surat',
  //     jobTotal: 34,
  //     customer: 'John',
  //     propertyName: 'Astra Complex',
  //     categorySubcategory: 'Housing Service',
  //     vendor: 'Spencer Plumbers',
  //     postedDate: new Date().getUTCDate(),
  //     status: 'Pending',
  //     Action: 'No',
  //   },
  //   {
  //     job: 'Electricity Work',
  //     quote: '-',
  //     city: 'Surat',
  //     jobTotal: 20,
  //     customer: 'Soimon',
  //     propertyName: 'Citadel Complex',
  //     categorySubcategory: 'Housing Service',
  //     vendor: 'Rock Electricity',
  //     postedDate: new Date().getUTCDate(),
  //     status: 'done',
  //     Action: 'No',
  //   },
  //   {
  //     job: 'Car Washing',
  //     quote: '-',
  //     city: 'Surat',
  //     jobTotal: 15,
  //     customer: 'Rony',
  //     propertyName: 'Astra Complex',
  //     categorySubcategory: 'Housing Service',
  //     vendor: 'Spencer Car Washers',
  //     postedDate: new Date().getUTCDate(),
  //     status: 'Pending',
  //     Action: 'No',
  //   },
  // ]
  const data = jobs?.map((job: any) => {
    return {
      id: job._id,
      job: job.jobTitle,
      quote: job.quote,
      city: job.city,
      // jobTotal: job.jobTotal,
      customer: job.customer,
      propertyName: job.propertyName,
      categorySubcategory: job.category || job.subCategory,
      // vendor: job.vendor,
      postedDate: moment(job.createdAt).format('DD MMM YY hh:mmA'),
      status: job.status,
    }
  })

  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.JOBS.OPEN_JOBS'})}</PageTitle>
      <DataTable
        columns={columns}
        data={data}
        // selectableRows
        // selectableRowsVisibleOnly
        // dense
        fixedHeader
        fixedHeaderScrollHeight='300px'
        pagination
        highlightOnHover
        responsive
        striped
      />
      {open && (
        <>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby='modal-modal-title'
            aria-describedby='modal-modal-description'
          >
            <Box sx={style}>
              <Box className='model'>
                <TextField
                  variant='standard'
                  onChange={(e: any) => handleChange(e)}
                  // value={currentRow?.ratingBy}
                  name='job'
                  label='Job'
                />
              </Box>
              <Box className='model'>
                <TextField
                  variant='standard'
                  onChange={(e: any) => handleChange(e)}
                  // value={currentRow?.ratingFor}
                  name='quote'
                  label='quote'
                />
              </Box>
              <Box className='model'>
                <TextField
                  variant='standard'
                  onChange={(e: any) => handleChange(e)}
                  // value={currentRow?.whoRated}
                  name='city'
                  label='city'
                />
              </Box>
              {/* <Box className='model'>
                <TextField
                  variant='standard'
                  onChange={(e: any) => handleChange(e)}
                  // value={currentRow?.jobNumber}
                  name='jobTotal'
                  label='Job Total'
                />
              </Box> */}
              <Box className='model'>
                <TextField
                  variant='standard'
                  onChange={(e: any) => handleChange(e)}
                  // value={currentRow?.rating}
                  name='customer'
                  label='customer'
                />
              </Box>
              <Box className='model'>
                <TextField
                  variant='standard'
                  onChange={(e: any) => handleChange(e)}
                  // value={currentRow?.comment}
                  name='propertyName'
                  label='Property Name'
                />
              </Box>
              <Box className='model'>
                <TextField
                  variant='standard'
                  onChange={(e: any) => handleChange(e)}
                  // value={currentRow?.postedOn}
                  name='categorySubcategory'
                  label='Category / Subcategory'
                />
              </Box>
              <Box className='model'>
                <TextField
                  variant='standard'
                  onChange={(e: any) => handleChange(e)}
                  // value={currentRow?.postedOn}
                  name='postedDate'
                  label='Posted Date'
                />
              </Box>
              <Box className='model'>
                <TextField
                  variant='standard'
                  onChange={(e: any) => handleChange(e)}
                  // value={currentRow?.postedOn}
                  name='status'
                  label='status'
                />
              </Box>
              <Button
                className='button'
                variant='outlined'
                onClick={() => {
                  handleEdit(rowId)
                  handleClose()
                }}
              >
                Send
              </Button>
            </Box>
          </Modal>
        </>
      )}
    </>
  )
}

export {OpenJobs}
