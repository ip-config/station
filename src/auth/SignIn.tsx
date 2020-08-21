import React, { useState } from 'react'
import { Link, useRouteMatch } from 'react-router-dom'
import { useSignIn } from '@terra-money/use-station'
import { isExtension } from '../utils/env'
import { loadKeys, testPassword } from '../utils/localStorage'
import Form from '../components/Form'
import Icon from '../components/Icon'
import ManageAccounts from './ManageAccounts'
import s from './SignIn.module.scss'

const SignIn = () => {
  const { url } = useRouteMatch()

  const accounts = loadKeys()
  const { form, manage } = useSignIn({
    list: accounts,
    test: ({ name, password }) => testPassword(name, password),
  })

  /* settings */
  const [settings, setSettings] = useState(false)
  const goSettings = () => setSettings(true)

  const renderManageLink = () => {
    const content = (
      <>
        <Icon name="settings" />
        <strong>{manage[0]}</strong>({manage[1]})
      </>
    )

    return !!accounts.length ? (
      isExtension ? (
        <Link to="/auth/manage">{content}</Link>
      ) : (
        <button type="button" className={s.manage} onClick={goSettings}>
          {content}
        </button>
      )
    ) : undefined
  }

  return settings ? (
    <ManageAccounts onFinish={() => {}} />
  ) : (
    <Form form={form} h2={renderManageLink()} />
  )
}

export default SignIn
