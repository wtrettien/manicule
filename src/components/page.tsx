// Viewer for a single page (of a spread)
import React from 'react'
import { Row, Col, Glyphicon } from 'react-bootstrap'

import { LeafSide, Page as PageType } from '../utils/metadata'
import PageImage from './page-image'
import { EditionContext } from '../containers/SiteContainer'

import styles from '../styles/Page.module.css'
import { TourModal } from './reader'

interface PageProps {
    page: PageType
    leaf: LeafSide
    toggleZoom: any
    setTour: (_: TourModal) => void
}
const PageViewer = ({ page, leaf, toggleZoom, setTour }: PageProps) => {
    const context = React.useContext(EditionContext)
    const edition = context.edition as string

    const tour = page.tourItem
    if (tour) {
        tour.leaf = leaf
    }
    const pageImage = <PageImage num={page.index} edition={edition} toggleZoom={toggleZoom} />

    return (
        <div className={styles.panel}>
            <div className={styles.metadata}>
                <Row>
                    {leaf === 'recto' && (
                        <Col sm={8}>
                            {pageImage}
                            <label
                                className="metadata-label category-label"
                                style={{ background: page.color }}>
                                {page.category}
                            </label>
                        </Col>
                    )}
                    <Col sm={4}>
                        {/* Show the tour icon if available */}
                        {tour ? (
                            <label
                                className="metadata-label tour-label"
                                onClick={() => setTour(tour)}
                                style={{ color: page.color }}>
                                <Glyphicon glyph="bookmark" className={styles.tourOpener} />
                            </label>
                        ) : (
                            <span>&nbsp;</span>
                        )}

                        <label className="metadata-label description-label">
                            {page.description}
                        </label>
                        <label className="metadata-label signatures-label">{page.signatures}</label>
                    </Col>
                    {leaf === 'verso' && (
                        <Col sm={8}>
                            {pageImage}
                            <label
                                className="metadata-label category-label"
                                style={{ background: page.color }}>
                                {page.category}
                            </label>
                        </Col>
                    )}
                </Row>
            </div>
        </div>
    )
}

export default PageViewer
