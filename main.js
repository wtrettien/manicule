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

        this.data = await import(`./data/${id}/${id}.json`)
        localStorage.setItem(`collations-${id}`, JSON.stringify(this.data))
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

class MSTitle extends HTMLElement {

    connectedCallback() {
        const collation = this.closest('collation-model')
        this.id = collation.getAttribute('id')
        collation.addEventListener(COLLATION_READY_EVENT, this.ready, {
            passive: true,
            once: true,
        })
    }
    ready = () => {
        const collation = this.closest('collation-model')
        this.textContent = collation.data.project.title
    }
}
customElements.define('collation-model', CollationModel)