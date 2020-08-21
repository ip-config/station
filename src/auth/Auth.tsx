import React, { ReactNode, useEffect } from 'react'
import { useHistory, Switch, Route, useRouteMatch } from 'react-router-dom'
import { useAuthMenu, useAuth } from '@terra-money/use-station'
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
import ManageAccounts from './ManageAccounts'
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
  const { user } = useAuth()
  const { replace } = useHistory()
  const { path, url } = useRouteMatch()

  useEffect(() => {
    user && isExtension && replace('/wallet')
  }, [user, replace])

  const components: { [key in AuthMenuKey]: Omit<Item, 'title' | 'key'> } = {
    recover: {
      icon: 'settings_backup_restore',
      path: url + '/recover',
      render: () => <Recover />,
    },
    signUp: {
      icon: 'add_circle_outline',
      path: url + '/new',
      render: () => <SignUp />,
    },
    signIn: {
      icon: 'radio_button_checked',
      disabled: !loadKeys().length,
      path: url + '/select',
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

  const footer = !isElectron && !isExtension && <AuthFooter {...ui.web} />
  const menu = (
    <AuthMenu
      card={isExtension ? ui.mobile : undefined}
      list={list.map(getItem)}
      footer={footer}
    />
  )

  return (
    <Switch>
      <Route path={path + '/'} exact render={() => menu} />
      <Route path={path + '/select'} component={SignIn} />
      <Route path={path + '/new'} component={SignUp} />
      <Route path={path + '/recover'} component={Recover} />
      <Route path={path + '/manage'} component={ManageAccounts} />
    </Switch>
  )
}

export default Auth
