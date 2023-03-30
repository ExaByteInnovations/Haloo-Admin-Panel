/* eslint-disable jsx-a11y/anchor-is-valid */
import {useEffect, useState} from 'react'
import {useIntl} from 'react-intl'
import {PageTitle} from '../../../_metronic/layout/core'
import DataTable from 'react-data-table-component'
import {ApiGet} from '../../../helpers/API/ApiData'
import {toast} from 'react-toastify'
import '../../App.css'
import {KTSVG} from '../../../_metronic/helpers/components/KTSVG'
import {Link} from 'react-router-dom'
import {Box, CircularProgress} from '@material-ui/core'

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
              <span className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'>
                <KTSVG path='/media/icons/duotune/art/art005.svg' className='svg-icon-3' />
              </span>
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
        <CircularProgress color='secondary' />
      </Box>
    )
  }

  const customStyles = {
    headCells: {
      style: {
        paddingLeft: '8px',
        paddingRight: '8px',
        color: '#6c757d',
      },
    },
  }

  const StaticPagesBreadCrumbs = [
    {
      title: 'Settings',
      path: '/settings/edit-profile',
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

  return (
    <>
      <PageTitle breadcrumbs={StaticPagesBreadCrumbs}>
        {intl.formatMessage({id: 'MENU.SETTINGS.STATIC_PAGES'})}
      </PageTitle>
      <DataTable
        customStyles={customStyles}
        columns={columns}
        data={data}
        fixedHeader
        fixedHeaderScrollHeight='57vh'
        pagination
        responsive
      />
    </>
  )
}

export {StaticPages}
