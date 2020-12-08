import * as storage from '../modules-chrome/storage.mjs'
import * as generator from './readingItemGenerator.mjs'
import * as mouse from './mouse.mjs'
import * as keyboard from './keyboard.mjs'
import * as action from './domActions.mjs'

const readingList = $('#reading-list')

export async function setup() {
  removeDeletedReadingItems()
  await initDomFromStorage()
  activeFirstLi()
  changeIconOnMouseEnterLeave()
  updateStateOnMouseMove()
  doActionOnMouseClick()
  doActionOnBodyKeyDown()
}

// Remove the deleted urls from storage before init reading list.
// Clear all the local items, includes dependingUrls, lastKey, and src.
function removeDeletedReadingItems() {
  localStorage.getArray('dependingUrls').forEach(storage.sync.remove)
  const localStorageKeys = ['dependingUrls', 'lastKey', 'isMoving']
  localStorageKeys.forEach(key => localStorage.removeItem(key))
}

export async function initDomFromStorage() {
  const pages = await storage.sync.sortByLatest()
  const favIcons = await storage.local.get()
  pages.map(page => readingList.append(
    generator.renderLiFrom(page, favIcons[page.favIconUrl])
  ))
}

export function activeFirstLi() {
  const li = $('#reading-list li')
  if (li.length !== 0) li.first().addClass('active')
}

export function changeIconOnMouseEnterLeave() {
  readingList.on({
    mouseenter: showDeleteIcon,
    mouseleave: showFavIcon
  }, 'img')
}

export function updateStateOnMouseMove() {
  readingList.on('mousemove', 'li', ({target}) => {
    const li = target.tagName === 'LI' ? $(target) : $(target.parentNode)
    action.reactive(li)
    action.updateRowNumber()
  })
}

export function doActionOnMouseClick() {
  readingList.on('click', event => {
    event.preventDefault()

    try {
      mouse.mouseAction(event)
    } catch (e) {
      console.log('Catch click action error: ', e)
    }
  })
}

export function doActionOnBodyKeyDown() {
  $('body').on('keydown', event => {
    try {
      const keyBinding = keyboard.getKeyBinding(event)
      const keyAction = keyboard.getKeyAction(keyBinding)
      keyAction()
    } catch (e) {
      console.log('Catch default key action: ', event.key)
    }
  })
}

function showDeleteIcon(event) {
  localStorage.setItem('src', event.target.src)
  event.target.src = isDarkMode() ? '../assets/icons/delete-white32x32.png' : '../assets/icons/delete-black32x32.png'
}

function isDarkMode() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
}

function showFavIcon(event) {
  event.target.src = localStorage.getItem('src')
}