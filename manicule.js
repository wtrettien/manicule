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

        const rectos = Object.entries(this.data.Rectos).map(([id, data]) => {
            data.id = +id
            return data
        })
        const versos = Object.entries(this.data.Versos).map(([id, data]) => {
            data.id = +id
            return data
        })

        this.data.derived.rectos = {}
        this.data.derived.versos = {}
        for (const leaf of rectos) {
            this.data.derived.rectos[leaf.id] = leaf
        }
        for (const leaf of versos) {
            this.data.derived.versos[leaf.id] = leaf
        }
        this.data.derived.leaves = Object.entries(this.data.Leafs).map(([id, data]) => {
            data.id = +id
            return data
        })

        this.data.derived.linear = versos.map((e, i) => [e, rectos[i]])
        this.data.derived.linear = this.data.derived.linear.filter((e) => e[0].params.image?.url)

        this.data.derived.quires = []
        for (const [id, data] of Object.entries(this.data.Groups)) {

            if (data.params.type === "Quire") {
                data.id = +id
                data.leaves = []
                // Get leaf ids
                for (const leafIdLabel of data.memberOrders.filter(id => id.includes("Leaf_"))) {
                    const leafId = +leafIdLabel.split("Leaf_")[1]
                    data.leaves.push(leafId)
                }
                this.data.derived.quires.push(data)
            }

        }

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

class StructureView extends CollationMember {
    region = 'square'
    width = 50
    height = 50
    ns = 'http://www.w3.org/2000/svg'

    connectedCallback() {
        super.connectedCallback()
        this.container = document.createElement('section')
        this.append(this.container)
    }
    ready = () => {

        for (const quire of this.collation.data.derived.quires) {
            console.log(quire)

            const row = document.createElement('div')
            this.container.append(row)
            const header = document.createElement('h2')
            header.innerText = `Quire ${quire.id}`
            row.append(header)
            const svg = document.createElementNS(this.ns, 'svg')
            row.append(svg)

            for (const leafId of quire.leaves) {
                const leaf = this.collation.data.derived.leaves[leafId - 1] // leaves is an array so -1
                // TODO allow flipping to verso
                const recto = this.collation.data.derived.rectos[leaf.rectoOrder]

                const img = document.createElement('structure-leaf-image')
                img.setAttribute('width', this.width)
                img.setAttribute("height", this.height)
                img.setAttribute('default', 'images/document-icon.png')
                img.setAttribute('data-leaf-id', leafId)
                img.setAttribute('data-conjoined-leaf-id', leaf.conjoined_leaf_order)
                img.setAttribute('data-mode', leaf.params.type.toLowerCase())

                // Get the URL for this leaf
                const url = iiif(recto.params.image.url,
                    this.region,
                    this.width,
                    this.height
                )
                img.setAttribute('src', recto.params.image.url ? url : img.getAttribute('default'))
                row.append(img)
            }
            const svgRect = svg.getBoundingClientRect()

            const left = row.querySelector('structure-leaf-image:first-of-type').getBoundingClientRect()
            const right = row.querySelector('structure-leaf-image:last-of-type').getBoundingClientRect()
            const center = (right.right - left.x) / 2

            let i = 0
            const arcHeightIncrement = 15

            // Loop over the elements as rendered to draw their lines
            const leaves = row.querySelectorAll('structure-leaf-image[data-conjoined-leaf-id]')

            for (const leaf of leaves) {
                // const conjoin = row.querySelector(`structure-leaf-image[data-leaf-id="${leaf.getAttribute("data-conjoined-leaf-id")}"]`)
                const lrect = leaf.getBoundingClientRect()

                // Start and end coordinates for the lines
                const startx = lrect.x - svgRect.left + (lrect.width / 2)
                const starty = svgRect.height

                let height = 0
                // Take the index up until we hit the midpoint
                if (i < leaves.length / 2) {
                    height = i * arcHeightIncrement
                }
                else {
                    height = (leaves.length - i - 1) * arcHeightIncrement
                }
                height = height + 5

                const path = document.createElementNS(this.ns, 'path')

                // Draw a cubic bezier curve with two control points relative to the distance between the nodes
                const d = `M ${startx} ${starty} C ${startx} ${height}, ${center} ${height}, ${center} ${height}`
                if (leaf.getAttribute("data-mode") === "missing") {
                    path.setAttribute("stroke-dasharray", "5,5")
                }

                path.setAttributeNS(null, 'd', d)

                svg.appendChild(path)
                i++
            }
        }
    }
}
class SpreadNavigator extends HTMLElement {

}
class SpreadViewer extends CollationMember {
    region = 'full'
    width = 1750
    height = 2423

    static get observedAttributes() {
        return ['index']
    }
    connectedCallback() {
        super.connectedCallback()
        this.width = this.getAttribute('width') || this.width
        this.height = this.getAttribute('height') || this.height
        this.default = this.getAttribute('default') || 'images/loading-icon.svg'

        this.container = document.createElement('div')
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
        verso.setAttribute('default', this.default)

        const recto = document.createElement('cacheable-image')
        recto.setAttribute('width', this.width)
        recto.setAttribute('height', this.height)
        recto.setAttribute('type', 'leaf')
        recto.setAttribute('default', this.default)

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
    width = 109
    height = 151

    connectedCallback() {
        super.connectedCallback()
        this.width = +this.getAttribute('width') || this.width
        this.height = +this.getAttribute('height') || this.height
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
        return ['src', 'visible']
    }
    constructor() {
        super()
        this.mousedown = false
        this.zoomed = false
        this.selected = false
        this.observer = new IntersectionObserver((entries) => {
            entries.map((entry) => {
                if (entry.isIntersecting) {
                    entry.target.setAttribute('visible', true)
                    this.observer.unobserve(entry.target)
                }
            })
        })
        this.observer.observe(this)

    }

    connectedCallback() {

        const img = document.createElement('img')
        img.width = +this.getAttribute('width')
        img.height = +this.getAttribute('height')


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
            case 'visible': {
                const url = this.getAttribute('src')
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

class StructureLeafImage extends CachableImage {
    connectedCallback() {
        super.connectedCallback()
        this.style.width = `${this.img.width}px`
        this.style.height = `${this.img.height}px`
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
customElements.define('structure-view', StructureView)
customElements.define('structure-leaf-image', StructureLeafImage)

// Figure out how to do this intelligently
// window.addEventListener(COLLATION_READY_EVENT, (e) => {
//     setTimeout(() => {
//         // For any collation, start caching all of its full-size images
//         const worker = new Worker('cache.js')
//         const data = e.target.data
//         for (const spread of data.derived.linear) {

//             for (const leaf of spread) {


//                 const url = iiif(leaf.params.image.url,
//                     "full",
//                     "1750",
//                     "2423"
//                 )
//                 worker.postMessage({
//                     name: CACHE_NAME,
//                     url
//                 })
//             }
//         }
//     }, 5000)
// })

// Add cancel listeners to the parent
document.addEventListener('click', () => {
    [...document.querySelectorAll('.selected')].map((el) => {
        el.parentNode.selected = !el.parentNode.selected
        el.classList.toggle('selected')
    })
})

// ESC resets all zoom options
document.addEventListener('keydown', (e) => {
    switch (e.key) {
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