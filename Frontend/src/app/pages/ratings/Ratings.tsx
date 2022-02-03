/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {FC, useEffect, useState} from 'react'
import {useIntl} from 'react-intl'
import moment from 'moment'
import {Edit, Delete} from '@mui/icons-material'
import {PageTitle} from '../../../_metronic/layout/core'
import DataTable from 'react-data-table-component'
import {ApiGet, ApiDelete, ApiPut} from '../../../helpers/API/ApiData'
import '../../App.css'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import {TextField} from '@mui/material'
import {toast} from 'react-toastify'
import Dialog from '@material-ui/core/Dialog'
import List from '@material-ui/core/List'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import Slide from '@material-ui/core/Slide'

const Ratings: FC = () => {
  const intl = useIntl()
  const [ratings, setRatings] = useState([])
  const [open, setOpen] = React.useState(false)
  const [rowId, setRowId] = useState('')
  const [inputValue, setInputValue] = useState({})
  const [currentRow, setCurrentRow] = useState({})
  const [rowIndex, setRowIndex] = useState(0)
  const [loading, setLoading] = useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction='up' ref={ref} {...props} />
  })

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

  useEffect(() => {
    getRatings()
  }, [])

  const getRatings = async () => {
    setLoading(true)
    await ApiGet(`review`)
      .then((res) => {
        if (res.status === 200) {
          setRatings(res.data.data)
          setLoading(false)
        } else {
          setLoading(false)
        }
      })
      .catch((err) => {
        console.log(err)
        toast.error(err.message)
        setLoading(false)
      })
  }

  const handleDelete = async (rowId: string) => {
    setLoading(true)
    await ApiDelete(`review?_id=${rowId}`)
      .then((res) => {
        if (res.status === 200) {
          toast.success(res.data.message)
          getRatings()
          setLoading(false)
          toast.success('Deleted Successfully')
        } else {
          toast.error(res.data.message)
          setLoading(false)
        }
      })
      .catch((err) => {
        toast.error(err.message)
        setLoading(false)
      })
  }

  const handleUpdate = async (rowId: string) => {
    setLoading(true)
    await ApiPut(`review?_id=${rowId}`, {...currentRow, ...inputValue})
      .then((res) => {
        if (res?.status === 200) {
          setInputValue({})
          getRatings()
          setLoading(false)
        } else {
          setLoading(false)
        }
      })
      .catch((err) => {
        toast.error(err.message)
        setLoading(false)
      })
  }

  const handleChange = (e: any) => {
    const {name, value} = e.target
    setInputValue({...inputValue, [name]: value})
  }

  const columns = [
    {
      name: 'Rating By',
      selector: (row: any) => row.ratingBy,
      sortable: true,
      width: '200px',
    },
    {
      name: 'Rating For',
      selector: (row: any) => row.ratingFor,
      sortable: true,
      width: '200px',
    },
    {
      name: 'Who Rated',
      selector: (row: any) => row.whoRated,
      sortable: true,
      width: '150px',
    },
    {
      name: 'Job Number',
      selector: (row: any) => row.jobNumber,
      sortable: true,
      width: '150px',
    },
    {
      name: 'Rating',
      selector: (row: any) => row.rating,
      cell: (row: any) => (
        <>
          {[...Array(row.rating)].map(() => (
            <div className='rating'>
              <div className='rating-label me-2 checked'>
                <i className='bi bi-star-fill fs-5'></i>
              </div>
            </div>
          ))}
        </>
      ),
      sortable: true,
      width: '150px',
    },
    {
      name: 'Comment',
      selector: (row: any) => row.comment,
      sortable: true,
      width: '150px',
    },
    {
      name: 'Posted On',
      selector: (row: any) => row.postedOn,
      sortable: true,
      width: '200px',
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

  const data = ratings?.map((rating: any) => {
    return {
      id: rating._id,
      ratingBy: rating.ratingBy,
      ratingFor: rating.ratingFor,
      whoRated: rating.whoRated,
      jobNumber: rating.jobNumber,
      rating: rating.rating,
      comment: rating.comment,
      postedOn: moment(rating.createdAt).format('DD MMM YY hh:mmA'),
    }
  })

  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.RATING'})}</PageTitle>
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

      {open ? (
        <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
          <Toolbar>
            <IconButton edge='start' color='inherit' onClick={handleClose} aria-label='close'>
              <CloseIcon />
            </IconButton>
          </Toolbar>
          <List>
            {open === true ? (
              <div className='form ml-30 '>
                {/* Ameninties Name */}
                <div className='form-group row'>
                  <label className='col-xl-3 col-lg-3 col-form-label'>Enter Title</label>
                  <div className='col-lg-9 col-xl-6'>
                    <div>
                      <input
                        type='text'
                        className={`form-control form-control-lg form-control-solid `}
                        id='title'
                        name='title'
                        // value={inputValue.title}
                        onChange={(e) => {
                          // handleOnChnage(e);
                        }}
                      />
                    </div>
                    <span
                      style={{
                        color: 'red',
                        top: '5px',
                        fontSize: '12px',
                      }}
                    >
                      {/* {errors["title"]} */}
                    </span>
                  </div>
                </div>

                <div className='d-flex align-items-center justify-content-center'>
                  <button
                    onClick={(e) => {
                      handleUpdate(e)
                    }}
                    className='btn btn-success mr-2'
                  >
                    <span>Update Details</span>
                    {loading && <span className='mx-3 spinner spinner-white'></span>}
                  </button>
                </div>
              </div>
            ) : null}
          </List>
        </Dialog>
      ) : null}
    </>
  )
}

export {Ratings}
