import { useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { without, uniq } from 'ramda'
import { createContext } from '@terra-money/use-station'

type Confirm = any

interface Extension {
  connect: {
    list: string[]
    allow: (origin: string, allow?: boolean) => void
  }

  confirm: {
    list: Confirm[]
    allow: (index: number) => void
  }
}

export const useExtensionRequested = (): Extension => {
  const [connectRequested, setConnectRequested] = useState<string[]>([])
  const [confirmRequested, setConfirmRequested] = useState<Confirm[]>([])

  useEffect(() => {
    chrome.storage.local.get(
      ['connectRequested', 'confirmRequested'],
      ({ connectRequested = [], confirmRequested = [] }) => {
        setConnectRequested(connectRequested)
        setConfirmRequested(confirmRequested)
      }
    )
  }, [])

  const allowConnection = (origin: string, allow: boolean = true) => {
    const next = without([origin], connectRequested)
    chrome.storage.local.get(['connectAllowed'], ({ connectAllowed = [] }) =>
      chrome.storage.local.set(
        Object.assign(
          { connectRequested: next },
          allow && { connectAllowed: uniq([...connectAllowed, origin]) }
        ),
        () => setConnectRequested(next)
      )
    )
  }

  const allowConfirmation = (index: number) => {
    const next = confirmRequested.filter((_, i) => i !== index)
    chrome.storage.local.set({ confirmRequested: next })
  }

  /* Redirect on requested */
  useRedirectConnect(!!connectRequested.length)

  return {
    connect: { list: connectRequested, allow: allowConnection },
    confirm: { list: confirmRequested, allow: allowConfirmation },
  }
}

/* Context */
export const [useExtension, ExtensionProvider] = createContext<Extension>()

/* Redirect */
export const useRedirectConnect = (redirect: boolean) => {
  const { pathname } = useLocation()
  const { push } = useHistory()

  useEffect(() => {
    redirect && pathname !== '/connect' && push('/connect')
  }, [redirect, pathname, push])
}

export const useCheckConfirmRequested = (
  callback: (payload: any, onResult: () => void) => void
) => {
  useEffect(() => {
    // eslint-disable-next-line
  }, [])
}
