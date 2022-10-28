const COLLATION_READY_EVENT = 'collation-ready'
const CACHE_NAME = 'manicule'

const cache = await caches.open(CACHE_NAME)
class CollationModel extends HTMLElement {

    static get observedAttributes() {
        return ['ready']
    }
    constructor() {
        super()
        this.data = {}
    }
    async connectedCallback() {
        const id = this.getAttribute("id")

        const resp = await fetch(`./data/${id}/${id}.json`)
        this.data = await resp.json()

        // "Derived" data is computed by us from the collation model
        this.data.derived = {}

        const rectos = Object.values(this.data.Rectos)
        const versos = Object.values(this.data.Versos)
        this.data.derived.linear = versos.map((e, i) => [e, rectos[i]])

        this.dispatchEvent(new CustomEvent(COLLATION_READY_EVENT, {
            detail: {
                id: this.getAttribute('id')
            },
            composed: true,
            bubbles: true,
            cancelable: false,
        }))

        this.populateMetadata()

        this.setAttribute('ready', true)
    }
    attributeChangedCallback(name, _, value) {
        if (name === 'ready' && value === 'true') {
            console.log(`Collation ${this.getAttribute('id')} ready.`)
        }
    }
    populateMetadata = () => {
        // For all child nodes that want to be annotated, populate them
        for (const el of this.querySelectorAll('[data-project]')) {
            const attr = el.getAttribute('data-project')

            // Deconstruct simple ('title') or complex ('metadata.date') expressions
            const data = attr.split('.').reduce((o, i) => o[i], this.data.project)
            if (data) {
                el.textContent = data
            } else {
                console.warn(`data-project parameter "${attr}" wasn't found in the JSON data for ${this.id}`)
            }

        }
    }
}
class CollationMember extends HTMLElement {

    connectedCallback() {
        const collation = this.collation
        this.id = collation.getAttribute('id')
        collation.addEventListener(COLLATION_READY_EVENT, this.ready, {
            passive: true,
            once: true,
        })
    }
    ready = () => {
        throw new Error("Method 'ready()' must be implemented.")
    }
    get collation() {
        return this.closest('collation-model')
    }
}

class SpreadViewer extends CollationMember {
    region = 'full'
    width = 600
    height = 800

    static get observedAttributes() {
        return ['index']
    }
    connectedCallback() {
        super.connectedCallback()
        this.width = this.getAttribute('width') || this.width
        this.height = this.getAttribute('height') || this.height
    }
    attributeChangedCallback(name, oldValue, value) {
        // Fire the render method only when the attribute has been dynamically updated
        if (name === 'index' && oldValue != undefined) {
           this.render()
        }
    }
    ready = () => {
        this.render()
    }
    render = () => {
        const index = +this.getAttribute('index')
        const verso = document.createElement('cacheable-image')
        verso.setAttribute('width', this.width)
        verso.setAttribute('height', this.height)

        const recto = document.createElement('cacheable-image')
        recto.setAttribute('width', this.width)
        recto.setAttribute('height', this.height)

        this.replaceChildren(...[verso, recto])
        const spread = this.collation.data.derived.linear[index]

        verso.setAttribute('src', iiif(spread[0].params.image.url,
            this.region,
            this.width,
            this.height
        ))
        recto.setAttribute('src', iiif(spread[1].params.image.url,
            this.region,
            this.width,
            this.height
        ))

    }
}

class NavStrip extends CollationMember {
    region = 'square'
    width = 40
    height = 40

    connectedCallback() {
        super.connectedCallback()
        this.width = this.getAttribute('width') || this.width
        this.height = this.getAttribute('height') || this.height
    }
    ready = () => {
        const viewer = this.collation.querySelector('spread-viewer')

        const strip = document.createElement('nav')
        let i = 0

        const items = this.collation.data.derived.linear.map((spread) => {
            const container = document.createElement('span')
            container.setAttribute("data-spread-index", i)
            container.addEventListener('click', () => viewer.setAttribute('index', container.getAttribute('data-spread-index')))
            for (const leaf of spread) {
                const img = document.createElement('cacheable-image')
                img.setAttribute('width', this.width)
                img.setAttribute("height", this.height)
                container.append(img)

                const url = iiif(leaf.params.image.url,
                    this.region,
                    this.width,
                    this.height
                )
                img.setAttribute('src', url)

            }
            i++
            return container
        })
        strip.append(...items)
        this.append(strip)
    }

}

class CachableImage extends HTMLElement {
    static get observedAttributes() {
        return ['src']
    }
    constructor() {
        super()
    }
    connectedCallback() {
        const img = document.createElement('img')
        img.width = this.getAttribute('width')
        img.height = this.getAttribute('height')
        // Display the temporary loading image
        img.src = "images/document-icon.png"
        this.append(img)
        this.img = img
    }
    attributeChangedCallback(name, _, value) {
        if (name === 'src') {
            const url = value
            cache.match(url).then((resp) => {
                if (resp) {
                    resp.blob().then((blob) => {
                        this.img.src = URL.createObjectURL(blob)
                    })
                } else {
                    fetch(new Request(url)).then((resp) => {
                        cache.put(url, resp.clone())
                        resp.blob().then((blob) => {
                            this.img.src = URL.createObjectURL(blob)
                        })

                    })
                }

            })
        }
    }
}

const iiif = (url, region, width, height, rotation="0", quality="default", format="jpg") => (
    `${url}/${region}/${width},${height}/${rotation}/${quality}.${format}`
)

customElements.define('collation-model', CollationModel)
customElements.define('nav-strip', NavStrip)
customElements.define('cacheable-image', CachableImage)
customElements.define('spread-viewer', SpreadViewer)