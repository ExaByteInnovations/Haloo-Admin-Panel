import React, {Suspense, lazy} from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {FallbackView} from '../../_metronic/partials'
import {DashboardWrapper} from '../pages/dashboard/DashboardWrapper'
import {Ratings} from '../pages/userManagement/Ratings'
import {OpenJobs} from '../pages/jobs/OpenJobs'
import {CompletedJobs} from '../pages/jobs/CompletedJobs'
import {DisputedJobs} from '../pages/jobs/DisputedJobs'
import {Category} from '../pages/service-info/Category'
import {SubCategory} from '../pages/service-info/SubCategory'
import {City} from '../pages/service-info/City'
import {State} from '../pages/service-info/State'
import {Customers} from '../pages/userManagement/Customers'
import {Vendors} from '../pages/userManagement/Vendors'

// import {MenuTestPage} from '../pages/MenuTestPage'

export function PrivateRoutes() {
  // const BuilderPageWrapper = lazy(() => import('../pages/layout-builder/BuilderPageWrapper'))
  // const ProfilePage = lazy(() => import('../modules/profile/ProfilePage'))
  // const WizardsPage = lazy(() => import('../modules/wizards/WizardsPage'))
  // const AccountPage = lazy(() => import('../modules/accounts/AccountPage'))
  // const WidgetsPage = lazy(() => import('../modules/widgets/WidgetsPage'))
  // const ChatPage = lazy(() => import('../modules/apps/chat/ChatPage'))

  return (
    <Suspense fallback={<FallbackView />}>
      <Switch>
        <Route path='/dashboard' component={DashboardWrapper} />
        <Route path='/user-management/reviews-and-ratings' component={Ratings} />
        <Route path='/user-management/customers' component={Customers} />
        <Route path='/user-management/vendors' component={Vendors} />
        <Route path='/jobs/open-jobs' component={OpenJobs} />
        <Route path='/jobs/completed-jobs' component={CompletedJobs} />
        <Route path='/jobs/disputed-jobs' component={DisputedJobs} />
        <Route path='/service-info/category' component={Category} />
        <Route path='/service-info/subcategory' component={SubCategory} />
        <Route path='/service-info/city' component={City} />
        <Route path='/service-info/state' component={State} />

        {/* <Route path='/builder' component={BuilderPageWrapper} />
        <Route path='/crafted/pages/profile' component={ProfilePage} />
        <Route path='/crafted/pages/wizards' component={WizardsPage} />
        <Route path='/crafted/widgets' component={WidgetsPage} />
        <Route path='/crafted/account' component={AccountPage} />
        <Route path='/apps/chat' component={ChatPage} />
        <Route path='/menu-test' component={MenuTestPage} /> */}
        <Redirect from='/auth' to='/dashboard' />
        <Redirect exact from='/' to='/dashboard' />
        <Redirect to='error/404' />
      </Switch>
    </Suspense>
  )
}
