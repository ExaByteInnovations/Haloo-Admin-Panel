import React, {Suspense} from 'react'
import {BrowserRouter} from 'react-router-dom'
import {I18nProvider} from '../_metronic/i18n/i18nProvider'
import {LayoutProvider, LayoutSplashScreen} from '../_metronic/layout/core'
import {Routes} from './routing/Routes'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import {AuthContextProvider} from './auth/authContext'

type Props = {
  basename: string
}

const App: React.FC<Props> = ({basename}) => {
  return (
    <AuthContextProvider>
      <Suspense fallback={<LayoutSplashScreen />}>
        <BrowserRouter basename={basename}>
          <I18nProvider>
            <LayoutProvider>
              <Routes />
              <ToastContainer />
            </LayoutProvider>
          </I18nProvider>
        </BrowserRouter>
      </Suspense>
    </AuthContextProvider>
  )
}

export {App}
