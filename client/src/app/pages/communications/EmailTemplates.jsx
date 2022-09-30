/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { PageTitle } from '../../../_metronic/layout/core'
import DataTable from 'react-data-table-component'
import { ApiGet } from '../../../helpers/API/ApiData'
import { toast } from 'react-toastify'
import '../../App.css'
import { KTSVG } from '../../../_metronic/helpers/components/KTSVG'
import { Link } from 'react-router-dom'
import { Box, CircularProgress } from '@material-ui/core'

const EmailTemplates = () => {
    const intl = useIntl()
    const [emailTemplates, setEmailTemplates] = useState([])
    const [loading, setLoading] = useState(false)
    const [show, setShow] = useState(false)
    const [rowId, setRowId] = useState('')
    const [queryStatus, setQueryStatus] = useState('')

    useEffect(() => {
        getEmailTemplates()
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const getEmailTemplates = async () => {
        try {
            setLoading(true)
            const response = await ApiGet(`staticfile`)
            if (response.status === 200) {
                setEmailTemplates(response.data.data)
            }
            setLoading(false)
        } catch (err) {
            toast.error(err.message)
            setLoading(false)
        }
    }

    const handleChange = (status) => {
        status?.toLowerCase() === 'inactive' ? setQueryStatus('active') : setQueryStatus('inactive')
    }

    const columns = [
        {
            name: 'Email Title',
            selector: (row) => row.title,
            sortable: true,
        },
        {
            name: 'Email Code',
            selector: (row) => row.code,
            sortable: true,
        },
        {
            name: 'Status',
            selector: (row) => row.status,
            cell: (row) => (
                <span
                    style={{
                        cursor: 'pointer',
                    }}
                    className={`badge badge-light-${row.status.toLowerCase() === 'inactive' ? 'warning' : 'success'
                        } me-1`}
                    onClick={() => {
                        setShow(true)
                        setRowId(row.id)
                        handleChange(row.status)
                    }}
                >
                    {row.status}
                </span>
            ),
            sortable: true,
        },
        {
            name: 'Action',
            cell: (row) => {
                return (
                    <>
                        <Link to={{ pathname: '/settings/editor', state: row }}>
                            <span className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'>
                                <KTSVG path='/media/icons/duotune/art/art005.svg' className='svg-icon-3' />
                            </span>
                        </Link>
                    </>
                )
            },
        },
    ]

    // const data = emailTemplates?.map((emailTemplate) => {
    //     return {
    //         id: emailTemplate?._id,
    //         tile: emailTemplate?.title,
    //         code: emailTemplate?.code,
    //         status: emailTemplate?.status,
    //     }
    // })

    const data = [{
        id: '1',
        title: 'Hello World',
        code: 'DFGFGscbzxvb6789m',
        status: 'active',
    }]

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
                {intl.formatMessage({ id: 'MENU.SETTINGS.STATIC_PAGES' })}
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

export { EmailTemplates }
