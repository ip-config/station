import React, { ReactNode, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useAuth, User } from '@terra-money/use-station'
import { isExtension } from '../utils/env'
import PleaseSignIn from '../components/PleaseSignIn'

interface Props {
  card?: boolean
  children: (user: User) => ReactNode
}

const WithAuth = ({ card, children }: Props) => {
  const { user } = useAuth()
  const { replace } = useHistory()

  useEffect(() => {
    isExtension && !user && replace('/')
  }, [user, replace])

  return !user ? <PleaseSignIn card={card} /> : <>{children(user)}</>
}

export default WithAuth
