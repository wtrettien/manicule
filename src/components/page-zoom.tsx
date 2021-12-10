import React from 'react'

import { Panel, Well, Image, Button } from 'react-bootstrap'
import styles from '../styles/PageZoom.module.css'

interface PageZoomProps {
    url: string
    setZoom: (_: any) => void
}
const PageZoom = ({ url, setZoom }: PageZoomProps) => (
    <Panel className={styles.pageZoom}>
        <Well className={styles.well}>
            <label>
                Scroll around this pop-up to examine the page in detail.
                <Button onClick={() => setZoom(undefined)}>Close</Button>
            </label>
        </Well>
        <div className={styles.imgContainer}>
            <Image src={url} alt="Manuscript page" />
        </div>
    </Panel>
)

export default PageZoom
