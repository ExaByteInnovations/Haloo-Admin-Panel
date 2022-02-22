import MuiCard from './MuiCard'

export function CustomDashboardWidget({className}) {
  return (
    <div className='col-xl-3 col-lg-6'>
      <div className='row'>
        <MuiCard title='Customers' count='11' />
        <MuiCard title='Customers' count='11' />
        <MuiCard title='Customers' count='11' />
      </div>
    </div>
  )
}
