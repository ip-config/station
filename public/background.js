/* globals chrome */
chrome.extension.onMessage.addListener((req, sender, sendResponse) => {
  try {
    const request = JSON.parse(req)

    switch (request.action) {
      case 'connectWallet':
        chrome.storage.local.get(
          ['connectAllowed', 'connectRequested', 'wallet'],
          ({ connectAllowed = [], connectRequested = [], wallet }) => {
            if (connectAllowed.includes(sender.origin)) {
              sendResponse({ type: 'WALLET', wallet })
            } else {
              !connectRequested.includes(sender.origin) &&
                chrome.storage.local.set({
                  connectRequested: [sender.origin, ...connectRequested],
                })

              openPopup()

              chrome.storage.onChanged.addListener((changes, namespace) => {
                if (
                  namespace === 'local' &&
                  changes['connectAllowed'] &&
                  changes['connectAllowed'].newValue.includes(sender.origin)
                ) {
                  chrome.storage.local.get(['wallet'], ({ wallet }) =>
                    sendResponse({ type: 'WALLET', wallet })
                  )
                }
              })
            }
          }
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

const openPopup = () => {
  const popup = { type: 'popup', focused: true, width: 480, height: 640 }
  chrome.tabs.create(
    { url: chrome.extension.getURL('index.html'), active: false },
    (tab) => {
      chrome.windows.getCurrent((window) => {
        chrome.windows.create({ ...popup, tabId: tab.id, top: window.top })
      })
    }
  )
}
