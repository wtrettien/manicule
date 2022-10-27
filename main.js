const COLLATION_READY_EVENT = 'collation-ready'

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

        // Get its data and serialize it to local storage

        const resp = await fetch(`./data/${id}/${id}.json`)
        this.data = await resp.json()

        // localStorage.setItem(`collations-${id}`, JSON.stringify(this.data))

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
class NavStrip extends CollationMember {
    constructor() {
        super()
        this.setAttribute('iiif-region', 'square')
        this.setAttribute('iiif-width', 40)
        this.setAttribute('iiif-height', 40)
        this.setAttribute('iiif-rotation', 0)
        this.setAttribute('iiif-quality', 'default')
        this.setAttribute('iiif-format', 'jpg')
    }
    ready = async () => {
        const cacheName = `manicule-${this.collation.id}`
        //caches.delete(cacheName)
        const cache = await caches.open(cacheName)

        const strip = document.createElement('nav')
        const collation = this.collation
        const rectos = Object.values(collation.data.Rectos)
        const versos = Object.values(collation.data.Versos)
        const leaves = versos.map((e, i) => [e, rectos[i]])

        const items = leaves.map((spread) => {
            const container = document.createElement('span')
            for (const leaf of spread) {
                const img = document.createElement('img')
                img.width = this.getAttribute('iiif-width')
                img.height = this.getAttribute('iiif-height')

                // Display the temporary loading image
                img.src = "/images/document-icon.png"
                container.append(img)

                const url = iiif(leaf.params.image.url,
                    this.getAttribute('iiif-region'),
                    this.getAttribute('iiif-width'),
                    this.getAttribute('iiif-height'),
                    this.getAttribute('iiif-rotation'),
                    this.getAttribute('iiif-quality'),
                    this.getAttribute('iiif-format'))

                cache.match(url).then((resp) => {
                    if (resp) {
                        console.log("Loading from cache")
                        resp.blob().then((blob) => {
                            img.src = URL.createObjectURL(blob)
                        })
                    } else {
                        console.log('fetching')
                        fetch(new Request(url)).then((resp) => {
                            cache.put(url, resp.clone())
                            resp.blob().then((blob) => {
                                img.src = URL.createObjectURL(blob)
                            })

                        })
                    }

                })

            }
            return container
        })
        strip.append(...items)
        this.append(strip)
    }

}

const iiif = (url, region, width, height, rotation, quality, format) => (
    `${url}/${region}/${width},${height}/${rotation}/${quality}.${format}`
)

customElements.define('collation-model', CollationModel)
customElements.define('nav-strip', NavStrip)