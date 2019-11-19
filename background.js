import * as extension from './modules/extension.js'
import * as storage from './modules/storage.js'
import * as tabs from './modules/tabs.js'

extension.onCommand(async () => {
  const tab = await tabs.current()
  if (tabs.isEmpty(tab)) return

  const position = await tabs.sendMessage(tab.id, { info: 'get page position' })
  storage.setPage(tab, position)

  const allTabs = await tabs.all()
  allTabs.length === 1 ? tabs.empty() : tabs.remove(tab)
})

extension.onMessage(async message => {
  const tab = await tabs.current()
  tabs.isEmpty(tab) ? tabs.update(message.url) : tabs.create(message.url)

  const position = await storage.getPosition(message.url)
  storage.remove(message.url)

  // Use raw sendMessage to avoid the error message below:
  // The message port closed before a response was received.
  const tabId = await tabs.onComplete()
  chrome.tabs.sendMessage(tabId, position)
})

extension.onClicked((selection, tab) => {
  storage.setSelection(tab, selection)
})

extension.onInstalled(() => {
  extension.createContextMenus({
    title: 'Read later',
    contexts: ['link'],
    id: 'read-later',
  })
})
