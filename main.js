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
        this.data.derived.linear =  this.data.derived.linear.filter((e) => e[0].params.image?.url)

        this.dispatchEvent(new CustomEvent(COLLATION_READY_EVENT, {
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

class SpreadNavigator extends HTMLElement {
    static get observedAttributes() {
        return ['hide']
    }
    constructor() {
        super()
        this.hide = false
        const opener = document.createElement('button')
        opener.setAttribute("data-opener", "true")
        opener.addEventListener('click', () => {
            // Toggle the value
            const newValue = this.getAttribute("hide") === "true" ? false : true
            this.setAttribute("hide", newValue)
        })
        this.append(opener)

    }
    connectedCallback() {
        if (!this.getAttribute('hide')) {
            this.setAttribute('hide', this.hide)
        }
    }
    attributeChangedCallback(name, oldValue, value) {
        switch (name) {
            case "hide": {
                const hide = this.getAttribute("hide") === "true" ? true : false

                if (hide) {
                    [...this.querySelectorAll('*:not(button[data-opener])')].map(el =>
                        el.classList.add("hide"))
                } else {
                    [...this.querySelectorAll('*:not(button[data-opener])')].map(el =>
                        el.classList.remove("hide"))
                }
                [...this.querySelectorAll('button[data-opener]')].map((opener) => opener.textContent = `${hide ? "Show" : "Hide"} this spread`)

                break;
            }
        }
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
        this.container = document.createElement('div')
        // Give the spread container a fixed height to prevent reflow during transitions
        this.container.style.height = `${this.height}.px`
        this.container.style.minWidth = `${this.width * 2}.px`
        this.append(this.container)
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
        verso.setAttribute('type', 'leaf')

        const recto = document.createElement('cacheable-image')
        recto.setAttribute('width', this.width)
        recto.setAttribute('height', this.height)
        recto.setAttribute('type', 'leaf')

        this.container.replaceChildren(...[verso, recto])
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

class LeafNav extends CollationMember {

    ready = () => {
        const button = document.createElement('button')
        button.textContent = this.getAttribute('direction')
        this.append(button)
        button.addEventListener('click', () => {
            const spread = this.collation.querySelector('spread-viewer')
            const current = +spread.getAttribute('index')
            if (this.getAttribute('direction') === 'next') {
                spread.setAttribute('index', current + 1)
            } else if (this.getAttribute('direction') === 'previous') {
                spread.setAttribute('index', current - 1)
            }
        })

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
                img.setAttribute('default', 'images/document-icon.png')
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
        this.mousedown = false
        this.zoomed = false
        this.selected = false
    }
    connectedCallback() {

        const img = document.createElement('img')
        img.width = this.getAttribute('width')
        img.height = this.getAttribute('height')

        // Display the temporary loading image if defined
        if (this.getAttribute("default")) {
            img.src = this.getAttribute('default')
        }

        // Set up mouse zoom/pan events
        if (this.getAttribute('type') === 'leaf') {
            const start = {
                x: 0,
                y: 0
            }
            const offset = {
                x: 0,
                y: 0
            } // The transform offset (from center)
            let scale = 1
            img.addEventListener('wheel', (e) => {
                if (this.selected) {
                    scale += e.deltaY * -0.01

                    // Restrict scale
                    scale = Math.min(Math.max(1, scale), 4)

                    // Apply scale transform
                    img.style.transform = `scale(${scale})`

                    if (scale > 1) {
                        this.zoomed = true
                        img.style.zIndex = 99
                    } else {
                        this.zoomed = false
                        img.style.zIndex = 1
                        img.style.translate = '0px 0px'
                    }
                }
            }, {
                passive: true
            })
            img.addEventListener('click', (e) => {
                e.stopPropagation()
                this.selected = !this.selected
                this.img.classList.toggle('selected')

            })
            img.addEventListener('mousedown', (e) => {
                this.mousedown = true
                start.x = e.clientX - offset.x
                start.y = e.clientY - offset.y
            })
            img.addEventListener('mouseup', () => {
                this.mousedown = false
            })

            img.addEventListener('mousemove', (e) => {
                if (this.mousedown && this.zoomed && this.selected) {
                    e.preventDefault()
                    offset.x = e.clientX - start.x
                    offset.y = e.clientY - start.y
                    img.style.translate = `${offset.x}px ${offset.y}px`
                }
            })

        }
        this.append(img)
        this.img = img
    }
    attributeChangedCallback(name, _, value) {
        switch (name) {
            case 'src': {
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
}

const iiif = (url, region, width, height, rotation = "0", quality = "default", format = "jpg") => (
    `${url}/${region}/${width},${height}/${rotation}/${quality}.${format}`
)

customElements.define('collation-model', CollationModel)
customElements.define('nav-strip', NavStrip)
customElements.define('cacheable-image', CachableImage)
customElements.define('spread-viewer', SpreadViewer)
customElements.define('leaf-nav', LeafNav)
customElements.define('spread-navigator', SpreadNavigator)

window.addEventListener(COLLATION_READY_EVENT, (e) => {
    // For any collation, start caching all of its full-size images
    const data = e.target.data
    for (const spread of data.derived.linear) {

        for (const leaf of spread) {
            const worker = new Worker('cache.js')
            const url = iiif(leaf.params.image.url,
                "full",
                "600",
                "800"
            )
            worker.postMessage({
                name: CACHE_NAME,
                url
            })
        }
    }
})

// Add cancel listeners to the parent
document.addEventListener('click', () => {
    [...document.querySelectorAll('.selected')].map((el) => {
        el.parentNode.selected = !el.parentNode.selected
        el.classList.toggle('selected')
    })
})

// ESC resets all zoom options
document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'Escape': {
            [...document.querySelectorAll('cacheable-image')].map((el) => {
                el.zoomed = false
                el.selected = false
                el.img.style.translate = '0px 0px'
                el.img.style.transform = 'scale(1)'
                el.img.classList.remove('selected')
                el.img.zIndex = 1


            })
        }
    }
})