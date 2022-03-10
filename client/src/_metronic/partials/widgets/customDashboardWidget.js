import {Box, CircularProgress} from '@material-ui/core'
import {useEffect, useState} from 'react'
import {toast} from 'react-toastify'
import {ApiGet} from '../../../helpers/API/ApiData'
import MuiCard from './MuiCard'

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
        <CircularProgress />
      </Box>
    )
  }

  const cardColor = ['#0096c7', '#00b4d8', '#48cae4', '#90e0ef']

  return (
    <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 35}}>
      {dashboardDetails?.map((item, index) => (
        <MuiCard
          key={item.title}
          title={item.title}
          count={item.total}
          color={cardColor[index % cardColor.length]}
        />
      ))}
    </Box>
  )
}
