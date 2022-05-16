import React from 'react'
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
          title='COD Enable Request'
          hasBullet={true}
        />
      </MenuInnerWithSub>
      <MenuInnerWithSub title='Jobs' to='/jobs' menuPlacement='bottom-start' menuTrigger='click'>
        <MenuItem to='/jobs/open-jobs' title='Open Jobs' hasBullet={true} />
        <MenuItem to='/jobs/completed-jobs' title='completed Jobs' hasBullet={true} />
        <MenuItem to='/jobs/disputed-jobs' title='Disputed Jobs' hasBullet={true} />
      </MenuInnerWithSub>
      <MenuInnerWithSub
        title='Service Info'
        to='/service-info'
        menuPlacement='bottom-start'
        menuTrigger='click'
      >
        <MenuItem to='/service-info/category' title='Category' hasBullet={true} />
        {/* <MenuItem to='/service-info/subcategory' title='Sub Category' hasBullet={true} /> */}
        <MenuItem to='/service-info/state' title='State' hasBullet={true} />
        <MenuItem to='/service-info/city' title='City' hasBullet={true} />
      </MenuInnerWithSub>

      <MenuItem to='/support' title='Support' />
    </>
  )
}
