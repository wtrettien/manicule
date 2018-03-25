// Reader for the book
import React from 'react'
import PropTypes from 'prop-types'

import { Row, Col, Glyphicon } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import Page from './page'
import NavStrip from './nav-strip'
import { getPageData } from '../utils/metadata'

export default class Reader extends React.Component {
  constructor(props) {
    super(props)
    this.pageData = getPageData(props.edition)
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
        edition={this.props.edition}
        num={page}
        pos={leaf}
        {...this.pageData[page]}
      />)
    }
    return null
  }

  getLink(page, dir) {
    if (dir === 'prev' && this.hasPrevPage()) {
      return (<Link to={`/reader/${this.props.edition}/${page}`} className="book-nav left">
        <Glyphicon glyph="arrow-left" /> Previous Page
      </Link>)
    } else if (dir === 'next' && this.hasNextPage()) {
      return (<Link to={`/reader/${this.props.edition}/${page}`} className="book-nav right">
       Next Page <Glyphicon glyph="arrow-right" />
      </Link>)
    }
    return null
  }

  hasNextPage() {
    return this.props.page < this.pageData.length - 1  // Subtract one for the extra element
  }

  hasPrevPage() {
    return this.props.page > 1
  }

  render() {
    const nextPage = Math.max(this.props.page + 1, 1)
    const prevPage = Math.min(this.props.page - 1, this.pageData.length)
    const verso = this.props.page
    // const { quire, page } = this.getCurrentQuire()

    let recto = verso + 1
    if (recto >= this.pageData.length) {
      recto = null
    }

    return (<div>
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
        <Col sm={6} className="verso">
          {this.getPage(verso, 'verso')}
        </Col>
        <Col sm={6} className="recto">
          {this.getPage(recto, 'recto')}
        </Col>
      </Row>
      <NavStrip currentPage={verso} edition={this.props.edition} />

    </div>)
  }
}


Reader.propTypes = {
  edition: PropTypes.string.isRequired,
  page: PropTypes.number.isRequired,
}

