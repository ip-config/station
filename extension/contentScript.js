import extension from 'extensionizer'
import LocalMessageDuplexStream from 'post-message-stream'
import PortStream from 'extension-port-stream'

if (shouldInjectProvider()) {
  injectScript()
  start()
}

/**
 * Injects a script tag into the current document
 *
 * @param {string} content - Code to be executed in the current document
 */
function injectScript() {
  try {
    const container = document.head || document.documentElement
    const scriptTag = document.createElement('script')
    scriptTag.setAttribute('async', 'false')
    scriptTag.setAttribute('src', extension.runtime.getURL('inpage.js'))
    container.insertBefore(scriptTag, container.children[0])
    container.removeChild(scriptTag)
  } catch (e) {
    console.error('Station: provider injection failed.', e)
  }
}

/**
 * Sets up the stream communication and submits site metadata
 *
 */
async function start() {
  await setupStreams()
  await domIsReady()
  console.log('Station(contentScript): start end')
}

/**
 * Determines if the provider should be injected
 *
 * @returns {boolean} {@code true} - if the provider should be injected
 */
function shouldInjectProvider() {
  return doctypeCheck() && suffixCheck() && documentElementCheck() && !blockedDomainCheck()
}

/**
 * Checks the doctype of the current document if it exists
 *
 * @returns {boolean} {@code true} - if the doctype is html or if none exists
 */
function doctypeCheck() {
  const { doctype } = window.document
  if (doctype) {
    return doctype.name === 'html'
  }
  return true
}

/**
 * Returns whether or not the extension (suffix) of the current document is prohibited
 *
 * This checks {@code window.location.pathname} against a set of file extensions
 * that we should not inject the provider into. This check is indifferent of
 * query parameters in the location.
 *
 * @returns {boolean} - whether or not the extension of the current document is prohibited
 */
function suffixCheck() {
  const prohibitedTypes = [/\.xml$/, /\.pdf$/]
  const currentUrl = window.location.pathname
  for (let i = 0; i < prohibitedTypes.length; i += 1) {
    if (prohibitedTypes[i].test(currentUrl)) {
      return false
    }
  }
  return true
}

/**
 * Checks the documentElement of the current document
 *
 * @returns {boolean} {@code true} - if the documentElement is an html node or if none exists
 */
function documentElementCheck() {
  const documentElement = document.documentElement.nodeName
  if (documentElement) {
    return documentElement.toLowerCase() === 'html'
  }
  return true
}

/**
 * Checks if the current domain is blocked
 *
 * @returns {boolean} {@code true} - if the current domain is blocked
 */
function blockedDomainCheck() {
  const blockedDomains = [
    'uscourts.gov',
    'dropbox.com',
    'webbyawards.com',
    'cdn.shopify.com/s/javascripts/tricorder/xtld-read-only-frame.html',
    'adyen.com',
    'gravityforms.com',
    'harbourair.com',
    'ani.gamer.com.tw',
    'blueskybooking.com',
    'sharefile.com',
  ]
  const currentUrl = window.location.href
  let currentRegex
  for (let i = 0; i < blockedDomains.length; i += 1) {
    const blockedDomain = blockedDomains[i].replace('.', '\\.')
    currentRegex = new RegExp(`(?:https?:\\/\\/)(?:(?!${blockedDomain}).)*$`)
    if (!currentRegex.test(currentUrl)) {
      return true
    }
  }
  return false
}

/**
 * Returns a promise that resolves when the DOM is loaded (does not wait for images to load)
 */
function domIsReady() {
  // already loaded
  if (['interactive', 'complete'].includes(document.readyState)) {
    return Promise.resolve()
  }
  // wait for load
  return new Promise((resolve) => window.addEventListener('DOMContentLoaded', resolve, { once: true }))
}

/**
 * Sets up two-way communication streams between the
 * browser extension and local per-page browser context.
 *
 */
async function setupStreams() {
  const pageStream = new LocalMessageDuplexStream({
    name: 'station:content',
    target: 'station:inpage',
  })

  const extensionPort = extension.runtime.connect({ name: 'TerraStationExtension' })
  const extensionStream = new PortStream(extensionPort)

  extensionStream.pipe(pageStream)
  pageStream.pipe(extensionStream)

  // document.addEventListener('sendMessage', (event) => {
  //   chrome.runtime.sendMessage(EXTENSION_ID, event.detail, (response) => {
  //     const event = new CustomEvent('sendResponse', { detail: response })
  //     document.dispatchEvent(event)
  //   })
  // })
}

