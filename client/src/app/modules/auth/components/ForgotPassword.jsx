import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import clsx from 'clsx'
import {Link, useHistory} from 'react-router-dom'
import {useFormik} from 'formik'
import {ApiPost} from '../../../../helpers/API/ApiData'

const initialValues = {
  email: 'test@gmail.com',
  otp: '',
}

const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Wrong email format')
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Email is required'),
})

const forgotPasswordOtpSchema = Yup.object().shape({
  email: Yup.string()
    .email('Wrong email format')
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Email is required'),
  otp: Yup.string()
    .min(4, 'OTP must be of 4 Digits')
    .max(4, 'OTP must be of 4 Digits')
    .required('OTP is required'),
})

export function ForgotPassword() {
  const history = useHistory()
  const [loading, setLoading] = useState(false)
  const [otpLoading, setOtpLoading] = useState(false)
  const [hasErrors, setHasErrors] = useState(undefined)
  const [otpSent, setOtpSent] = useState(false)
  const [adminId, setAdminId] = useState('')
  const [minutes, setMinutes] = useState(2)
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    if (otpSent) {
      let myInterval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1)
        }
        if (seconds === 0) {
          if (minutes === 0) {
            clearInterval(myInterval)
          } else {
            setMinutes(minutes - 1)
            setSeconds(59)
          }
        }
      }, 1000)
      return () => {
        clearInterval(myInterval)
      }
    }
  }, [otpSent, seconds, minutes])

  const formik = useFormik({
    initialValues,
    validationSchema: otpSent ? forgotPasswordOtpSchema : forgotPasswordSchema,
    onSubmit: (values, {setStatus, setSubmitting}) => {
      if (!otpSent) {
        setLoading(true)
        setHasErrors(undefined)
        setTimeout(() => {
          ApiPost(`auth/admin/forgetpassword`, {email: values.email})
            .then(({data}) => {
              setAdminId(data.data._id)
              setHasErrors(false)
              setOtpSent(true)
              setLoading(false)
            })
            .catch(() => {
              setHasErrors(true)
              setLoading(false)
              setSubmitting(false)
              setStatus('The login detail is incorrect')
            })
        }, 1000)
      } else {
        setOtpLoading(true)
        // setSubmitting(true)
        setTimeout(() => {
          setOtpLoading(false)
          // setSubmitting(false)
          history.push('/auth/reset-password', {adminId: adminId, otp: values.otp})
        }, 1000)
      }
    },
  })

  return (
    <>
      <form
        className='form w-100 fv-plugins-bootstrap5 fv-plugins-framework'
        noValidate
        id='kt_login_password_reset_form'
        onSubmit={formik.handleSubmit}
      >
        <div className='text-center mb-10'>
          {/* begin::Title */}
          <h1 className='text-dark mb-3'>Forgot Password ?</h1>
          {/* end::Title */}

          {/* begin::Link */}
          <div className='text-gray-400 fw-bold fs-4'>Enter your email to reset your password.</div>
          {/* end::Link */}
        </div>

        {/* begin::Title */}
        {hasErrors === true && (
          <div className='mb-lg-15 alert alert-danger'>
            <div className='alert-text font-weight-bold'>
              Sorry, looks like there are some errors detected, please try again.
            </div>
          </div>
        )}

        {hasErrors === false && (
          <div className='mb-10 bg-light-info p-8 rounded'>
            <div className='text-info'>
              An OTP has been sent on your email Id to reset your password. Please check your email
            </div>
          </div>
        )}
        {/* end::Title */}

        {/* begin::Form group */}
        <div className='fv-row mb-10'>
          <label className='form-label fw-bolder text-gray-900 fs-6'>Email</label>
          <input
            type='email'
            placeholder=''
            autoComplete='off'
            {...formik.getFieldProps('email')}
            className={clsx(
              'form-control form-control-lg form-control-solid'
              // {'is-invalid': formik.touched.email && formik.errors.email},
              // {
              //   'is-valid': formik.touched.email && !formik.errors.email,
              // }
            )}
          />
          {formik.touched.email && formik.errors.email && (
            <div className='fv-plugins-message-container'>
              <div className='fv-help-block'>
                <span role='alert'>{formik.errors.email}</span>
              </div>
            </div>
          )}
        </div>
        {/* end::Form group */}

        {/* begin::Form group */}

        {!loading && otpSent && !hasErrors && (
          <div className='fv-row mb-10'>
            <label className='form-label fw-bolder text-gray-900 fs-6'>OTP</label>
            <input
              type='text'
              placeholder=''
              autoComplete='off'
              {...formik.getFieldProps('otp')}
              className={clsx(
                'form-control form-control-lg form-control-solid'
                // {'is-invalid': formik.touched.otp && formik.errors.otp},
                // {
                //   'is-valid': formik.touched.otp && !formik.errors.otp,
                // }
              )}
            />
            {formik.touched.otp && formik.errors.otp && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.otp}</span>
                </div>
              </div>
            )}
          </div>
        )}
        {/* end::Form group */}

        {/* begin::Form group */}
        {!otpSent && (
          <div className='d-flex flex-wrap justify-content-center pb-lg-0'>
            <button
              type='submit'
              id='kt_password_reset_submit'
              className='btn btn-lg btn-primary fw-bolder me-4'
            >
              {loading ? (
                <span className='indicator-label'>
                  Please wait...
                  <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                </span>
              ) : (
                <span className='indicator-label'>Submit</span>
              )}
            </button>
            <Link to='/auth/login'>
              <button
                type='button'
                id='kt_login_password_reset_form_cancel_button'
                className='btn btn-lg btn-light-primary fw-bolder'
                disabled={formik.isSubmitting || !formik.isValid}
              >
                Cancel
              </button>
            </Link>{' '}
          </div>
        )}
        {/* end::Form group */}
        {otpSent && (
          <>
            <div className='d-flex flex-wrap justify-content-center pb-lg-0'>
              <button
                type='submit'
                id='kt_password_reset_submit'
                className='btn btn-lg btn-primary fw-bolder me-4'
              >
                {otpLoading ? (
                  <span className='indicator-label'>
                    Please wait...
                    <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                  </span>
                ) : (
                  <span className='indicator-label'>Submit</span>
                )}
              </button>
              <Link to='/auth/login'>
                <button
                  type='button'
                  id='kt_login_password_reset_form_cancel_button'
                  className='btn btn-lg btn-light-primary fw-bolder'
                  disabled={formik.isSubmitting || !formik.isValid}
                >
                  Cancel
                </button>
              </Link>{' '}
            </div>
            <div className='otp-wrapper'>
              <div className='otp-counter'>
                Resend OTP in
                <span className='otp'>
                  {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </span>
                seconds
              </div>
              <button
                type='submit'
                id='kt_password_reset_submit'
                className='btn btn-lg btn-primary fw-bolder me-4'
                onClick={() => {
                  setOtpSent(false)
                  setHasErrors(undefined)
                  setMinutes(2)
                  setSeconds(0)
                  formik.handleSubmit()
                }}
              >
                Resend
              </button>
            </div>
          </>
        )}
      </form>
    </>
  )
}
