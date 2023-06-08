export function fixEmptyBoard() {
  setTimeout(() => {
    window.APP.body.refresh(true)
  }, 0)
}

export function fixSearchBoard() {
  const input = document.querySelector<HTMLInputElement>('#b_search')!
  const form = document.createElement('form')
  form.onsubmit = (e) => {
    input.blur()
    input.value = ''
    e.preventDefault()
  }
  input.parentElement?.appendChild(form)
  form.appendChild(input!)
}

export function fixImg() {
  document.addEventListener(
    'error',
    function (event) {
      const el = event.target
      if (el instanceof HTMLImageElement && el.src.endsWith('/large')) {
        el.src = el.src.replace(/\/large$/, '')
      }
    },
    true
  )
}
