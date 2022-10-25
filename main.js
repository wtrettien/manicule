class CollationModel extends HTMLElement {

    constructor() {
        super()
        const id =  this.getAttribute("id")

        // Get its data
        import(`./data/${id}/${id}.json`).then((data) => {
            console.log(data)
        })

    }
    connectedCallback() {


    }

}
customElements.define('collation-model', CollationModel)