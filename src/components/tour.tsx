import React from 'react'

import { Row, Col, Panel, Button, Glyphicon } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import { TourItem, LeafSide } from 'utils/metadata'
import { EditionContext } from 'containers/SiteContainer'
import styles from 'styles/Tour.module.css'

import { TourModal } from './reader'

/**
 * Tour: an annotated popup that can appear next to page information.
 *
 * Tours are provided by specifying a JSON file, tour.json, that correlates a tour HTML
 * blob with a specific page in the manuscript. This HTML page will be loaded as-is and imported
 * into the tour modal.
 *
 * Reference images from within a tour page relative to the root of the public/ folder,
 * but exclude the "public" part of the path.
 *
 * @example for the real file public/images/book/default/tour/caxton.jpg:
 *
 *     <img
 *       src="images/book/default/tour/caxton.jpg"
 *       alt="Caxton's woodcut of the Cook" />
 *
 * @param item The Tour item from the JSON file
 * @param side Recto or Verso; the side of the page on which the tour item will be displayed
 * @param setTour the state setter to control opening or closing the tour modal
 * @returns the tour modal
 */

interface TourProps {
    item: TourItem
    side: LeafSide
    setTour: (_: TourModal) => void
}
const Tour = ({ item, side, setTour }: TourProps) => {
    const { edition, tour, pages } = React.useContext(EditionContext)
    const index = tour.indexOf(item)

    const hasPrev = index > 0
    const hasNext = index < tour.length - 1

    const nextPage = () => pages.get(tour[index + 1].page)?.index
    const prevPage = () => pages.get(tour[index - 1].page)?.index

    const [tourHtml, setTourHtml] = React.useState(null)

    // Open the tour HTML as raw data, to avoid interpolating any tags inside like images
    React.useEffect(() => {
        import(`!!raw-loader!../data/${edition}/tour/${item.page}.html`)
            .then((html) => {
                setTourHtml(html.default)
            })
            .catch((err) => console.error(err))
    }, [edition, item.page])

    const prevLink = hasPrev ? (
        <Link
            to={`/reader/${edition}/${prevPage()}?tour=${prevPage()}`}
            className={`${styles.left}`}>
            <Glyphicon glyph="arrow-left" /> Previous Tour Stop
        </Link>
    ) : null

    const nextLink = hasNext ? (
        <Link
            to={`/reader/${edition}/${nextPage()}?tour=${nextPage()}`}
            className={`${styles.right}`}>
            Next Tour Stop <Glyphicon glyph="arrow-right" />
        </Link>
    ) : null

    const tourExit = (
        <div className={styles.tourExit}>
            <Button className="close-modal" onClick={() => setTour(undefined)}>
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

    return tourHtml ? (
        // Display the panel on the opposite side of the screen relative to the page
        // referred to by the tour
        <Panel bsClass={styles.tourPanel} className={side === 'recto' ? styles.left : styles.right}>
            {tourExit}
            <div className={styles.text} dangerouslySetInnerHTML={{ __html: tourHtml }} />
            {tourNav}
        </Panel>
    ) : null
}

export default Tour
