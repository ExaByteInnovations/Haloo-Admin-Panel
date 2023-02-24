import {useState} from 'react'
import * as Yup from 'yup'
import clsx from 'clsx'
import {Link, useLocation} from 'react-router-dom'
import {useFormik} from 'formik'
import {ApiPost} from '../../../../helpers/API/ApiData'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'

const initialValues = {
  password: '',
  confirmPassword: '',
}

const ResetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Password is required')
    .oneOf([Yup.ref('password'), null], 'Passwords must match'),
})

export function ResetPassword() {
  const {
    state: {adminId, otp},
  } = useLocation()
  const [loading, setLoading] = useState(false)
  const [hasErrors, setHasErrors] = useState(undefined)
  const [status, setStatus] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const formik = useFormik({
    initialValues,
    validationSchema: ResetPasswordSchema,
    onSubmit: (values, {setSubmitting}) => {
      setLoading(true)
      setHasErrors(undefined)
      setTimeout(() => {
        ApiPost(`auth/admin/setpassword`, {
          password: values.password,
          confirmPassword: values.confirmPassword,
          _id: adminId ? adminId : '',
          otp: otp ? otp : '',
        })
          .then(({status}) => {
            if (status === 200) {
              setStatus(true)
              setHasErrors(false)
            }
            setLoading(false)
          })
          .catch(() => {
            setHasErrors(true)
            setLoading(false)
            setSubmitting(false)
          })
      }, 1000)
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
          <h1 className='text-dark mb-3'>Reset Password</h1>
          {/* end::Title */}
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
              Your password has been reset successfully. You can now login by clicking the below
              login button
            </div>
          </div>
        )}
        {/* end::Title */}

        {/* begin::Form group */}
        <div className='fv-row mb-10'>
          <label className='form-label fw-bolder text-gray-900 fs-6'>Password</label>
          <div className='password-field-wrapper'>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder=''
              autoComplete='off'
              {...formik.getFieldProps('password')}
              className={clsx(
                'form-control form-control-lg form-control-solid'
                //   {'is-invalid': formik.touched.password && formik.errors.password},
                //   {
                //     'is-valid': formik.touched.password && !formik.errors.password,
                //   }
              )}
            />
            <div className='show-password-btn'>
              {showPassword ? (
                <VisibilityIcon onClick={() => setShowPassword(false)} />
              ) : (
                <VisibilityOffIcon onClick={() => setShowPassword(true)} />
              )}
            </div>
          </div>
          {formik.touched.password && formik.errors.password && (
            <div className='fv-plugins-message-container'>
              <div className='fv-help-block'>
                <span role='alert'>{formik.errors.password}</span>
              </div>
            </div>
          )}
        </div>
        {/* end::Form group */}

        {/* begin::Form group */}
        <div className='fv-row mb-10'>
          <label className='form-label fw-bolder text-gray-900 fs-6'>Confirm Password</label>
          <div className='password-field-wrapper'>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder=''
              autoComplete='off'
              {...formik.getFieldProps('confirmPassword')}
              className={clsx(
                'form-control form-control-lg form-control-solid'
                //   {'is-invalid': formik.touched.confirmPassword && formik.errors.confirmPassword},
                //   {
                //     'is-valid': formik.touched.confirmPassword && !formik.errors.confirmPassword,
                //   }
              )}
            />
            <div className='show-password-btn'>
              {showConfirmPassword ? (
                <VisibilityIcon onClick={() => setShowConfirmPassword(false)} />
              ) : (
                <VisibilityOffIcon onClick={() => setShowConfirmPassword(true)} />
              )}
            </div>
          </div>
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <div className='fv-plugins-message-container'>
              <div className='fv-help-block'>
                <span role='alert'>{formik.errors.confirmPassword}</span>
              </div>
            </div>
          )}
        </div>
        {/* end::Form group */}

        {/* begin::Form group */}
        {!status ? (
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
        ) : (
          <div className='d-flex flex-wrap justify-content-center pb-lg-0'>
            <Link to='/auth/login'>
              <button
                type='submit'
                id='kt_password_reset_submit'
                className='btn btn-lg btn-primary fw-bolder me-4'
              >
                <span className='indicator-label'>Login</span>
              </button>
            </Link>
          </div>
        )}

        {/* end::Form group */}
      </form>
    </>
  )
}
