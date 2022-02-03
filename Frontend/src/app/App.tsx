import React, {Suspense} from 'react'
import {BrowserRouter} from 'react-router-dom'
import {I18nProvider} from '../_metronic/i18n/i18nProvider'
import {LayoutProvider, LayoutSplashScreen} from '../_metronic/layout/core'
import AuthInit from './modules/auth/redux/AuthInit'
import {Routes} from './routing/Routes'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

type Props = {
  basename: string
}

const App: React.FC<Props> = ({basename}) => {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <BrowserRouter basename={basename}>
        <I18nProvider>
          <LayoutProvider>
            <AuthInit>
              <Routes />
              <ToastContainer />
            </AuthInit>
          </LayoutProvider>
        </I18nProvider>
      </BrowserRouter>
    </Suspense>
  )
}

export {App}
