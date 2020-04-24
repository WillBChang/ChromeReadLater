import {renderHtmlList} from '../modules/data.mjs'
import * as extension from '../modules_chrome/runtime.mjs'
import * as storage from '../modules_chrome/storage.mjs'


(async () => {
  // Init reading list
  const ul = $('ul')
  const pages = await storage.sortByLatest()
  pages.map(page => ul.append(renderHtmlList(page)))

  // Listen mouse and keyboard events
  ul.on({mouseenter: showDeleteIcon, mouseleave: showFavIcon}, 'img')
    .on('click', performAction)
})()

function performAction(event) {
  // https://devdocs.io/jquery/event.preventdefault
  event.preventDefault()
  // Get and send reading item's url as message to background,
  // because they are async/await functions,
  // popup.html will disappear after clicking the link,
  // thus popup.js will be interrupted.

  if (event.target.tagName === 'IMG') return removeReadingItem(event)
  sendUrlToBackground(event)
  // Close popup.html when loading in current tab.
  // Update current tab won't close popup.html automatically,
  // but create a new tab does.
  window.close()
}


function sendUrlToBackground(event) {
  let url
  if (event.target.tagName === 'A') url = event.target.href
  if (event.target.tagName === 'LI') url = event.target.childNodes[3].href
  if (event.target.tagName === 'SPAN') url = event.target.previousSibling.previousSibling.href

  extension.sendMessage({url})
}

function removeReadingItem(event) {
  // Current `event.target` is <img>, the parentNode is <li>
  event.target.parentNode.remove()
  // The next sibling of <img> is <a>
  storage.remove(event.target.nextElementSibling.href)
}

function showDeleteIcon(event) {
  localStorage.setItem('src', event.target.src)
  event.target.src = isDarkMode() ? '../images/delete-white32x32.png' : '../images/32x32delete.png'
}

function isDarkMode() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
}

function showFavIcon(event) {
  event.target.src = localStorage.getItem('src')
  localStorage.clear()
}

