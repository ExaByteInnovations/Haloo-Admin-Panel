import {Box} from '@material-ui/core'
import MuiCard from './MuiCard'

export function CustomDashboardWidget({className}) {
  return (
    // <div className='col-xl-3 col-lg-6'>
    //   <div className='row'>
    <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 20}}>
      <MuiCard title='Customers' count='11' color='#00b4d8' />
      <MuiCard title='Vendors' count='13' color='#48cae4' />
      <MuiCard title='Completed Jobs' count='15' color='#90e0ef' />
    </Box>
    //   </div>
    // </div>
  )
}
