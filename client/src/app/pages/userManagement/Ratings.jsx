/* eslint-disable jsx-a11y/anchor-is-valid */
import {useEffect, useMemo, useState} from 'react'
import {useIntl} from 'react-intl'
import moment from 'moment'
import {Edit, Delete} from '@mui/icons-material'
import {PageTitle} from '../../../_metronic/layout/core'
import DataTable from 'react-data-table-component'
import {ApiGet, ApiDelete, ApiPut} from '../../../helpers/API/ApiData'
import {toast} from 'react-toastify'
import Dialog from '@material-ui/core/Dialog'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import {Button} from 'react-bootstrap'
import {Modal} from 'react-bootstrap'
import {Box, CircularProgress, DialogContent, MenuItem, TextField} from '@material-ui/core'
import '../../App.css'
import {KTSVG} from '../../../_metronic/helpers'
import ClearIcon from '@mui/icons-material/Clear'

const Ratings = () => {
  const intl = useIntl()
  const [ratings, setRatings] = useState([])
  const [open, setOpen] = useState(false)
  const [rowId, setRowId] = useState('')
  const [inputValue, setInputValue] = useState({})
  const [loading, setLoading] = useState(false)
  const [show, setShow] = useState(false)
  const [filterText, setFilterText] = useState('')
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    setShow(false)
    setInputValue({})
  }

  useEffect(() => {
    getRatings()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const getRatings = async () => {
    try {
      setLoading(true)
      const response = await ApiGet(`review`)
      if (response.status === 200) {
        setRatings(response.data.data)
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
      const response = await ApiDelete(`review?_id=${rowId}`)

      if (response.status === 200) {
        getRatings()
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

  const handleUpdate = async (rowId) => {
    try {
      const response = await ApiPut(`review?_id=${rowId}`, inputValue)

      if (response.status === 200) {
        toast.success('Updated Successfully')
        setInputValue({})
        getRatings()
      }
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleChange = (e) => {
    const {name, value} = e.target
    setInputValue({...inputValue, [name]: value})
  }

  const columns = [
    {
      name: 'Review For',
      selector: (row) => (row.reviewFor ? row.reviewFor : '-'),
      sortable: true,
      // width: '200px',
    },
    {
      name: 'Rating',
      selector: (row) => (row.rating ? row.rating : '-'),
      cell: (row) => (
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
      // width: '150px',
    },
    {
      name: 'Comment',
      selector: (row) => (row.comment ? row.comment : '-'),
      sortable: true,
      // width: '150px',
    },
    {
      name: 'Posted On',
      selector: (row) => (row.postedOn ? row.postedOn : '-'),
      sortable: true,
      // width: '200px',
    },
    // {
    //   name: 'Action',
    //   cell: (row) => {
    //     return (
    //       <>
    //         <Edit
    //           className='icon'
    //           onClick={() => {
    //             handleOpen()
    //             setRowId(row.id)
    //             setInputValue(row)
    //           }}
    //         />
    //         <Delete
    //           className='icon'
    //           color='error'
    //           onClick={() => {
    //             setShow(true)
    //             setRowId(row.id)
    //           }}
    //         />
    //       </>
    //     )
    //   },
    // },
  ]

  const data = ratings?.map((rating) => {
    return {
      id: rating._id,
      rating: rating.rating,
      reviewFor: rating.reviewFor,
      comment: rating.comment,
      postedOn: moment(rating.createdAt).format('DD MMM YY hh:mmA'),
    }
  })

  const filteredItems = data.filter(
    (item) =>
      (item.reviewFor && item.reviewFor.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.comment && item.comment.toLowerCase().includes(filterText.toLowerCase()))
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

  const customStyles = {
    headCells: {
      style: {
        paddingLeft: '8px',
        paddingRight: '8px',
      },
    },
  }

  const click = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }

  const RatingsBreadCrumbs = [
    {
      title: 'User Management',
      path: '/user-management/reviews-and-ratings',
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

  if (loading) {
    return (
      <Box className='loader'>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <>
      <PageTitle breadcrumbs={RatingsBreadCrumbs}>
        {intl.formatMessage({id: 'MENU.USER_MANAGEMENT.RATING'})}
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
            <Button variant='secondary' onClick={handleClose}>
              Cancel
            </Button>
            <Button
              variant='danger'
              onClick={() => {
                handleDelete()
                click()
              }}
            >
              Delete
            </Button>
          </Modal.Footer>
        </>
      </Modal>

      <Dialog open={open} onClose={handleClose}>
        <Toolbar>
          <IconButton edge='start' color='inherit' onClick={handleClose} aria-label='close'>
            <CloseIcon />
          </IconButton>
        </Toolbar>
        <DialogContent>
          <TextField
            label='Rating For'
            type={'text'}
            onChange={(e) => handleChange(e)}
            name='ratingFor'
            fullWidth
            variant='standard'
            margin='dense'
            value={inputValue?.ratingFor}
          />
          <TextField
            label='Rating By'
            type={'text'}
            onChange={(e) => handleChange(e)}
            name='ratingBy'
            fullWidth
            variant='standard'
            margin='dense'
            value={inputValue?.ratingBy}
          />
          <TextField
            label='Who Rated'
            type={'text'}
            onChange={(e) => handleChange(e)}
            name='whoRated'
            fullWidth
            variant='standard'
            margin='dense'
            value={inputValue?.whoRated}
          />
          <TextField
            label='Job Number'
            type={'number'}
            onChange={(e) => handleChange(e)}
            name='jobNumber'
            fullWidth
            variant='standard'
            margin='dense'
            value={inputValue?.jobNumber}
          />
          <TextField
            label='Rating'
            type={'number'}
            onChange={(e) => handleChange(e)}
            name='rating'
            select
            fullWidth
            variant='standard'
            margin='dense'
            value={inputValue?.rating}
            defaultValue={inputValue?.rating}
          >
            {[1, 2, 3, 4, 5].map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label='Comment'
            multiline
            maxRows={3}
            onChange={(e) => handleChange(e)}
            name='comment'
            fullWidth
            variant='standard'
            margin='dense'
            value={inputValue?.comment}
          />
        </DialogContent>
        <Button
          className='button'
          size='lg'
          variant='success'
          onClick={() => {
            handleUpdate(rowId)
            handleClose()
            click()
          }}
        >
          Save
        </Button>
      </Dialog>
    </>
  )
}

export {Ratings}
