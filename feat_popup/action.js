import * as extension from '../modules_chrome/runtime.mjs'
import * as storage from '../modules_chrome/storage.mjs'
import * as filter from './filter.js'

export const remove = target => {
  filter.element(target).fadeOut()
  down(target)
  filter.element(target).remove()
  storage.remove(filter.url(target))
}

export const open = target => {
  extension.sendMessage({url: filter.url(target)})
}


export const up = target => {
  $(target).closest('li').prev('li').focus()
}

export const down = target => {
  $(target).closest('li').next('li').focus()
}


export const top = () => $('li').first().focus()

export const bottom = () => $('li').last().focus()
