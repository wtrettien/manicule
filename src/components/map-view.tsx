import React from 'react'
import { Link } from 'react-router-dom'
import { OverlayTrigger, Tooltip, Glyphicon } from 'react-bootstrap'

import { EditionName, getTourForPage, Page } from '../utils/metadata'
import { EditionContext } from '../containers/SiteContainer'

interface MapViewProps {
    page: number
}
const MapView = ({ page }: MapViewProps) => {
    const context = React.useContext(EditionContext)
    const pages = context.pages as Page[]
    const edition = context.edition as EditionName

    return (
        <div className="map-blocks">
            {pages.map((p) => {
                const tour = getTourForPage(edition, p.index)
                return (
                    <span key={p.index} style={{ display: 'inline-block' }}>
                        <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip id={p.index.toString()}>{p.category}</Tooltip>}>
                            <Link to={`/reader/${edition}/${p.index}`}>
                                <span
                                    className={`
                        ${p.index === page ? 'current-page' : ''}
                        ${tour ? 'has-tour' : ''}
                        map-block
                        `}
                                    style={{ background: p.color, color: p.color }}>
                                    {tour ? <Glyphicon glyph="bookmark" /> : '\u00A0'}
                                </span>
                            </Link>
                        </OverlayTrigger>
                    </span>
                )
            })}
        </div>
    )
}

export default MapView
