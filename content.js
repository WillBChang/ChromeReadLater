chrome.runtime.onMessage.addListener((request, sender, send) => {
  if (request.info === 'get page position') {
    const position = {}
    position.scrollTop = document.documentElement.scrollTop
    position.scrollBottom = window.scrollY + window.innerHeight
    position.scrollHeight = document.documentElement.scrollHeight
    send(position)
  }

  if (request.scrollTop) {
    document.documentElement.scrollTop = request.scrollTop
  }
})
