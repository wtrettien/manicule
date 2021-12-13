import React from 'react'
import { useDebouncedCallback } from 'use-debounce'

import Thumbnail from './thumbnail'
import { Leaf, LeafSide, PageData, Quire as IQuire } from '../utils/metadata'
import styles from '../styles/Structure.module.css'
import { EditionContext } from '../containers/SiteContainer'
import { rejects } from 'assert'

const ns = 'http://www.w3.org/2000/svg'

/**
 * Each Quire element will display one or more Leaves.
 */
interface QuireProps {
    quire: IQuire
    side: LeafSide
}
const Quire = ({ quire, side }: QuireProps) => {
    const pageData = React.useContext(EditionContext).pages as PageData

    const index = side === 'recto' ? 0 : 1
    const svgRef = React.useRef<SVGSVGElement>(null)

    const [leafRefs] = React.useState(() =>
        quire.leaf.map((l) => React.createRef<HTMLDivElement>())
    )

    const drawLines = () => {
        if (svgRef.current) {
            const svg = svgRef.current

            // Delete any previous svg children
            svg.innerHTML = ''

            // Get the positions of all the rendered leaf nodes in this quire
            quire.leaf.forEach((l, i) => {
                // Does this leaf have a conjoined leaf?
                const conjoinedId = l.$.conjoin && l.$.conjoin > l.$.n ? l.$.conjoin : null
                const conjoined = quire.leaf.filter((l) => l.$.n === conjoinedId)[0]

                if (conjoinedId) {
                    const left = leafRefs[i]
                    const right = leafRefs[quire.leaf.indexOf(conjoined)]

                    if (left.current && right.current) {
                        const lrect = left.current.getBoundingClientRect()
                        const rrect = right.current.getBoundingClientRect()

                        // Start and end coordinates for the lines
                        const startx = lrect.x + lrect.width / 2
                        const starty = 210
                        const endx = rrect.x + rrect.width / 2
                        const endy = 210

                        // Control points are based on the midpoint between left and right, plus the offset (`extra`)
                        const dist = (lrect.x + rrect.x + rrect.width) / 2

                        // Height of the control points should be the same, and relative to the distance between the nodes,
                        // clamped so they start low enough to see (0) but don't descend into the nodes (150)
                        const relativeDistance = lrect.x - rrect.x / 1.8
                        const height = Math.max(20, Math.min(150 + relativeDistance, 170))

                        const leftControlX = Math.max(dist - dist * 4, startx)
                        const rightControlX = Math.min(endx, dist + dist * 4)

                        const path = document.createElementNS(ns, 'path')

                        // Draw a cubic bezier curve with two control points relative to the distance between the nodes
                        const d = `M ${startx} ${starty} C ${leftControlX} ${height}, ${rightControlX} ${height}, ${endx} ${endy}`

                        path.setAttributeNS(null, 'd', d)

                        svg.appendChild(path)
                    }
                }
            })
        }
    }
    const debounced = useDebouncedCallback(drawLines, 100)
    React.useLayoutEffect(() => {
        drawLines()
        window.addEventListener('resize', debounced)
        return () => {
            window.removeEventListener('resize', debounced)
        }
    })
    return (
        <div className={styles.quire}>
            <svg ref={svgRef}></svg>
            {quire.leaf.map((leaf, i) => {
                const page = leaf.page[index].$.index
                const key = leaf.$.folio_number
                const ref = leafRefs[i]

                return (
                    <div className={styles.leaf} key={key} ref={ref}>
                        <Thumbnail pageData={pageData[page]} page={page} />
                    </div>
                )
            })}
        </div>
    )
}

export default Quire
