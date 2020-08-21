import { useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { without, uniq } from 'ramda'
import { createContext } from '@terra-money/use-station'

interface Extension {
  connect: {
    list: string[]
    allow: (origin: string, allow?: boolean) => void
  }

  goBack?: () => void
  setGoBack: (fn?: () => void) => void
  resetGoBack: () => void
}

export const useExtensionRequested = (): Extension => {
  const [connectRequested, setConnectRequested] = useState<string[]>([])

  useEffect(() => {
    chrome.storage.local.get(
      ['connectRequested', 'confirmRequested'],
      ({ connectRequested = [], confirmRequested = [] }) => {
        setConnectRequested(connectRequested)
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

  /* Redirect on requested */
  useRedirectConnect(!!connectRequested.length)

  /* goBack */
  const [goBack, setGoBack] = useState<() => void>()
  const resetGoBack = () => setGoBack(undefined)

  return {
    connect: { list: connectRequested, allow: allowConnection },
    goBack,
    setGoBack,
    resetGoBack,
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

export const useExtensionGoBack = (fn?: () => void) => {
  const { setGoBack, resetGoBack } = useExtension()

  useEffect(() => {
    setGoBack(fn)
    return () => resetGoBack()
  }, [fn, setGoBack, resetGoBack])
}
