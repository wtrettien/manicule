// Viewer for a single page (of a spread)
import React from 'react'
import { Row, Col, Glyphicon } from 'react-bootstrap'

import { getTourForPage } from '../utils/metadata'
import PageImage from './page-image'
import { EditionContext } from '../containers/SiteContainer'

interface PageProps {
    num: number
    category: string
    signatures: string
    color: string
    pos: any // FIXME
    description: string
    toggleZoom: any
    toggleTour: any
}
const Page = ({
    num,
    category,
    signatures,
    color,
    pos,
    description,
    toggleZoom,
    toggleTour
}: PageProps) => {
    const context = React.useContext(EditionContext)
    const edition = context.edition as string

    const tour = getTourForPage(edition, num)
    // The tour, if it exists, should open on the opposite side of the current page
    const tourSide = pos === 'verso' ? 'recto' : 'verso'
    const pageImage = <PageImage num={num} edition={edition} toggleZoom={toggleZoom} />

    return (
        <div className="page-panel">
            <div className="page-metadata">
                <Row>
                    {pos === 'recto' && (
                        <Col sm={8}>
                            {pageImage}
                            <label
                                className="metadata-label category-label"
                                style={{ background: color }}>
                                {category}
                            </label>
                        </Col>
                    )}
                    <Col sm={4}>
                        {tour ? (
                            <label
                                className="metadata-label tour-label"
                                onClick={() => toggleTour(tour, tourSide)}
                                style={{ color: color }}>
                                <Glyphicon glyph="bookmark" />
                            </label>
                        ) : (
                            <span>&nbsp;</span>
                        )}

                        <label className="metadata-label description-label">{description}</label>
                        <label className="metadata-label signatures-label">{signatures}</label>
                    </Col>
                    {pos === 'verso' && (
                        <Col sm={8}>
                            {pageImage}
                            <label
                                className="metadata-label category-label"
                                style={{ background: color }}>
                                {category}
                            </label>
                        </Col>
                    )}
                </Row>
            </div>
        </div>
    )
}

export default Page
