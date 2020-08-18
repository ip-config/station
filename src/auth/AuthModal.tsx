import React, { ReactNode, useState } from 'react'
import { AuthMenuKey } from '@terra-money/use-station'
import { useApp } from '../hooks'
import ModalContent from '../components/ModalContent'
import { AuthModalProvider } from './useAuthModal'
import Auth from './Auth'

export interface Item {
  title: string
  icon: string
  path?: string
  disabled?: boolean
  key: AuthMenuKey
  render: () => ReactNode
}

const AuthModal = () => {
  const { authModal } = useApp()
  const [currentKey, setCurrentKey] = useState<AuthMenuKey>()

  const actions = {
    glance: () => setCurrentKey('signInWithAddress'),
    download: () => setCurrentKey('download'),
  }

  /* Modal */
  const modalActions = {
    close: authModal.close,
    goBack: () => setCurrentKey(undefined),
  }

  return (
    <AuthModalProvider value={{ modalActions, actions }}>
      <ModalContent close={modalActions.close}>
        <Auth />
      </ModalContent>
    </AuthModalProvider>
  )
}

export default AuthModal
