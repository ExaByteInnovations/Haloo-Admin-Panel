/* eslint-disable jsx-a11y/anchor-is-valid */
import {useEffect, useState} from 'react'
import {useIntl} from 'react-intl'
import {Edit} from '@mui/icons-material'
import {PageTitle} from '../../../_metronic/layout/core'
import DataTable from 'react-data-table-component'
import {ApiGet} from '../../../helpers/API/ApiData'
import {toast} from 'react-toastify'
import {Box, CircularProgress} from '@material-ui/core'
import '../../App.css'
import {Link} from 'react-router-dom'

const StaticPages = () => {
  const intl = useIntl()
  const [staticPages, setStaticPages] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getStaticPages()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const getStaticPages = async () => {
    try {
      setLoading(true)
      const response = await ApiGet(`staticfile`)
      if (response.status === 200) {
        setStaticPages(response.data.data)
      }
      setLoading(false)
    } catch (err) {
      toast.error(err.message)
      setLoading(false)
    }
  }

  const columns = [
    {
      name: 'Sr No.',
      selector: (row) => row.srNo,
      sortable: true,
    },
    {
      name: 'Page Name',
      selector: (row) => row.pageName,
      sortable: true,
    },
    {
      name: 'Action',
      cell: (row) => {
        return (
          <>
            <Link to={{pathname: '/settings/editor', state: row}}>
              <Edit className='icon' sx={{color: 'black'}} />
            </Link>
          </>
        )
      },
    },
  ]

  const data = staticPages?.map((staticPage) => {
    return {
      id: staticPage?._id,
      srNo: staticPage?.srNO,
      pageName: staticPage?.pageName,
      pageData: staticPage?.action,
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
        {intl.formatMessage({id: 'MENU.SETTINGS.STATIC_PAGES'})}
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
    </>
  )
}

export {StaticPages}
