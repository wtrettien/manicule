import React from 'react'

import { Grid, Row, Col, Button } from 'react-bootstrap'

import Quire from '../components/quire'
import styles from '../styles/Structure.module.css'

import { Structure as IStructure, Quire as IQuire, PageData, LeafSide } from '../utils/metadata'
import { EditionContext } from './SiteContainer'

const Structure = () => {
    const context = React.useContext(EditionContext)
    const structure = context.structure as IStructure
    const pageData = context.pages as PageData
    const quires = structure.quire

    const [side, setLeafSide] = React.useState<LeafSide>('recto')

    // window.requestAnimationFrame(() => {
    //     const quires = this.structure.quire
    //     quires.forEach((quire) => {
    //         quire.leaf.forEach((leaf) => {
    //             const conjoined = quire.leaf.filter(
    //                 (l) =>
    //                     l.$.conjoin === leaf.$.n &&
    //                     parseInt(leaf.$.folio_number, 10) < parseInt(l.$.folio_number, 10)
    //             )
    //             if (conjoined.length > 0) {
    //                 this.drawConjoined(index, leaf, conjoined)
    //             } else {
    //                 const page = leaf.page[index].$.index
    //                 // const data = this.pageData[page]
    //                 if (leaf.$.conjoin === null) {
    //                     this.drawInsertion(page)
    //                 }
    //             }
    //         })
    //     })
    // })

    // TODO come back to this with Benlowes

    // Draw an insertion line at a given point
    // drawInsertion(page: number, length = 45, width = 86) {
    //     const pageEl = document.getElementById(`page-${page}`)
    //     const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    //     svg.classList.add('insertion-line')
    //     svg.setAttribute('width', width.toString())
    //     svg.setAttribute('height', length.toString())
    //     const marker = document.createElementNS('http://www.w3.org/2000/svg', 'defs')
    //     marker.innerHTML = `<marker id="triangle"
    // viewBox="0 0 10 10"
    // markerWidth="7" markerHeight="7" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
    // <path d="M0,0 L0,6 L9,3 z" />
    // </marker>`
    //     svg.appendChild(marker)
    //     pageEl?.parentNode?.appendChild(svg)

    //     const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    //     line.setAttribute('x1', (width / 2).toString())
    //     line.setAttribute('x2', (width / 2).toString())
    //     line.setAttribute('y2', length.toString())
    //     svg.appendChild(line)
    // }

    // Return an English-language representation of the structure
    const describeQuire = (quire: IQuire) => {
        const folios = quire.leaf.length
        let inserts = 0

        quire.leaf.forEach((leaf) => {
            leaf.page.forEach((page) => {
                if (pageData[page.$.index].signatures.includes('insertion')) {
                    inserts += 1
                }
            })
        })
        // Divide the number of inserts by 2 because each page is counted twice
        inserts /= 2

        return (
            <label>
                Contains {folios} folio{folios >= 2 ? 's' : ''}
                {inserts > 0 ? ` and ${inserts} insertion${inserts > 1 ? 's' : ''}` : ''}
            </label>
        )
    }

    return (
        <>
            <div className={styles.structureNav}>
                <Button
                    onClick={() => {
                        console.log(side)
                        setLeafSide(side === 'recto' ? 'verso' : 'recto')
                    }}>
                    Showing {side} side
                </Button>
            </div>
            <Grid className={styles.structure}>
                {quires.map((quire, index) => (
                    <div key={index} id={`row-${index}`}>
                        <div>
                            <Quire quire={quire} side={side} />
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <h4>Quire: {quire.$.n}</h4>
                            {describeQuire(quire)}
                        </div>
                    </div>
                ))}
            </Grid>
        </>
    )
}

export default Structure
