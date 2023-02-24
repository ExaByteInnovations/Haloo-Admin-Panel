/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { PageTitle } from '../../../_metronic/layout/core'
import { ApiGet, ApiPut } from '../../../helpers/API/ApiData'
import { toast } from 'react-toastify'
import { Modal } from 'react-bootstrap'
import '../../App.css'
import { Box, CircularProgress } from '@material-ui/core'

const Sms = () => {
    const intl = useIntl()
    const [inputValue, setInputValue] = useState({})
    const [initialValues, setInitialValues] = useState({})
    const [loading, setLoading] = useState(false)
    const [loader, setLoader] = useState(false)
    const [show, setShow] = useState(false)

    const handleClose = () => {
        setShow(false)
        setInputValue(initialValues)
    }

    useEffect(() => {
        getSms()
    }, [])

    const getSms = async () => {
        try {
            setLoader(true)
            const response = await ApiGet(`setting/sms`)
            if (response.status === 200) {
                setInputValue(...response.data.data)
                setInitialValues(...response.data.data)
            }
            setLoader(false)
        } catch (err) {
            toast.error(err.message)
            setLoader(false)
        }
    }

    const handleUpdate = async () => {
        try {
            const response = await ApiPut(`setting/sms?_id=${inputValue?._id}`, inputValue)

            if (response.status === 200) {
                toast.success('Updated Successfully')
                getSms()
                handleClose()
            }
        } catch (err) {
            toast.error(err.message)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setInputValue({ ...inputValue, [name]: value })
    }

    if (loader) {
        return (
            <Box className='loader'>
                <CircularProgress color='secondary' />
            </Box>
        )
    }

    const SmsBreadCrumbs = [
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

    const click = () => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }

    return (
        <>
            <PageTitle breadcrumbs={SmsBreadCrumbs}>
                {intl.formatMessage({ id: 'MENU.SETTINGS.SMS' })}
            </PageTitle>
            <Modal show={show} onHide={handleClose}>
                <>
                    <Modal.Header closeButton>
                        <Modal.Title className='text-danger'>Alert!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Are you sure you want to Update the Sms Settings</Modal.Body>
                    <Modal.Footer>
                        <button className='btn btn-white btn-active-light-danger me-2' onClick={handleClose}>
                            Discard
                        </button>
                        <button
                            className='btn btn-danger'
                            onClick={() => {
                                handleUpdate()
                                click()
                            }}
                        >
                            {!loading && 'Update'}
                            {loading && (
                                <span className='indicator-progress' style={{ display: 'block' }}>
                                    Please wait...{' '}
                                    <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                                </span>
                            )}
                        </button>
                    </Modal.Footer>
                </>
            </Modal>
            <div className='card mb-5 mb-xl-10'>
                <div className='card-body border-top p-9'>
                    <div className='row mb-6'>
                        <label className='col-lg-4 col-form-label fw-bold fs-6'>
                            Twilio Account SID
                        </label>

                        <div className='col-lg-8 fv-row'>
                            <input
                                type='text'
                                name='twilioAccountSID'
                                className='form-control form-control-lg form-control-solid'
                                placeholder='Enter Twilio Account SID'
                                onChange={(e) => handleChange(e)}
                                value={inputValue?.twilioAccountSID || ''}
                            />
                        </div>
                    </div>

                    <div className='row mb-6'>
                        <label className='col-lg-4 col-form-label fw-bold fs-6'>Auth Token</label>

                        <div className='col-lg-8 fv-row'>
                            <input
                                type='text'
                                name='authToken'
                                className='form-control form-control-lg form-control-solid'
                                placeholder='Enter Auth Token'
                                onChange={(e) => handleChange(e)}
                                value={inputValue?.authToken || ''}
                            />
                        </div>
                    </div>

                    <div className='row mb-6'>
                        <label className='col-lg-4 col-form-label fw-bold fs-6'>
                            From Number
                        </label>

                        <div className='col-lg-8 fv-row'>
                            <input
                                type='text'
                                name='fromNumber'
                                className='form-control form-control-lg form-control-solid'
                                placeholder='Enter From Number'
                                onChange={(e) => handleChange(e)}
                                value={inputValue?.fromNumber || ''}
                            />
                        </div>
                    </div>
                </div>
                <div className='card-footer d-flex justify-content-end py-6 px-9'>
                    <button
                        type='submit'
                        className='btn btn-primary'
                        disabled={loading}
                        onClick={() => setShow(true)}
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </>
    )
}

export { Sms }
