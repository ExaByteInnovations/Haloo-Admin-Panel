/* eslint-disable react/jsx-no-target-blank */
import {useIntl} from 'react-intl'
import {AsideMenuItemWithSub} from './AsideMenuItemWithSub'
import {AsideMenuItem} from './AsideMenuItem'

export function AsideMenuMain() {
  const intl = useIntl()

  return (
    <>
      <AsideMenuItem
        to='/dashboard'
        icon='/media/icons/duotune/art/art002.svg'
        title={intl.formatMessage({id: 'MENU.DASHBOARD'})}
        fontIcon='bi-app-indicator'
      />
      <AsideMenuItemWithSub
        to='/user-management'
        icon='/media/icons/duotune/general/gen051.svg'
        title={intl.formatMessage({id: 'MENU.USER_MANAGEMENT'})}
        fontIcon='bi-app-indicator'
      >
        {/* <AsideMenuItem
          to='/user-management/reviews-and-ratings'
          title='Reviews And Ratings'
          hasBullet={true}
        /> */}
        <AsideMenuItem to='/user-management/customers' title='Customers' hasBullet={true} />
        <AsideMenuItem to='/user-management/vendors' title='Vendors' hasBullet={true} />
        <AsideMenuItem
          to='/user-management/cod-enable-requests'
          title='COD Enable Requests'
          hasBullet={true}
        />
      </AsideMenuItemWithSub>

      <AsideMenuItemWithSub
        to='/jobs'
        icon='/media/icons/duotune/communication/com006.svg'
        title={intl.formatMessage({id: 'MENU.JOBS'})}
        fontIcon='bi-app-indicator'
      >
        <AsideMenuItem to='/jobs/open-jobs' title='Open Jobs' hasBullet={true} />
        <AsideMenuItem to='/jobs/completed-jobs' title='Completed Jobs' hasBullet={true} />
        <AsideMenuItem to='/jobs/disputed-jobs' title='Disputed Jobs' hasBullet={true} />
      </AsideMenuItemWithSub>

      <AsideMenuItemWithSub
        to='/service-info'
        icon='/media/icons/duotune/general/gen008.svg'
        title={intl.formatMessage({id: 'MENU.SERVICE_INFO'})}
        fontIcon='bi-app-indicator'
      >
        <AsideMenuItem to='/service-info/category' title='Category' hasBullet={true} />
        {/* <AsideMenuItem to='/service-info/subcategory' title='Subcategory' hasBullet={true} /> */}
        <AsideMenuItem to='/service-info/city' title='City' hasBullet={true} />
        <AsideMenuItem to='/service-info/state' title='State' hasBullet={true} />
      </AsideMenuItemWithSub>

      <AsideMenuItem
        to='/support'
        icon='/media/icons/duotune/communication/com007.svg'
        title='Support'
        fontIcon='bi-layers'
      />

      <AsideMenuItemWithSub
        to='/settings'
        icon='/media/icons/duotune/coding/cod001.svg'
        title={intl.formatMessage({id: 'MENU.SETTINGS'})}
        fontIcon='bi-app-indicator'
      >
        <AsideMenuItem to='/settings/edit-profile' title='Edit Profile' hasBullet={true} />
        <AsideMenuItem to='/settings/change-password' title='Change Password' hasBullet={true} />
        <AsideMenuItem to='/settings/master-settings' title='Master Settings' hasBullet={true} />
        <AsideMenuItem to='/settings/email' title='Email' hasBullet={true} />
        <AsideMenuItem to='/settings/social-media' title='Social Media' hasBullet={true} />
        <AsideMenuItem to='/settings/static-pages' title='Static Pages' hasBullet={true} />
      </AsideMenuItemWithSub>

      <AsideMenuItemWithSub
        to='/reports'
        icon='/media/icons/duotune/graphs/gra010.svg'
        title={intl.formatMessage({id: 'MENU.REPORTS'})}
        fontIcon='bi-app-indicator'
      >
        <AsideMenuItem to='/reports/login-report' title='Login Report' hasBullet={true} />
        <AsideMenuItem to='/reports/contact-us' title='Contact Us' hasBullet={true} />
      </AsideMenuItemWithSub>
    </>
  )
}
