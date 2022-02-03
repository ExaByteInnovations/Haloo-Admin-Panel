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

const Ratings: FC = () => {
  const intl = useIntl()
  const [ratings, setRatings] = useState([])

  const [updateRatings, setUpdatedRatings] = useState(false)
  const [open, setOpen] = React.useState(false)
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

  useEffect(() => {
    getRatings()
  }, [updateRatings])

  const getRatings = async () => {
    const response = await ApiGet('review')
    setRatings(response.data.data)
    setUpdatedRatings(false)
  }

  const handleDelete = async (rowId: string) => {
    try {
      await ApiDelete(`review?_id=${rowId}`)
      setUpdatedRatings(true)
    } catch (err) {
      console.log(err)
    }
  }

  const handleEdit = async (rowId: string) => {
    try {
      await ApiPut(`review?_id=${rowId}`, {...currentRow, ...inputValue})
      setUpdatedRatings(true)
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
                  name='ratingBy'
                  label='Rating By'
                />
              </Box>
              <Box className='model'>
                <TextField
                  variant='standard'
                  onChange={(e: any) => handleChange(e)}
                  // value={currentRow?.ratingFor}
                  name='ratingFor'
                  label='Rating For'
                />
              </Box>
              <Box className='model'>
                <TextField
                  variant='standard'
                  onChange={(e: any) => handleChange(e)}
                  // value={currentRow?.whoRated}
                  name='whoRated'
                  label='Who Rated'
                />
              </Box>
              <Box className='model'>
                <TextField
                  variant='standard'
                  onChange={(e: any) => handleChange(e)}
                  // value={currentRow?.jobNumber}
                  name='jobNumber'
                  label='Job Number'
                />
              </Box>
              <Box className='model'>
                <TextField
                  variant='standard'
                  onChange={(e: any) => handleChange(e)}
                  // value={currentRow?.rating}
                  name='rating'
                  label='Rating'
                />
              </Box>
              <Box className='model'>
                <TextField
                  variant='standard'
                  onChange={(e: any) => handleChange(e)}
                  // value={currentRow?.comment}
                  name='comment'
                  label='Comment'
                />
              </Box>
              <Box className='model'>
                <TextField
                  variant='standard'
                  onChange={(e: any) => handleChange(e)}
                  // value={currentRow?.postedOn}
                  name='postedOn'
                  label='Posted On'
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

export {Ratings}
