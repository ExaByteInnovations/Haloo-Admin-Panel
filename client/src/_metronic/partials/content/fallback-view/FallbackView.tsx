import {toAbsoluteUrl} from '../../../helpers'
import logo from '../../../../assets/logo.png'

export function FallbackView() {
  return (
    <div className='splash-screen'>
      <img
        // src={toAbsoluteUrl('/media/logos/logo-compact.svg')}
        src={logo}
        alt='Start logo'
      />
      <span>Loading ...</span>
    </div>
  )
}
