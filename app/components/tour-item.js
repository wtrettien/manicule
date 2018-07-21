/* eslint-disable no-danger */

// Tour components
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Row, Col, Panel, Button, Glyphicon } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const TourItem = ({ index, toggleTour, edition, metadata, side }) => {
  const { page } = metadata[index]
  const html = require(`../tour/${edition}/${page}.html`) // eslint-disable-line global-require

  const hasPrev = index > 0
  const hasNext = index < metadata.length - 1

  const prevLink = hasPrev ? (
    <Link to={`/reader/${edition}/${metadata[index - 1].page}`} className="book-nav left">
      <Glyphicon glyph="arrow-left" /> Previous Tour Item</Link>) : null

  const nextLink = hasNext ? (<Link to={`/reader/${edition}/${metadata[index + 1].page}`}className="book-nav right" >
    Next Tour Item <Glyphicon glyph="arrow-right" /></Link>) : null

  const tourNav = (
    <div className="tour-nav">
      <Row>
        <Col sm={5}>
          {prevLink}
        </Col>
        <Col sm={5}>
          {nextLink}
        </Col>
        <Col sm={2}>
          <Button className="close-modal" onClick={() => toggleTour({ index: undefined }, undefined)}>
            <Glyphicon glyph="remove" />
          </Button>
        </Col>
      </Row>
    </div>
  )
  return (
    <Panel bsClass="tour-panel" className={side}>
      {tourNav}
      <div className="text" dangerouslySetInnerHTML={{ __html: html }} />
      {tourNav}
    </Panel>
  )
}
TourItem.propTypes = {
  index: PropTypes.number,
  edition: PropTypes.string.isRequired,
  metadata: PropTypes.array.isRequired,
  side: PropTypes.oneOf(['recto', 'verso']),
  toggleTour: PropTypes.func,

}

const mapStateToProps = (state) => ({
  edition: state.edition.name,
  metadata: state.edition.tour,
  index: state.tourIndex.index,
})

export default connect(
  mapStateToProps,
)(TourItem)

