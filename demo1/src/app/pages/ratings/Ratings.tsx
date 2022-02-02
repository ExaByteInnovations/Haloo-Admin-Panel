/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {FC} from 'react'
import {useIntl} from 'react-intl'
import {Edit, Delete} from '@mui/icons-material'
import {PageTitle} from '../../../_metronic/layout/core'
import {TablesWidget12} from '../../../_metronic/partials/widgets'
import DataTable from 'react-data-table-component'

const columns = [
  {
    name: 'Rating By',
    selector: (row: any) => row.ratingBy,
    sortable: true,
    width: '150px',
  },
  {
    name: 'Rating For',
    selector: (row: any) => row.ratingFor,
    sortable: true,
    width: '150px',
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
    right: true,
  },
  {
    name: 'Rating',
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
    width: '150px',
  },
  {
    name: 'Action',
    cell: (row: any) => {
      return (
        <>
          <Edit className='icon' onClick={() => console.log('Edit')} />
          <Delete className='icon' color='error' onClick={() => console.log('Delete')} />
        </>
      )
    },
    sortable: true,
  },
]

const data = [
  {
    ratingBy: 'Ivy Labs',
    ratingFor: 'IOS Developer',
    whoRated: 'Provider',
    jobNumber: '32121',
    rating: 3,
    comment: 'test',
    postedOn: new Date().getUTCDate(),
  },
]

const RatingsPage: FC = () => (
  <>
    {/* <TablesWidget12 className='row gy-5 g-xl-8' /> */}
    <DataTable
      columns={columns}
      data={data}
      selectableRows
      selectableRowsVisibleOnly
      // dense
      fixedHeader
      fixedHeaderScrollHeight='300px'
      pagination
      highlightOnHover
      responsive
      striped
    />
  </>
)

const Ratings: FC = () => {
  const intl = useIntl()
  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.RATING'})}</PageTitle>
      <RatingsPage />
    </>
  )
}

export {Ratings}
