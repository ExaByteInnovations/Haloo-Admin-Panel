/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import {KTSVG, toAbsoluteUrl} from '../../../helpers'

type Props = {
  className: string
}

const TablesWidget12: React.FC<Props> = ({className}) => {
  return (
    <div className={`card ${className}`}>
      {/* begin::Header */}
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bolder fs-3 mb-1'>Vendors Ratings</span>
          <span className='text-muted mt-1 fw-bold fs-7'>Over 500 new members</span>
        </h3>
      </div>
      {/* end::Header */}
      {/* begin::Body */}
      <div className='card-body py-3'>
        {/* begin::Table container */}
        <div className='table-responsive'>
          {/* begin::Table */}
          <table className='table align-middle gs-0 gy-4'>
            {/* begin::Table head */}
            <thead>
              <tr className='fw-bolder text-muted bg-light'>
                <th className='ps-4 min-w-300px rounded-start'>Agent</th>
                <th className='min-w-125px'>Earnings</th>
                <th className='min-w-125px'>Comission</th>
                <th className='min-w-200px'>Company</th>
                <th className='min-w-150px'>Rating</th>
                <th className='min-w-200px text-end rounded-end'></th>
              </tr>
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}
            <tbody>
              {[0, 1, 2, 3].map((item, index) => {
                return (
                  <tr>
                    <td>
                      <div className='d-flex align-items-center'>
                        <div className='symbol symbol-50px me-5'>
                          <span className='symbol-label bg-light'>
                            <img
                              src={toAbsoluteUrl('/media/svg/avatars/001-boy.svg')}
                              className='h-75 align-self-end'
                              alt=''
                            />
                          </span>
                        </div>
                        <div className='d-flex justify-content-start flex-column'>
                          <a href='#' className='text-dark fw-bolder text-hover-primary mb-1 fs-6'>
                            Brad Simmons
                          </a>
                          <span className='text-muted fw-bold text-muted d-block fs-7'>
                            HTML, JS, ReactJS
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <a
                        href='#'
                        className='text-dark fw-bolder text-hover-primary d-block mb-1 fs-6'
                      >
                        $8,000,000
                      </a>
                      <span className='text-muted fw-bold text-muted d-block fs-7'>Pending</span>
                    </td>
                    <td>
                      <a
                        href='#'
                        className='text-dark fw-bolder text-hover-primary d-block mb-1 fs-6'
                      >
                        $5,400
                      </a>
                      <span className='text-muted fw-bold text-muted d-block fs-7'>Paid</span>
                    </td>
                    <td>
                      <a
                        href='#'
                        className='text-dark fw-bolder text-hover-primary d-block mb-1 fs-6'
                      >
                        Intertico
                      </a>
                      <span className='text-muted fw-bold text-muted d-block fs-7'>
                        Web, UI/UX Design
                      </span>
                    </td>
                    <td>
                      <div className='rating'>
                        <div className='rating-label me-2 checked'>
                          <i className='bi bi-star-fill fs-5'></i>
                        </div>
                        <div className='rating-label me-2 checked'>
                          <i className='bi bi-star-fill fs-5'></i>
                        </div>
                        <div className='rating-label me-2 checked'>
                          <i className='bi bi-star-fill fs-5'></i>
                        </div>
                        <div className='rating-label me-2 checked'>
                          <i className='bi bi-star-fill fs-5'></i>
                        </div>
                        <div className='rating-label me-2 checked'>
                          <i className='bi bi-star-fill fs-5'></i>
                        </div>
                      </div>
                      <span className='text-muted fw-bold text-muted d-block fs-7 mt-1'>
                        Best Rated
                      </span>
                    </td>
                    <td className='text-end'>
                      <a
                        href='#'
                        className='btn btn-bg-light btn-color-muted btn-active-color-primary btn-sm px-4 me-2'
                      >
                        View
                      </a>
                      <a
                        href='#'
                        className='btn btn-bg-light btn-color-muted btn-active-color-primary btn-sm px-4'
                      >
                        Edit
                      </a>
                    </td>
                  </tr>
                )
              })}
            </tbody>
            {/* end::Table body */}
          </table>
          {/* end::Table */}
        </div>
        {/* end::Table container */}
      </div>
      {/* begin::Body */}
    </div>
  )
}

export {TablesWidget12}
