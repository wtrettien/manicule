import React from 'react'
import { Link } from 'react-router-dom'
import { OverlayTrigger, Tooltip, Button, Glyphicon } from 'react-bootstrap'

import { EditionContext } from 'containers/SiteContainer'
import { EditionName, Page } from 'utils/metadata'
import styles from 'styles/Thumbnail.module.css'

import { getImageUrl } from './page-image'

interface ThumbnailProps {
    page: Page
    tref?: React.RefObject<HTMLDivElement>
}
const Thumbnail = ({ page, tref }: ThumbnailProps) => {
    const { index, color, signatures, category } = page
    const edition = React.useContext(EditionContext).edition as EditionName

    const pos = index % 2 === 0 ? 'recto' : 'verso'
    const img = getImageUrl(edition, index, true)

    const cls = `${styles.navThumbnail} thumbnail-${index} ${pos} ${
        index === page.index || index === page.index + 1 ? styles.isCurrent : ''
    }`
    const tour = page.tourItem

    const tourLabel = tour ? (
        <label className={`metadata-label tour-label has-tour ${styles.hasTour}`}>
            <span style={{ color: `${color}` }}>
                <Glyphicon glyph="bookmark" className={styles.bookmark} />
            </span>
        </label>
    ) : null

    return (
        <div className={cls} style={{ borderBottom: `10px solid ${color}` }} ref={tref}>
            <OverlayTrigger
                key={page.index}
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
                        style={{ backgroundImage: `url(${img})` }}></Button>
                    {tourLabel}
                </Link>
            </OverlayTrigger>
        </div>
    )
}

export default Thumbnail
