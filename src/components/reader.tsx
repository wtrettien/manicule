// Reader for the book
import React from 'react'
// import { Motion, spring, presets } from 'react-motion'

import { Row, Col, Glyphicon } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import { EditionContext } from '../containers/SiteContainer'

import { PageData, TourItem, Page as PageType, LeafSide } from '../utils/metadata'

import Page from './page'
// import PageZoom from './page-zoom'
import Tour from './tour'

import styles from '../styles/Reader.module.css'

interface ReaderProps {
    page: number
}

export type pageDir = 'next' | 'prev'
export type pageNum = number | null | undefined

export type TourModal = TourItem | undefined

const Reader = ({ page }: ReaderProps) => {
    const context = React.useContext(EditionContext)
    const [tour, setTour] = React.useState<React.SetStateAction<TourModal>>(undefined)
    const [zoomIsOpen, setZoomIsOpen] = React.useState<React.SetStateAction<boolean>>(false)

    const pages = context.pages as PageData
    const edition = context.edition as string
    const pageCount = Object.keys(pages).length

    const nextPage = Math.max(page + 2, 1)
    const prevPage = Math.min(page - 2, Object.keys(pages).length)
    const verso: PageType = pages[page]
    const recto: PageType | null = verso.index + 1 < pageCount ? pages[verso.index + 1] : null

    const hasNextPage = page < pageCount - 1 // Subtract one for the extra element
    const hasPrevPage = page > 1

    // UNSAFE_componentWillReceiveProps(props: ReaderProps) {
    //     // // When the page loads, if the tour modal is open, update it
    //     // if (this.state.tour.item !== undefined) {
    //     //     const tour = getTourForPage(props.edition, props.page)
    //     //     if (tour) {
    //     //         this.toggleTour(tour, 'recto')
    //     //     }
    //     // }
    // }

    const renderPage = (page: PageType, leaf: LeafSide) => {
        return <Page page={page} leaf={leaf} toggleZoom={setZoomIsOpen} setTour={setTour} />
    }

    const renderLink = (page: pageNum, dir: pageDir) => {
        if (dir === 'prev' && hasPrevPage) {
            return (
                <Link
                    to={`/reader/${edition}/${page}`}
                    className={`${styles.bookNav} ${styles.left}`}>
                    <Glyphicon glyph="arrow-left" /> Previous Spread
                </Link>
            )
        } else if (dir === 'next' && hasNextPage) {
            return (
                <Link
                    to={`/reader/${edition}/${page}`}
                    className={`${styles.bookNav} ${styles.right}`}>
                    Next Spread <Glyphicon glyph="arrow-right" />
                </Link>
            )
        }
        return null
    }

    // showZoom = () => (
    //     <Motion
    //         defaultStyle={{ scale: this.state.zoomUrl ? 0 : 1 }}
    //         style={{ scale: spring(1, presets.stiff) }}>
    //         {(style) => (
    //             <PageZoom
    //                 url={this.state.zoomUrl}
    //                 toggleZoom={this.toggleZoom}
    //                 style={{
    //                     transform: `scale(${style.scale})`
    //                 }}
    //             />
    //         )}
    //     </Motion>
    // )

    return (
        <div className={styles.bookContainer}>
            {/* {this.state.zoomUrl ? this.showZoom() : null} */}

            <Row>
                <Col sm={6}>{renderLink(prevPage, 'prev')}</Col>
                <Col sm={6}>{renderLink(nextPage, 'next')}</Col>
            </Row>

            <Row>
                {tour && (
                    <Tour
                        side={(tour as TourItem).leaf}
                        item={tour as TourItem}
                        setTour={setTour}
                    />
                )}
                <Col sm={6} className={styles.verso}>
                    {renderPage(verso, 'verso')}
                </Col>
                <Col sm={6} className={styles.recto}>
                    {recto && renderPage(recto, 'recto')}
                </Col>
            </Row>
        </div>
    )
}

export default Reader
