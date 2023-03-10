import React from 'react'

import { Grid, Button } from 'react-bootstrap'

import Quire from 'components/quire'
import styles from 'styles/Structure.module.css'

import { Quire as IQuire, LeafSide } from 'metadata'
import { EditionContext } from './SiteContainer'

const Structure = () => {
    const { structure, pages: pageData } = React.useContext(EditionContext)

    const quires = structure.quire

    const [side, setLeafSide] = React.useState<LeafSide>('recto')

    // Return an English-language representation of the structure
    const describeQuire = (quire: IQuire) => {
        const folios = quire.leaf.length
        let inserts = 0

        quire.leaf.forEach((leaf) => {
            leaf.page.forEach((page) => {
                if (pageData.get(page.index)?.signatures.includes('insertion')) {
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
                        <div className={styles.quireLabel}>
                            <h3>Quire: {quire.n}</h3>
                            {describeQuire(quire)}
                        </div>
                    </div>
                ))}
            </Grid>
        </>
    )
}

export default Structure
