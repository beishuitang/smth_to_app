import storage from '@/scripts/storage'
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
    async function (event) {
      const el = event.target
      if (el instanceof HTMLImageElement && el.src.endsWith('/large')) {
        let url = el.src.replace(/\/large$/, '')
        const img = await storage.getImgByUri(url)
        if (img) {
          url = URL.createObjectURL(img.data)
        }
        el.src = url
      }
    },
    true
  )
}
