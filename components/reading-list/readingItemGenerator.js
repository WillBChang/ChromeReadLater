export function renderLiFrom(page) {
  return `
      <li id=${page.date}>
        <img src="${page.favIconUrl}" alt="">
        <a href="${page.url}" title="${getTitleAttribute()}" ${getInnerTextColor()} tabindex="-1">${encodeInnerText()}</a>
        ${getScrollPercent()}
      </li>
    `

  function getTitleAttribute() {
    return page.title === page.url ? page.url : `${encodeInnerText()}\n\n${page.url}`
  }

  function getInnerTextColor() {
    return page.url === page.title ? 'style="color: gray"' : ''
  }

  function encodeInnerText() {
    // eslint-disable-next-line no-undef
    return he.encode(page.title)
  }

  function getScrollPercent() {
    return page.scroll.top
      ? `<span class="position">${page.scroll.percent}</span>`
      : ''
  }
}
