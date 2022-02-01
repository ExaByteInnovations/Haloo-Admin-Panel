/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {FC} from 'react'
import {useIntl} from 'react-intl'
import {PageTitle} from '../../../_metronic/layout/core'
import {TablesWidget12} from '../../../_metronic/partials/widgets'

const RatingsPage: FC = () => (
  <>
    <TablesWidget12 className='row gy-5 g-xl-8' />
  </>
)

const Ratings: FC = () => {
  const intl = useIntl()
  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.RATING'})}</PageTitle>
      <RatingsPage />
    </>
  )
}

export {Ratings}
