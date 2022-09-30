import {MenuItem} from './MenuItem'
import {MenuInnerWithSub} from './MenuInnerWithSub'
import {MegaMenu} from './MegaMenu'
import {useIntl} from 'react-intl'

export function MenuInner() {
  const intl = useIntl()
  return (
    <>
      <MenuItem title={intl.formatMessage({id: 'MENU.DASHBOARD'})} to='/dashboard' />
      <MenuInnerWithSub
        title='User Management'
        to='/user-management'
        menuPlacement='bottom-start'
        menuTrigger='click'
      >
        <MenuItem to='/user-management/customers' title='Customers' hasBullet={true} />
        <MenuItem to='/user-management/vendors' title='Vendors' hasBullet={true} />
        <MenuItem
          to='/user-management/cod-enable-requests'
          title='COD Enable Requests'
          hasBullet={true}
        />
        <MenuItem
          to='/user-management/reviews-and-ratings'
          title='Reviews And Ratings'
          hasBullet={true}
        />
      </MenuInnerWithSub>
      <MenuInnerWithSub title='Jobs' to='/jobs' menuPlacement='bottom-start' menuTrigger='click'>
        <MenuItem to='/jobs/inprogress-jobs' title='Inprogress Jobs' hasBullet={true} />
        <MenuItem to='/jobs/completed-jobs' title='Completed Jobs' hasBullet={true} />
        <MenuItem to='/jobs/cancelled-jobs' title='Cancelled Jobs' hasBullet={true} />
      </MenuInnerWithSub>
      <MenuInnerWithSub
        title='Service Info'
        to='/service-info'
        menuPlacement='bottom-start'
        menuTrigger='click'
      >
        <MenuItem to='/service-info/category' title='Category' hasBullet={true} />
        <MenuItem to='/service-info/subcategory' title='Sub Category' hasBullet={true} />
        <MenuItem to='/service-info/state' title='State' hasBullet={true} />
        <MenuItem to='/service-info/city' title='City' hasBullet={true} />
      </MenuInnerWithSub>
      <MenuItem to='/support' title='Support' />
      <MenuInnerWithSub
        title='Settings'
        to='/settings'
        menuPlacement='bottom-start'
        menuTrigger='click'
      >
        <MenuItem to='/settings/edit-profile' title='Edit Profile' hasBullet={true} />
        <MenuItem to='/settings/Change-password' title='Change Password' hasBullet={true} />
        <MenuItem to='/settings/master-settings' title='Master Settings' hasBullet={true} />
        <MenuItem to='/settings/email' title='Email Configuration' hasBullet={true} />
        <MenuItem to='/settings/sms' title='SMS Configuration' hasBullet={true} />
        <MenuItem to='/settings/social-media' title='Social Media Management' hasBullet={true} />
        <MenuItem to='/settings/static-pages' title='Static Pages Management' hasBullet={true} />
      </MenuInnerWithSub>
      <MenuInnerWithSub
        title='Reports'
        to='/reports'
        menuPlacement='bottom-start'
        menuTrigger='click'
      >
        <MenuItem to='/reports/login-report' title='Login Report' hasBullet={true} />
        <MenuItem to='/reports/contact-us' title='Contact Us' hasBullet={true} />
      </MenuInnerWithSub>
      <MenuItem to='/offers-and-banners' title='Offers And Banner' />
      {/* <MenuInnerWithSub
        title='Communications'
        to='/communications'
        menuPlacement='bottom-start'
        menuTrigger='click'
      >
        <MenuItem to='/communications/email-templates' title='Email Templates' hasBullet={true} />
        <MenuItem
          to='/communications/notification-templates'
          title='Notification Templates'
          hasBullet={true}
        />
        <MenuItem
          to='/communications/broadcast-message'
          title='Broadcast Message'
          hasBullet={true}
        />
      </MenuInnerWithSub> */}
      <MenuInnerWithSub
        isMega={true}
        title='Site Map'
        to='/site-map'
        menuPlacement='bottom-start'
        menuTrigger='click'
      >
        <MegaMenu />
      </MenuInnerWithSub>
    </>
  )
}
