// Reader for the book
import React from 'react'
import { animated, config, Transition } from 'react-spring'
import { Row, Col, Glyphicon } from 'react-bootstrap'
import { Link, useSearchParams } from 'react-router-dom'

import { EditionContext } from '../containers/SiteContainer'

import { PageData, TourItem, Page as PageType, LeafSide } from '../utils/metadata'

import Page from './page'
import Tour from './tour'

import { getImageUrl } from './page-image'
import PageZoom from './page-zoom'
import styles from '../styles/Reader.module.css'

interface ReaderProps {
    page: number
}

export type pageDir = 'next' | 'prev'
export type pageNum = number | null | undefined

export type TourModal = TourItem | undefined
export type ZoomModal = number | undefined

const Reader = ({ page }: ReaderProps) => {
    const context = React.useContext(EditionContext)
    const [tour, setTour] = React.useState<React.SetStateAction<TourModal>>(undefined)
    const [zoom, setZoom] = React.useState<React.SetStateAction<ZoomModal>>(undefined)

    const pages = context.pages as PageData
    const edition = context.edition as string
    const pageCount = Object.keys(pages).length

    const nextPage = Math.max(page + 2, 1)
    const prevPage = Math.min(page - 2, Object.keys(pages).length)
    const verso: PageType = pages[page]
    const recto: PageType | null = verso.index + 1 < pageCount ? pages[verso.index + 1] : null

    const hasNextPage = page < pageCount - 1 // Subtract one for the extra element
    const hasPrevPage = page > 1

    const [searchParams] = useSearchParams()

    // When the page renders, if the tour modal is open, update it
    React.useEffect(() => {
        const tourParam = searchParams.get('tour')
        if (tourParam) {
            setTour(pages[parseInt(tourParam as string, 10)].tourItem)
        } else {
            setTour(undefined)
        }
    }, [pages, searchParams])

    const renderPage = (page: PageType, leaf: LeafSide) => {
        return <Page page={page} leaf={leaf} setZoom={setZoom} setTour={setTour} />
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

    return (
        <div className={styles.bookContainer}>
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
                <Transition
                    items={zoom}
                    from={{ scale: 0 }}
                    enter={{ scale: 1 }}
                    leave={{ scale: 0 }}
                    delay={200}
                    config={config.stiff}>
                    {(styles, item) =>
                        item && (
                            <animated.div style={styles}>
                                <PageZoom
                                    url={getImageUrl(edition, zoom as number, false)}
                                    setZoom={setZoom}
                                />
                            </animated.div>
                        )
                    }
                </Transition>
            </Row>
        </div>
    )
}

export default Reader
