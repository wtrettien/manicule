import React from 'react'

import Thumbnail from './thumbnail'
import { EditionName, LeafSide, metadata, Quire as IQuire } from '../utils/metadata'
import styles from '../styles/Structure.module.css'

interface QuireProps {
    quire: IQuire
    edition: EditionName
    side: LeafSide
}
const Quire = ({ quire, edition, side }: QuireProps) => {
    const index = side === 'recto' ? 0 : 1
    return (
        <div className={styles.quire}>
            {quire.leaf.map((leaf) => (
                <Leaf page={leaf.page[index].$.index} key={leaf.$.folio_number} edition={edition} />
            ))}
        </div>
    )
}

interface LeafProps {
    page: number
    edition: EditionName
}
const Leaf = ({ page, edition }: LeafProps) => {
    // Get page data for this
    const pageData = metadata[edition].pages[page]
    return <Thumbnail edition={edition} pageData={pageData} page={page} />
}

export default Quire
