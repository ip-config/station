/* globals chrome */

chrome.extension.onMessage.addListener((req, sender, sendResponse) => {
  try {
    const request = JSON.parse(req)
    const { origin } = sender

    switch (request.action) {
      case 'connectWallet':
        const handleChange = (changes, namespace) => {
          namespace === 'local' &&
            chrome.storage.local.get(
              ['connectAllowed', 'wallet'],
              handleConnectWallet
            )
        }

        const handleConnectWallet = ({
          connectAllowed = [],
          connectRequested = [],
          wallet,
        }) => {
          if (connectAllowed.includes(origin) && wallet?.address) {
            sendResponse({ type: 'WALLET', wallet })
            tabId && chrome.tabs.remove(tabId)
          } else {
            ![...connectRequested, ...connectAllowed].includes(origin) &&
              chrome.storage.local.set({
                connectRequested: [origin, ...connectRequested],
              })

            openPopup()

            chrome.storage.onChanged.addListener(handleChange)
          }
        }

        chrome.storage.local.get(
          ['connectAllowed', 'connectRequested', 'wallet'],
          handleConnectWallet
        )

        break

      case 'confirm':
        chrome.storage.local.set({
          confirm: request.payload,
          posted: false,
        })

        openPopup()

        chrome.storage.onChanged.addListener((changes, namespace) => {
          if (
            namespace === 'local' &&
            changes['posted'] &&
            !!changes['posted'].newValue
          ) {
            sendResponse({ type: 'TX', tx: changes['posted'] })
          }
        })

        break

      default:
        break
    }

    return true
  } catch (error) {
    console.error(error)
    return false
  }
})

let tabId = undefined

const openPopup = () => {
  const popup = { type: 'popup', focused: true, width: 480, height: 640 }
  chrome.tabs.create(
    { url: chrome.extension.getURL('index.html'), active: false },
    (tab) => {
      tabId = tab.id
      chrome.windows.getCurrent((window) => {
        chrome.windows.create({ ...popup, tabId: tab.id, top: window.top })
      })
    }
  )
}
