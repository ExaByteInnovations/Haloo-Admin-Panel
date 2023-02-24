import {Suspense} from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {FallbackView} from '../../_metronic/partials'
import {DashboardWrapper} from '../pages/dashboard/DashboardWrapper'
import {Ratings} from '../pages/userManagement/Ratings'
import {InprogressJobs} from '../pages/jobs/InprogressJobs'
import {CompletedJobs} from '../pages/jobs/CompletedJobs'
import {CancelledJobs} from '../pages/jobs/CancelledJobs'
import {Category} from '../pages/service-info/Category'
import {SubCategory} from '../pages/service-info/SubCategory'
import {City} from '../pages/service-info/City'
import {State} from '../pages/service-info/State'
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
import {LoginReport} from '../pages/reports/LoginReport'
import {ContactUs} from '../pages/reports/ContactUs'
import {OffersAndBanners} from '../pages/offers-and-banners/OffersAndBanners'
import {Sms} from '../pages/settings/Sms'
import {EmailTemplates} from '../pages/communications/EmailTemplates'

export function PrivateRoutes() {
  return (
    <Suspense fallback={<FallbackView />}>
      <Switch>
        <Route path='/dashboard' component={DashboardWrapper} />
        <Route exact path='/user-management/reviews-and-ratings' component={Ratings} />
        <Route exact path='/user-management/customers' component={Customers} />
        <Route exact path='/user-management/vendors' component={Vendors} />
        <Route exact path='/user-management/cod-enable-requests' component={CodEnable} />
        <Route exact path='/jobs/inprogress-jobs' component={InprogressJobs} />
        <Route exact path='/jobs/completed-jobs' component={CompletedJobs} />
        <Route exact path='/jobs/cancelled-jobs' component={CancelledJobs} />
        <Route exact path='/service-info/category' component={Category} />
        <Route exact path='/service-info/subcategory' component={SubCategory} />
        <Route exact path='/service-info/city' component={City} />
        <Route exact path='/service-info/state' component={State} />
        <Route exact path='/support' component={Support} />
        <Route exact path='/settings/master-settings' component={MasterSettings} />
        <Route exact path='/settings/email' component={Email} />
        <Route exact path='/settings/sms' component={Sms} />
        <Route exact path='/settings/social-media' component={SocialMedia} />
        <Route exact path='/settings/edit-profile' component={EditProfile} />
        <Route exact path='/settings/change-password' component={Password} />
        <Route exact path='/settings/static-pages' component={StaticPages} />
        <Route exact path='/settings/editor' component={TextEditor} />
        <Route exact path='/reports/login-report' component={LoginReport} />
        <Route exact path='/reports/contact-us' component={ContactUs} />
        <Route exact path='/offers-and-banners' component={OffersAndBanners} />
        <Route exact path='/communications/email-templates' component={EmailTemplates} />

        <Redirect from='/auth' to='/dashboard' />
        <Redirect exact from='/' to='/dashboard' />
        <Redirect to='/error/404' />
      </Switch>
    </Suspense>
  )
}
