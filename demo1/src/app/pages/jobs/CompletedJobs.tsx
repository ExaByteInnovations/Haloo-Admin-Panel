/* eslint-disable jsx-a11y/anchor-is-valid */
import {FC} from 'react'
import {useIntl} from 'react-intl'
import {PageTitle} from '../../../_metronic/layout/core'
import {Edit, Delete} from '@mui/icons-material'
import DataTable from 'react-data-table-component'
import './jobs.css'

const columns = [
  {
    name: 'Job',
    selector: (row: any) => row.job,
    sortable: true,
    width: '150px',
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
  {
    name: 'Job Total',
    selector: (row: any) => row.jobTotal,
    sortable: true,
    width: '150px',
    right: true,
  },
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
    selector: (row: any) => row.CategorySubcategory,
    sortable: true,
    width: '200px',
  },
  {
    name: 'Vendor',
    selector: (row: any) => row.vendor,
    sortable: true,
    width: '150px',
  },
  {
    name: 'Posted Date',
    selector: (row: any) => row.postedDate,
    sortable: true,
    width: '150px',
  },
  {
    name: 'Status',
    selector: (row: any) => row.status,
    sortable: true,
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
    job: 'Plumbing',
    quote: '-',
    city: 'Surat',
    jobTotal: 34,
    customer: 'John',
    propertyName: 'Astra Complex',
    categorySubcategory: 'Housing Service',
    vendor: 'Spencer Plumbers',
    postedDate: new Date().getUTCDate(),
    status: 'Pending',
    Action: 'No',
  },
  {
    job: 'Electricity Work',
    quote: '-',
    city: 'Surat',
    jobTotal: 20,
    customer: 'Soimon',
    propertyName: 'Citadel Complex',
    categorySubcategory: 'Housing Service',
    vendor: 'Rock Electricity',
    postedDate: new Date().getUTCDate(),
    status: 'done',
    Action: 'No',
  },
  {
    job: 'Car Washing',
    quote: '-',
    city: 'Surat',
    jobTotal: 15,
    customer: 'Rony',
    propertyName: 'Astra Complex',
    categorySubcategory: 'Housing Service',
    vendor: 'Spencer Car Washers',
    postedDate: new Date().getUTCDate(),
    status: 'Pending',
    Action: 'No',
  },
]

const CompletedJobsPage: FC = () => (
  <>
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

const CompletedJobs: FC = () => {
  const intl = useIntl()
  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.JOBS.COMPLETED_JOBS'})}</PageTitle>
      <CompletedJobsPage />
    </>
  )
}

export {CompletedJobs}
