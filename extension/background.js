import extension from 'extensionizer'
import PortStream from 'extension-port-stream'

function connectRemote(remotePort) {
  if (remotePort.name !== 'TerraStationExtension') {
    return
  }

  const origin = remotePort.sender.origin

  console.log('Station(background): connectRemote', remotePort)
  const portStream = new PortStream(remotePort)

  const sendResponse = (name, payload) => {
    portStream.write({ name, payload })
  }

  portStream.on('data', (data) => {
    console.log('Station(background): portStream.on:', data)

    switch (data.action) {
      case 'connectWallet':
        const handleChange = (changes, namespace) => {
          namespace === 'local' &&
            extension.storage.local.get(
              ['connectAllowed', 'wallet'],
              handleConnectWallet
            )
        }

        const handleConnectWallet = ({
          connectAllowed = [],
          connectRequested = [],
          wallet,
        }) => {
          if (connectAllowed.includes(origin) && wallet && wallet.address) {
            sendResponse('WALLET', wallet)
            tabId && extension.tabs.remove(tabId)
          } else {
            ![...connectRequested, ...connectAllowed].includes(origin) &&
              extension.storage.local.set({
                connectRequested: [origin, ...connectRequested],
              })

            openPopup()

            extension.storage.onChanged.addListener(handleChange)
          }
        }

        extension.storage.local.get(
          ['connectAllowed', 'connectRequested', 'wallet'],
          handleConnectWallet
        )

        break

      case 'confirm':
        extension.storage.local.set({
          confirm: data.payload,
          posted: false,
        })

        openPopup()

        extension.storage.onChanged.addListener((changes, namespace) => {
          if (
            namespace === 'local' &&
            changes['posted'] &&
            !!changes['posted'].newValue
          ) {
            sendResponse('TX', { tx: changes['posted'] })
          }
        })

        break

      default:
        break
    }
  })
}

extension.runtime.onConnect.addListener(connectRemote)

let tabId = undefined

const openPopup = () => {
  const popup = { type: 'popup', focused: true, width: 480, height: 640 }
  extension.tabs.create(
    { url: extension.extension.getURL('index.html'), active: false },
    (tab) => {
      tabId = tab.id
      extension.windows.getCurrent((window) => {
        extension.windows.create({ ...popup, tabId: tab.id, top: window.top })
      })
    }
  )
}
