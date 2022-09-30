/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {FC} from 'react'

const MegaMenu: FC = () => (
  <div className='row' data-kt-menu-dismiss='true'>
    <div className='col-lg-4 border-left-lg-1'>
      <div className='menu-inline menu-column menu-active-bg'>
        <div className='menu-item'>
          <a href='/user-management/customers' className='menu-link'>
            <span className='menu-bullet'>
              <span className='bullet bullet-dot'></span>
            </span>
            <span className='menu-title'>Customers</span>
          </a>
        </div>
        <div className='menu-item'>
          <a href='/user-management/vendors' className='menu-link'>
            <span className='menu-bullet'>
              <span className='bullet bullet-dot'></span>
            </span>
            <span className='menu-title'>Vendors</span>
          </a>
        </div>
        <div className='menu-item'>
          <a href='/user-management/cod-enable-requests' className='menu-link'>
            <span className='menu-bullet'>
              <span className='bullet bullet-dot'></span>
            </span>
            <span className='menu-title'>COD Enable Requests</span>
          </a>
        </div>
        <div className='menu-item'>
          <a href='/jobs/inprogress-jobs' className='menu-link'>
            <span className='menu-bullet'>
              <span className='bullet bullet-dot'></span>
            </span>
            <span className='menu-title'>Inprogress Jobs</span>
          </a>
        </div>
        <div className='menu-item'>
          <a href='/jobs/completed-jobs' className='menu-link'>
            <span className='menu-bullet'>
              <span className='bullet bullet-dot'></span>
            </span>
            <span className='menu-title'>Completed Jobs</span>
          </a>
        </div>
        <div className='menu-item'>
          <a href='/jobs/cancelled-jobs' className='menu-link'>
            <span className='menu-bullet'>
              <span className='bullet bullet-dot'></span>
            </span>
            <span className='menu-title'>Cancelled Jobs</span>
          </a>
        </div>
        <div className='menu-item'>
          <a href='/service-info/category' className='menu-link'>
            <span className='menu-bullet'>
              <span className='bullet bullet-dot'></span>
            </span>
            <span className='menu-title'>Category</span>
          </a>
        </div>
      </div>
    </div>
    <div className='col-lg-4 border-left-lg-1'>
      <div className='menu-inline menu-column menu-active-bg'>
        <div className='menu-item'>
          <a href='/service-info/subcategory' className='menu-link'>
            <span className='menu-bullet'>
              <span className='bullet bullet-dot'></span>
            </span>
            <span className='menu-title'>Sub Category</span>
          </a>
        </div>
        <div className='menu-item'>
          <a href='/service-info/state' className='menu-link'>
            <span className='menu-bullet'>
              <span className='bullet bullet-dot'></span>
            </span>
            <span className='menu-title'>State</span>
          </a>
        </div>
        <div className='menu-item'>
          <a href='/service-info/city' className='menu-link'>
            <span className='menu-bullet'>
              <span className='bullet bullet-dot'></span>
            </span>
            <span className='menu-title'>City</span>
          </a>
        </div>
        <div className='menu-item'>
          <a href='/support' className='menu-link'>
            <span className='menu-bullet'>
              <span className='bullet bullet-dot'></span>
            </span>
            <span className='menu-title'>Support</span>
          </a>
        </div>
        <div className='menu-item'>
          <a href='/settings/master-settings' className='menu-link'>
            <span className='menu-bullet'>
              <span className='bullet bullet-dot'></span>
            </span>
            <span className='menu-title'>Master Settings</span>
          </a>
        </div>
        <div className='menu-item'>
          <a href='/settings/edit-profile' className='menu-link'>
            <span className='menu-bullet'>
              <span className='bullet bullet-dot'></span>
            </span>
            <span className='menu-title'>Edit Profile</span>
          </a>
        </div>
        <div className='menu-item'>
          <a href='/settings/change-password' className='menu-link'>
            <span className='menu-bullet'>
              <span className='bullet bullet-dot'></span>
            </span>
            <span className='menu-title'>Change Password</span>
          </a>
        </div>
      </div>
    </div>
    <div className='col-lg-4 border-left-lg-1'>
      <div className='menu-inline menu-column menu-active-bg'>
        <div className='menu-item'>
          <a href='/settings/social-media' className='menu-link'>
            <span className='menu-bullet'>
              <span className='bullet bullet-dot'></span>
            </span>
            <span className='menu-title'>Social Media Management</span>
          </a>
        </div>
        <div className='menu-item'>
          <a href='/settings/email' className='menu-link'>
            <span className='menu-bullet'>
              <span className='bullet bullet-dot'></span>
            </span>
            <span className='menu-title'>Email Configuration</span>
          </a>
        </div>
        <div className='menu-item'>
          <a href='/settings/static-pages' className='menu-link'>
            <span className='menu-bullet'>
              <span className='bullet bullet-dot'></span>
            </span>
            <span className='menu-title'>Static Pages</span>
          </a>
        </div>
        <div className='menu-item'>
          <a href='/reports/login-report' className='menu-link'>
            <span className='menu-bullet'>
              <span className='bullet bullet-dot'></span>
            </span>
            <span className='menu-title'>Login Report</span>
          </a>
        </div>
        <div className='menu-item'>
          <a href='/reports/contact-us' className='menu-link'>
            <span className='menu-bullet'>
              <span className='bullet bullet-dot'></span>
            </span>
            <span className='menu-title'>Contact Us Report</span>
          </a>
        </div>
        <div className='menu-item'>
          <a href='/offers-and-banners' className='menu-link'>
            <span className='menu-bullet'>
              <span className='bullet bullet-dot'></span>
            </span>
            <span className='menu-title'>Offers And Banners</span>
          </a>
        </div>
      </div>
    </div>
  </div>
)

export {MegaMenu}
