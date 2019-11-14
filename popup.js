import * as event from './modules/event.js'
import * as extension from './modules/extension.js'
import * as storage from './modules/storage.js'

initReadingList()
$(() => {
  event.onClick('a', sendUrlToBackground)
  event.onHover('img', showDeleteIconOnEnter, showFavIconOnLeave)
  event.onClick('img', removeItem)
  clickButtonToReset()
})

async function initReadingList() {
  const pages = await storage.getSorted()
  pages.map(page => append(page))

  function append(page) {
    $('ul').append(`
      <li id=${page.date}>
        <img src="${page.favIconUrl}">
        <a href="${page.url}">${page.title}</a>
      </li>
    `)

    // Stop when page.scrollTop doesn't exist or the value is zero.
    // e.g. tabs.setSelection() does not save scroll position.
    if (!page.scrollTop) return
    $(`#${page.date}`).append(`
      <span class="position">
        ${page.scrollPercent}
      </span>
    `)
  }
}

function sendUrlToBackground(e) {
  // Disable the default <a> tag action.
  // Because there are some actions need to be run.
  // e.g.
  //  - Check if current is empty: tabs.isEmpty()
  //  - Add tab loading status listener: tabs.onComplete()
  //  - Get saved page scroll position and set it:
  //    - storage.getPosition(), chrome.tabs.sendMessage()
  //  - Remove this item in storage: storage.remove()
  e.preventDefault()
  // Send clicked url as message to background.
  // Because tabs.onComplete() is a live listener,
  // after clicking the url in popup.html,
  // popup.html disappeared, the listener would be interrupted.
  extension.sendMessage({ url: e.target.href })
  // Close popup.html when loading in current tab,
  // which also means the current tab is empty.
  // tabs.update() won't close popup.html,
  // tabs.create() does.
  window.close()
}

function showDeleteIconOnEnter(e) {
  localStorage.setItem('src', $(e.target).attr('src'))
  $(e.target).attr('src', '../images/32x32delete.png')
}

function showFavIconOnLeave(e) {
  $(e.target).attr('src', localStorage.getItem('src'))
}

function removeItem(e) {
  // e.target is <img>, the parentNode is <li>
  $(e.target.parentNode).remove()
  // The next sibling of <img> is <a>
  storage.remove(e.target.nextElementSibling.href)
}

function clickButtonToReset() {
  $('button').on('click', () => {
    storage.clear()
    window.close()
  })
}
