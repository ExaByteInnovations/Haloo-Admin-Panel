import {Box, CircularProgress} from '@material-ui/core'
import {useEffect, useState} from 'react'
import {toast} from 'react-toastify'
import {ApiGet} from '../../../helpers/API/ApiData'
import {StatisticsWidget5} from '../../../_metronic/partials/widgets/statistics/StatisticsWidget5'
import {MixedWidget3} from '../../../_metronic/partials/widgets'

export function CustomDashboardWidget() {
  const [loading, setLoading] = useState(false)
  const [dashboardDetails, setDashboardDetails] = useState([])

  useEffect(() => {
    getDashboardDetails()
  }, [])

  const getDashboardDetails = async () => {
    try {
      setLoading(true)
      const response = await ApiGet(`dashboard`)
      if (response.status === 200) {
        setDashboardDetails(response.data.data)
      }
      setLoading(false)
    } catch (err) {
      toast.error(err.message)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Box className='loader'>
        <CircularProgress color='secondary' />
      </Box>
    )
  }

  const cardColor = ['danger', 'success', 'primary', 'info']

  return (
    <div
      style={{
        width: '100%',
        padding: '10px 30px',
      }}
    >
      <div className='row g-5 g-xl-8 mt-2'>
        {dashboardDetails?.map((item, index) => (
          <div key={item.title + index} className='col-xl-3'>
            <StatisticsWidget5
              className='card-xl-stretch mb-xl-8'
              svgIcon={`media/haloo-icons/${item?.title?.replace(/\s/g, '')?.toLowerCase()}.svg`}
              color={cardColor[index % cardColor.length]}
              iconColor='white'
              title={item.title}
              description={item.total}
            />
          </div>
        ))}
      </div>
      {/* <div className='row g-5 g-xl-8 mt-2'>
        <div className='col-xl-3'>
          <MixedWidget3 className='card-xl-stretch mb-xl-8' chartColor='info' chartHeight='250px' />
        </div>
      </div> */}
    </div>
  )
}
