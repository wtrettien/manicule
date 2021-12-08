import React from 'react'
import { Link } from 'react-router-dom'
import { OverlayTrigger, Tooltip, Button, Glyphicon } from 'react-bootstrap'

import { EditionName, getTourForPage, Page } from '../utils/metadata'
import { getImageUrl } from './page-image'

interface ThumbnailProps {
    pageData: Page
    edition: EditionName
    currentPage: number
}
const Thumbnail = ({ pageData, edition, currentPage }: ThumbnailProps) => {
    const { index, color, signatures, category } = pageData

    const pos = index % 2 === 0 ? 'recto' : 'verso'
    const img = getImageUrl(edition, index, true)

    const cls = `nav-thumbnail thumbnail-${index} ${pos} ${
        index === currentPage || index === currentPage + 1 ? 'is-current' : ''
    }`
    const tour = getTourForPage(edition, index)

    const tourLabel = tour ? (
        <label className="metadata-label tour-label has-tour">
            <span style={{ color: `${color}` }}>
                <Glyphicon glyph="bookmark" />
            </span>
        </label>
    ) : null

    return (
        <div className={cls} style={{ borderBottom: `10px solid ${color}` }}>
            <OverlayTrigger
                key={pageData.index}
                placement="top"
                overlay={
                    <Tooltip>
                        {signatures} - {category}
                    </Tooltip>
                }>
                <Link to={`/reader/${edition}/${index}`}>
                    <Button
                        id={`page-${index}`}
                        bsClass="page-thumbnail"
                        style={{ backgroundImage: `url(${img.default})` }}></Button>
                    {tourLabel}
                </Link>
            </OverlayTrigger>
        </div>
    )
}

export default Thumbnail
