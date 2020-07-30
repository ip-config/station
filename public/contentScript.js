/* globals chrome */
const EXTENSION_ID = 'kaanofkdfcdmmpjbmfgkckandkojoboc'

const domIsReady = () => {
  if (['interactive', 'complete'].includes(document.readyState)) {
    return Promise.resolve()
  }

  return new Promise((resolve) =>
    window.addEventListener('DOMContentLoaded', resolve, { once: true })
  )
}

const start = async () => {
  await domIsReady()

  document.addEventListener('sendMessage', (event) => {
    chrome.runtime.sendMessage(EXTENSION_ID, event.detail, (response) => {
      const event = new CustomEvent('sendResponse', { detail: response })
      document.dispatchEvent(event)
    })
  })
}

start()
