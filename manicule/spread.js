import { CollationMember } from "./collation.js"
import { cacheableImage, iiif } from "./image.js"

export class SpreadViewer extends CollationMember {
  region = "full"
  defaultWidth = 1750
  defaultHeight = 2423

  constructor() {
    super()
  }
  static get observedAttributes() {
    return ["index"]
  }
  get width() {
    return +this.getAttribute("width") || this.defaultWidth
  }
  get height() {
    return +this.getAttribute("height") || this.defaultHeight
  }
  get default() {
    return this.getAttribute("default") || "images/loading-icon.svg"
  }
  connectedCallback() {
    super.connectedCallback()
  }
  attributeChangedCallback(name, oldValue, value) {
    // Fire the render method only when the attribute has been dynamically updated
    if (name === "index" && oldValue != undefined) {
      this.render()
    }
  }
  ready = () => {
    this.render()
  }
  render = () => {
    const index = +this.getAttribute("index")
    const verso = cacheableImage(
      this.width,
      this.height,
      "leaf",
      {},
      this.default
    )
    const recto = cacheableImage(
      this.width,
      this.height,
      "leaf",
      {},
      this.default
    )

    this.shadowRoot.replaceChildren(...[verso, recto])
    const spread = this.collation.data.derived.linear[index]

    verso.setAttribute(
      "data-url",
      iiif(spread[0].params.image.url, this.region, this.width, this.height)
    )
    recto.setAttribute(
      "data-url",
      iiif(spread[1].params.image.url, this.region, this.width, this.height)
    )
    this.shadowRoot.lastChild.insertAdjacentHTML(
      "afterend",
      `<style>
          :host {
              display: flex;
              align-items: center;
              width: 100%;          
          }
          img { 
              height: auto;
              max-width: 50%;
          }
          img.selected {
              outline: 5px solid var(--highlight-color);
              z-index: 99;            
          }
          img.leaf {
              width: auto;
              height: auto;
              max-width: 100%;
          }
          img[src="images/loading-icon.svg"] {
              opacity: 0.5;
              scale: 0.25;
              animation: spin 1.5s infinite linear;
          }
          @keyframes spin {
              from {
                  transform: rotate(0deg);
              }
              to {
                  transform: rotate(360deg);
              }
          }
          
      </style>`
    )
  }
}

export class LeafNav extends CollationMember {
  ready = () => {
    const button = document.createElement("button")
    button.textContent = this.getAttribute("direction")
    this.shadowRoot.append(button)
    button.addEventListener("click", () => {
      const spread = this.collation.querySelector("spread-viewer")
      const current = +spread.getAttribute("index")
      if (this.getAttribute("direction") === "next") {
        spread.setAttribute("index", current + 1)
      } else if (this.getAttribute("direction") === "previous") {
        spread.setAttribute("index", current - 1)
      }
    })
  }
}
