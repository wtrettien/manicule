import React from 'react'
import { Link } from 'react-router-dom'
import { OverlayTrigger, Tooltip, Glyphicon } from 'react-bootstrap'

import { EditionName } from 'metadata'
import { EditionContext } from 'containers/SiteContainer'

import styles from 'styles/Map.module.css'

interface MapViewProps {
    page: number
}
const MapView = ({ page }: MapViewProps) => {
    const context = React.useContext(EditionContext)
    const pages = context.pages
    const edition = context.edition as EditionName

    return (
        <div className={styles.blocks}>
            {[...pages.values()].map((p) => {
                const tour = p.tourItem
                return (
                    <span key={p.index} style={{ display: 'inline-block' }}>
                        <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip id={p.index.toString()}>{p.category}</Tooltip>}>
                            <Link to={`/reader/${edition}/${p.index}`}>
                                <span
                                    className={`
                        ${p.index === page ? styles.currentPage : ''}
                        ${tour ? 'has-tour' : ''}
                        ${styles.block}
                        `}
                                    style={{ background: p.color, color: p.color }}>
                                    {tour ? (
                                        <Glyphicon className={styles.glyphicon} glyph="bookmark" />
                                    ) : (
                                        '\u00A0'
                                    )}
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
