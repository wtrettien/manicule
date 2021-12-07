// Reader for the book
import React from 'react'
// import { Motion, spring, presets } from 'react-motion'

import { Row, Col, Glyphicon } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { EditionContext } from '../containers/SiteContainer'

import { setTourItem } from '../reducers/tour-item'
import { getTourForPage } from '../utils/metadata'
// import Page from './page'
// import PageZoom from './page-zoom'
// import TourItem from './tour-item'

interface ReaderProps {
    pages: any
    page: number
    setTourItem: any
}
interface ReaderState {
    zoomUrl?: string
    tour?: any
    tourSide?: any
}

export type pageDir = 'next' | 'prev'
export type pageNum = number | null | undefined

export class Reader extends React.Component<ReaderProps, ReaderState> {
    static contextType = EditionContext

    constructor(props: ReaderProps) {
        super(props)

        this.state = {
            zoomUrl: undefined,
            tour: { item: undefined },
            tourSide: undefined
        }
    }
    componentWillReceiveProps(props: ReaderProps) {
        // // When the page loads, if the tour modal is open, update it
        // if (this.state.tour.item !== undefined) {
        //     const tour = getTourForPage(props.edition, props.page)
        //     if (tour) {
        //         this.toggleTour(tour, 'recto')
        //     }
        // }
    }
    getPagination(dir: pageDir) {
        if (dir === 'next') {
            return this.hasNextPage()
        }
        return this.hasPrevPage()
    }

    getPage(page: pageNum, leaf: any) {
        if (page && page > 0) {
            return (
                <></>
                // <Page
                //     num={page}
                //     pos={leaf}
                //     toggleZoom={this.toggleZoom}
                //     toggleTour={this.toggleTour}
                //     {...this.props.pages[page]}
                // />
            )
        }
        return null
    }

    getLink(page: pageNum, dir: pageDir) {
        if (dir === 'prev' && this.hasPrevPage()) {
            return (
                <Link to={`/reader/${this.context.edition}/${page}`} className="book-nav left">
                    <Glyphicon glyph="arrow-left" /> Previous Spread
                </Link>
            )
        } else if (dir === 'next' && this.hasNextPage()) {
            return (
                <Link to={`/reader/${this.context.edition}/${page}`} className="book-nav right">
                    Next Spread <Glyphicon glyph="arrow-right" />
                </Link>
            )
        }
        return null
    }
    toggleZoom = (url: string) => {
        this.setState({
            zoomUrl: url
        })
    }
    // toggleTour = (tour, tourSide) => {
    //     this.props.setTourItem(tour.item)
    //     this.setState({
    //         tour,
    //         tourSide
    //     })
    // }
    hasNextPage() {
        return this.props.page < this.props.pages.length - 1 // Subtract one for the extra element
    }

    hasPrevPage() {
        return this.props.page > 1
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
    //showTour = (side) => <TourItem toggleTour={this.toggleTour} side={side} />

    render() {
        const nextPage = Math.max(this.props.page + 2, 1)
        const prevPage = Math.min(this.props.page - 2, this.props.pages.length)
        const verso: pageNum = this.props.page
        let recto: pageNum = verso + 1
        if (recto >= this.props.pages.length) {
            recto = null
        }

        return (
            <div>
                {/* {this.state.zoomUrl ? this.showZoom() : null} */}

                <div className="book-pagination">
                    <Row>
                        <Col sm={6}>{this.getLink(prevPage, 'prev')}</Col>
                        <Col sm={6}>{this.getLink(nextPage, 'next')}</Col>
                    </Row>
                </div>

                <Row className="reader-grid">
                    {/* {this.state.tour.item !== undefined ? this.showTour(this.state.tourSide) : null} */}

                    <Col sm={6} className="verso">
                        {this.getPage(verso, 'verso')}
                    </Col>
                    <Col sm={6} className="recto">
                        {this.getPage(recto, 'recto')}
                    </Col>
                </Row>
            </div>
        )
    }
}

export default Reader
