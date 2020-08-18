import { useHistory } from 'react-router-dom'
import { useAuth } from '@terra-money/use-station'

const Exstension = () => {
  const { replace } = useHistory()
  const { user } = useAuth()
  replace(!user ? '/auth' : '/wallet')
  return null
}

export default Exstension
