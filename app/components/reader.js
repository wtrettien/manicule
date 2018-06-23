// Reader for the book
import React from 'react'
import PropTypes from 'prop-types'

import { Row, Col, Glyphicon } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import Page from './page'

export class Reader extends React.Component {

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

  hasNextPage() {
    return this.props.page < this.props.pages.length - 1  // Subtract one for the extra element
  }

  hasPrevPage() {
    return this.props.page > 1
  }

  render() {
    const nextPage = Math.max(this.props.page + 2, 1)
    const prevPage = Math.min(this.props.page - 2, this.props.pages.length)
    const verso = this.props.page
    // const { quire, page } = this.getCurrentQuire()
    let recto = verso + 1
    if (recto >= this.props.pages.length) {
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

    </div>)
  }
}


Reader.propTypes = {
  edition: PropTypes.string.isRequired,
  page: PropTypes.number.isRequired,
  pages: PropTypes.array.isRequired,
}

const mapStateToProps = (state) => (
  {
    edition: state.edition.name,
    pages: state.edition.pages,
  }

)
const mapDispatchToProps = (dispatch) => ({
  push: (loc) => dispatch(push(loc)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Reader)

