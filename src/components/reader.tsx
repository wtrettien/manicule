// Reader for the book
import React from 'react'
import { animated, Transition } from 'react-spring'
import { Row, Col, Glyphicon } from 'react-bootstrap'
import { Link, useSearchParams } from 'react-router-dom'

import { EditionContext } from 'containers/SiteContainer'

import { TourItem, Page as PageType, LeafSide } from 'metadata'
import styles from 'styles/Reader.module.css'

import Page from './page'
import Tour from './tour'

import { getImageUrl } from './page-image'
import PageZoom from './page-zoom'

interface ReaderProps {
    page: number
}

export type pageDir = 'next' | 'prev'
export type pageNum = number | null | undefined

export type TourModal = TourItem | undefined
export type ZoomModal = number | undefined

const Reader = ({ page }: ReaderProps) => {
    const { pages, edition } = React.useContext(EditionContext)
    const [tour, setTour] = React.useState<TourModal>(undefined)
    const [zoom, setZoom] = React.useState<ZoomModal>(undefined)

    const nextPage = Math.max(page + 2, 1)
    const prevPage = Math.min(page - 2, Object.keys(pages).length)
    const verso = pages.get(page)
    const versoIndex = verso?.index || 0

    const recto = versoIndex + 1 < pages.size ? pages.get(versoIndex + 1) : null
    const hasNextPage = page < pages.size - 1 // Subtract one for the extra element
    const hasPrevPage = page > 1

    const [searchParams] = useSearchParams()

    // When the page renders, if the tour modal is open, update it
    React.useEffect(() => {
        const tourParam = searchParams.get('tour')
        if (tourParam) {
            setTour(pages.get(parseInt(tourParam as string, 10))?.tourItem)
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
        <>
            <Row>
                <Col sm={6}>{renderLink(prevPage, 'prev')}</Col>
                <Col sm={6}>{renderLink(nextPage, 'next')}</Col>
            </Row>

            <Row>
                <Col sm={6} className={styles.verso}>
                    {verso && renderPage(verso, 'verso')}
                </Col>
                <Col sm={6} className={styles.recto}>
                    {recto && renderPage(recto, 'recto')}
                </Col>
                {tour && <Tour side={tour.leaf} item={tour} setTour={setTour} />}

                <Transition
                    items={zoom}
                    from={{ scale: 0 }}
                    enter={{ scale: 1 }}
                    leave={{ scale: 0 }}
                    delay={0}
                    onStart={() => {
                        const navstrip = document.getElementById('nav-strip')
                        navstrip?.classList.add('inactive')
                    }}
                    onRest={() => {
                        const navstrip = document.getElementById('nav-strip')
                        navstrip?.classList.remove('inactive')
                    }}
                    config={{ mass: 1, tension: 210, friction: 20, clamp: true }}>
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
        </>
    )
}

export default Reader
