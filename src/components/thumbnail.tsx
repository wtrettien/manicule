import React from 'react'
import { Link } from 'react-router-dom'
import { OverlayTrigger, Tooltip, Button, Glyphicon } from 'react-bootstrap'

import { EditionName, getTourForPage, Page } from '../utils/metadata'
import { getImageUrl } from './page-image'
import styles from '../styles/Thumbnail.module.css'

interface ThumbnailProps {
    pageData: Page
    edition: EditionName
    page: number
}
const Thumbnail = ({ pageData, edition, page }: ThumbnailProps) => {
    const { index, color, signatures, category } = pageData

    const pos = index % 2 === 0 ? 'recto' : 'verso'
    const img = getImageUrl(edition, index, true)

    const cls = `${styles.navThumbnail} thumbnail-${index} ${pos} ${
        index === page || index === page + 1 ? styles.isCurrent : ''
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
                    <Tooltip id={index as unknown as string}>
                        {signatures} - {category}
                    </Tooltip>
                }>
                <Link to={`/reader/${edition}/${index}`}>
                    <Button
                        id={`page-${index}`}
                        bsClass={styles.thumbnailImage}
                        style={{ backgroundImage: `url(${img.default})` }}></Button>
                    {tourLabel}
                </Link>
            </OverlayTrigger>
        </div>
    )
}

export default Thumbnail
