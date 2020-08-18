import React, { ReactNode } from 'react'
import { useAuthMenu } from '@terra-money/use-station'
import { AuthMenuKey, AuthMenuItem } from '@terra-money/use-station'
import { isElectron, isExtension } from '../utils/env'
import { loadKeys } from '../utils/localStorage'
import AuthMenu from './AuthMenu'
import AuthFooter from './AuthFooter'
import Recover from './Recover'
import SignUp from './SignUp'
import SignIn from './SignIn'
import SignInWithAddress from './SignInWithAddress'
import SignInWithLedger from './SignInWithLedger'
import Download from './Download'
import getAuthMenuKeys from './getAuthMenuKeys'

export interface Item {
  title: string
  icon: string
  path?: string
  disabled?: boolean
  key: AuthMenuKey
  render: () => ReactNode
}

const Auth = () => {
  const components: { [key in AuthMenuKey]: Omit<Item, 'title' | 'key'> } = {
    recover: {
      icon: 'settings_backup_restore',
      path: '/recover',
      render: () => <Recover />,
    },
    signUp: {
      icon: 'add_circle_outline',
      path: '/new',
      render: () => <SignUp />,
    },
    signIn: {
      icon: 'radio_button_checked',
      disabled: !loadKeys().length,
      path: '/select',
      render: () => <SignIn />,
    },
    signInWithAddress: {
      icon: 'account_balance_wallet',
      disabled: true,
      render: () => <SignInWithAddress />,
    },
    signInWithLedger: {
      icon: 'usb',
      render: () => <SignInWithLedger />,
    },
    download: {
      icon: 'cloud_download',
      render: () => <Download />,
    },
  }

  const keys: AuthMenuKey[] = getAuthMenuKeys()
  const { ui, list } = useAuthMenu(keys)

  /* render */
  const getItem = ({ label, key }: AuthMenuItem) =>
    Object.assign({}, { title: label, key }, components[key])

  const menu = list.map(getItem)
  const showFooter = !isElectron && !isExtension

  return (
    <>
      <AuthMenu list={menu} />
      {showFooter && <AuthFooter {...ui.web} />}
    </>
  )
}

export default Auth
