import { CollationModel } from "./collation.js"
import { StructureView, StructureLeaf } from "./structure.js"
import { SpreadViewer, LeafNav } from "./spread.js"
import { NavStrip } from "./navstrip.js"

customElements.define("collation-model", CollationModel)
customElements.define("nav-strip", NavStrip)
customElements.define("spread-viewer", SpreadViewer)
customElements.define("leaf-nav", LeafNav)
customElements.define("structure-view", StructureView)
customElements.define("structure-leaf", StructureLeaf)

// Add cancel listeners to the parent
document.addEventListener("click", () => {
  ;[...document.querySelectorAll(".selected")].map((el) => {
    el.parentNode.selected = !el.parentNode.selected
    el.classList.toggle("selected")
  })
})

// ESC resets all zoom options
document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "Escape": {
      ;[...document.querySelectorAll("[data-cacheable-image]")].map((el) => {
        el.zoomed = false
        el.selected = false
        el.style.translate = "0px 0px"
        el.style.transform = "scale(1)"
        el.classList.remove("selected")
        el.zIndex = 1
      })
    }
  }
})
