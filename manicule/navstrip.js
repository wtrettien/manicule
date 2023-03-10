import { CollationMember } from "./collation.js"
import { cacheableImage, iiif } from "./image.js"

export class NavStrip extends CollationMember {
  region = "square"
  defaultWidth = 109
  defaultHeight = 151

  get width() {
    return +this.getAttribute("width") || this.defaultWidth
  }
  get height() {
    return +this.getAttribute("height") || this.defaultHeight
  }

  connectedCallback() {
    super.connectedCallback()
    this.shadowRoot.innerHTML = `<style>
           nav {
              overflow-x: auto;
              width: 100%;
              white-space: nowrap;
          }
          nav img {
              width: 50px;
              height: 50px;
          }
          </style>`
  }
  ready = () => {
    const viewer = this.collation.querySelector("spread-viewer")
    const strip = document.createElement("nav")
    let i = 0

    const items = this.collation.data.derived.linear.map((spread) => {
      const container = document.createElement("span")
      container.setAttribute("data-spread-index", i)
      container.addEventListener("click", () => {
        viewer.setAttribute(
          "index",
          container.getAttribute("data-spread-index")
        )
      })
      for (const leaf of spread) {
        const img = cacheableImage(this.width, this.height, "nav-leaf")

        container.append(img)

        const url = iiif(
          leaf.params.image.url,
          this.region,
          this.width,
          this.height
        )
        img.setAttribute("data-url", url)
      }
      i++
      return container
    })
    strip.append(...items)
    this.shadowRoot.append(strip)
  }
}
