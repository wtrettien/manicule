// Reader for the book
import React from 'react'
import PropTypes from 'prop-types'
import { Motion, spring, presets } from 'react-motion'

import { Row, Col, Glyphicon } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import { setTourIndex } from '../reducers/tour-index'
import Page from './page'
import PageZoom from './page-zoom'
import TourItem from './tour-item'

export class Reader extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      zoomUrl: undefined,
      tour: { index: undefined },
      tourSide: undefined,
    }
  }
  componentWillReceiveProps() {

  }
  getPagination(dir) {
    if (dir === 'next') {
      return this.hasNextPage()
    }
    return this.hasPrevPage()
  }

  getPage(page, leaf) {
    if (page > 0) {
      return (<Page
        num={page}
        pos={leaf}
        toggleZoom={this.toggleZoom}
        toggleTour={this.toggleTour}
        {...this.props.pages[page]}
      />)
    }
    return null
  }

  getLink(page, dir) {
    if (dir === 'prev' && this.hasPrevPage()) {
      return (<Link to={`/reader/${this.props.edition}/${page}`} className="book-nav left">
        <Glyphicon glyph="arrow-left" /> Previous Spread
      </Link>)
    } else if (dir === 'next' && this.hasNextPage()) {
      return (<Link to={`/reader/${this.props.edition}/${page}`} className="book-nav right">
        Next Spread <Glyphicon glyph="arrow-right" />
      </Link>)
    }
    return null
  }
  toggleZoom = (url) => {
    this.setState({
      zoomUrl: url,
    })
  }
  toggleTour = (tour, tourSide) => {
    this.props.setTourIndex(tour.index)
    this.setState({
      tour,
      tourSide,
    })
  }
  hasNextPage() {
    return this.props.page < this.props.pages.length - 1  // Subtract one for the extra element
  }

  hasPrevPage() {
    return this.props.page > 1
  }
  showZoom = () => (
    <Motion
      defaultStyle={{ scale: this.state.zoomUrl ? 0 : 1 }}
      style={{ scale: spring(1, presets.stiff) }}
    >
      { (style) => (<PageZoom
        url={this.state.zoomUrl}
        toggleZoom={this.toggleZoom}
        style={{
          transform: `scale(${style.scale})` }}
      />)
        }
    </Motion>
  )
  showTour = (side) => (
    <TourItem
      toggleTour={this.toggleTour}
      side={side}
    />
  )

  render() {
    const nextPage = Math.max(this.props.page + 2, 1)
    const prevPage = Math.min(this.props.page - 2, this.props.pages.length)
    const verso = this.props.page
    let recto = verso + 1
    if (recto >= this.props.pages.length) {
      recto = null
    }

    return (<div>
      { this.state.zoomUrl ? this.showZoom() : null }

      <div className="book-pagination">
        <Row>
          <Col sm={6}>
            {this.getLink(prevPage, 'prev')}

          </Col>
          <Col sm={6}>
            {this.getLink(nextPage, 'next')}
          </Col>
        </Row>
      </div>

      <Row className="reader-grid">
        { this.state.tour.index !== undefined ? this.showTour(this.state.tourSide) : null }


        <Col sm={6} className="verso">
          {this.getPage(verso, 'verso')}
        </Col>
        <Col sm={6} className="recto">
          {this.getPage(recto, 'recto')}
        </Col>
      </Row>

    </div>)
  }
}


Reader.propTypes = {
  edition: PropTypes.string.isRequired,
  page: PropTypes.number.isRequired,
  pages: PropTypes.array.isRequired,
  setTourIndex: PropTypes.func,
}

const mapStateToProps = (state) => (
  {
    edition: state.edition.name,
    pages: state.edition.pages,
  }

)

export default connect(
  mapStateToProps,
  { setTourIndex }
)(Reader)

