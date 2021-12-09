// Tour components
import React from 'react'

import { Row, Col, Panel, Button, Glyphicon } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import { Side, TourItem, metadata } from '../utils/metadata'
import { EditionContext } from '../containers/SiteContainer'
import styles from '../styles/Tour.module.css'

interface TourProps {
    item: TourItem
    side: Side
    toggleTour: any
}
const Tour = ({ item, side, toggleTour }: TourProps) => {
    const context = React.useContext(EditionContext)
    const edition = context.edition as string
    const tour = metadata[edition].tour
    const index = tour.indexOf(item)
    const html = require(`../data/${edition}/tour/${item.page}.html`) // eslint-disable-line global-require

    const hasPrev = index > 0
    const hasNext = index < tour.length - 1

    const prevLink = hasPrev ? (
        <Link
            to={`/reader/${edition}/${metadata[tour[index - 1].page]}`}
            className={`${styles.left}`}>
            <Glyphicon glyph="arrow-left" /> Previous Tour Stop
        </Link>
    ) : null

    const nextLink = hasNext ? (
        <Link
            to={`/reader/${edition}/${metadata[tour[index + 1].page]}`}
            className={`${styles.right}`}>
            Next Tour Stop <Glyphicon glyph="arrow-right" />
        </Link>
    ) : null

    const tourExit = (
        <div className={styles.tourExit}>
            <Button
                className="close-modal"
                onClick={() => toggleTour({ item: undefined }, undefined)}>
                <Glyphicon glyph="remove" />
            </Button>
        </div>
    )

    const tourNav = (
        <div className={styles.tourNav}>
            <Row>
                <Col sm={6}>{prevLink}</Col>
                <Col sm={6}>{nextLink}</Col>
            </Row>
        </div>
    )

    return (
        <Panel
            bsClass={styles.tourPanel}
            className={side === 'recto' ? styles.recto : styles.verso}>
            {tourExit}
            <div className={styles.text} dangerouslySetInnerHTML={{ __html: html }} />
            {tourNav}
        </Panel>
    )
}

export default Tour
