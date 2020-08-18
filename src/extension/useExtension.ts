import { useState, useEffect } from 'react'
import { without, uniq } from 'ramda'

export default () => {}

export const useCheckConnectRequested = (): {
  list: string[]
  allow: (origin: string) => void
} => {
  const [list, setList] = useState<string[]>([])

  useEffect(() => {
    chrome.storage.local.get(
      ['connectRequested'],
      ({ connectRequested = [] }) => setList(connectRequested)
    )
  }, [])

  const allow = (origin: string) => {
    const next = without([origin], list)
    chrome.storage.local.get(['connectAllowed'], ({ connectAllowed = [] }) =>
      chrome.storage.local.set(
        {
          connectRequested: next,
          connectAllowed: uniq([...connectAllowed, origin]),
        },
        () => setList(next)
      )
    )
  }

  return { list, allow }
}

export const useCheckConfirmRequested = (
  callback: (payload: any, onResult: () => void) => void
) => {
  useEffect(() => {
    chrome.storage.local.get(['confirm'], ({ confirm }) => {
      if (!!confirm) {
        callback(confirm, () =>
          chrome.storage.local.set({ confirm: null, posted: 'true' })
        )
      }
    })

    // eslint-disable-next-line
  }, [])
}
