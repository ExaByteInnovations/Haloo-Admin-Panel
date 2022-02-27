import {Suspense} from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {FallbackView} from '../../_metronic/partials'
import {DashboardWrapper} from '../pages/dashboard/DashboardWrapper'
// import {Ratings} from '../pages/userManagement/Ratings'
import {OpenJobs} from '../pages/jobs/OpenJobs'
import {CompletedJobs} from '../pages/jobs/CompletedJobs'
import {DisputedJobs} from '../pages/jobs/DisputedJobs'
import {Category} from '../pages/service-info/Category'
// import {SubCategory} from '../pages/service-info/SubCategory'
// import {City} from '../pages/service-info/City'
// import {State} from '../pages/service-info/State'
import {Customers} from '../pages/userManagement/Customers'
import {Vendors} from '../pages/userManagement/Vendors'
import {Support} from '../pages/support/Support'
import {MasterSettings} from '../pages/settings/MasterSettings'
import {Email} from '../pages/settings/Email'
import {SocialMedia} from '../pages/settings/SocialMedia'
import {EditProfile} from '../pages/settings/EditProfile'
import {Password} from '../pages/settings/Password'
import {StaticPages} from '../pages/settings/StaticPages'
import {TextEditor} from '../components/TextEditor'
import {CodEnable} from '../pages/userManagement/CodEnable'

export function PrivateRoutes() {
  return (
    <Suspense fallback={<FallbackView />}>
      <Switch>
        <Route path='/dashboard' component={DashboardWrapper} />
        {/* <Route path='/user-management/reviews-and-ratings' component={Ratings} /> */}
        <Route path='/user-management/customers' component={Customers} />
        <Route path='/user-management/vendors' component={Vendors} />
        <Route path='/user-management/cod-enable-requests' component={CodEnable} />
        <Route path='/jobs/open-jobs' component={OpenJobs} />
        <Route path='/jobs/completed-jobs' component={CompletedJobs} />
        <Route path='/jobs/disputed-jobs' component={DisputedJobs} />
        <Route path='/service-info/category' component={Category} />
        {/* <Route path='/service-info/subcategory' component={SubCategory} /> */}
        {/* <Route path='/service-info/city' component={City} /> */}
        {/* <Route path='/service-info/state' component={State} /> */}
        <Route path='/support' component={Support} />
        <Route path='/settings/master-settings' component={MasterSettings} />
        <Route path='/settings/email' component={Email} />
        <Route path='/settings/social-media' component={SocialMedia} />
        <Route path='/settings/edit-profile' component={EditProfile} />
        <Route path='/settings/change-password' component={Password} />
        <Route path='/settings/static-pages' component={StaticPages} />
        <Route path='/settings/editor' component={TextEditor} />

        <Redirect from='/auth' to='/dashboard' />
        <Redirect exact from='/' to='/dashboard' />
        <Redirect to='error/404' />
      </Switch>
    </Suspense>
  )
}
