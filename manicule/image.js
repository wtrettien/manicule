import { cache } from "./cache.js"
/**
 * Return an image element that will, as a side effect, cache itself and return the cached image as its source.
 *
 * @param {number} width
 * @param {number} height
 * @param {string} type
 * @param {Object} attrs
 * @param {string} srcDefault
 * @param {boolean} visible
 * @param {boolean} selected


 */
export const cacheableImage = (
  width,
  height,
  type = undefined,
  attrs = {},
  srcDefault = "images/document-icon.png",
  visible = false,
  selected = false
) => {
  const loadingImg = document.createElement("img")
  loadingImg.width = width
  loadingImg.height = height
  loadingImg.src = srcDefault
  loadingImg.setAttribute("data-type", type)

  const img = document.createElement("img")
  img.width = width
  img.height = height
  img.visible = visible
  img.selected = selected
  img.mousedown = false
  img.setAttribute("data-type", type)
  img.setAttribute("data-cacheable-image", "cacheable-image")

  for (const attr of Object.entries(attrs)) {
    const [k, v] = attr
    img.setAttribute(k, v)
  }

  loadingImg.observer = new IntersectionObserver((entries) => {
    entries.map((entry) => {
      if (entry.isIntersecting) {
        img.cache()
        loadingImg.observer.unobserve(entry.target)
      }
    })
  })
  loadingImg.observer.observe(loadingImg)

  if (type === "leaf") {
    const start = {
      x: 0,
      y: 0,
    }
    const offset = {
      x: 0,
      y: 0,
    } // The transform offset (from center)
    let scale = 1
    img.addEventListener(
      "wheel",
      (e) => {
        if (img.selected) {
          scale += e.deltaY * -0.01

          // Restrict scale
          scale = Math.min(Math.max(1, scale), 4)

          // Apply scale transform
          img.style.transform = `scale(${scale})`

          if (scale > 1) {
            img.zoomed = true
            img.style.zIndex = 99
          } else {
            img.zoomed = false
            img.style.zIndex = 1
            img.style.translate = "0px 0px"
          }
        }
      },
      {
        passive: true,
      }
    )
    img.addEventListener("click", (e) => {
      e.stopPropagation()
      img.selected = !img.selected
      img.classList.toggle("selected")
    })
    img.addEventListener("mousedown", (e) => {
      img.mousedown = true
      start.x = e.clientX - offset.x
      start.y = e.clientY - offset.y
    })
    img.addEventListener("mouseup", () => {
      img.mousedown = false
    })

    img.addEventListener("mousemove", (e) => {
      if (img.mousedown && img.zoomed && img.selected) {
        e.preventDefault()
        offset.x = e.clientX - start.x
        offset.y = e.clientY - start.y
        img.style.translate = `${offset.x}px ${offset.y}px`
      }
    })
  }
  img.cache = () => {
    const url = loadingImg.getAttribute("data-url")
    cache.match(url).then((resp) => {
      if (resp) {
        resp.blob().then((blob) => {
          img.src = URL.createObjectURL(blob)
          img.decode().then(() => loadingImg.replaceWith(img))
        })
      } else {
        fetch(new Request(url)).then((resp) => {
          cache.put(url, resp.clone())
          resp.blob().then((blob) => {
            img.src = URL.createObjectURL(blob)
            img.decode().then(() => loadingImg.replaceWith(img))
          })
        })
      }
    })
  }
  return loadingImg
}

export const iiif = (
  url,
  region,
  width,
  height,
  rotation = "0",
  quality = "default",
  format = "jpg"
) => `${url}/${region}/${width},${height}/${rotation}/${quality}.${format}`
