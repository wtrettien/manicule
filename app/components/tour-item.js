/* eslint-disable no-danger */

// Tour components
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Row, Col, Panel, Button, Glyphicon } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const TourItem = ({ item, toggleTour, edition, metadata, side }) => {
  const indexIntoTourData = item - 1
  const { page } = metadata[indexIntoTourData]

  const html = require(`../tour/${edition}/${page}.html`) // eslint-disable-line global-require

  const hasPrev = item > 1
  const hasNext = item < metadata.length

  const prevLink = hasPrev ? (
    <Link to={`/reader/${edition}/${metadata[indexIntoTourData - 1].page}`} className="book-nav left">
      <Glyphicon glyph="arrow-left" /> Previous Tour </Link>) : null

  const nextLink = hasNext ? (<Link to={`/reader/${edition}/${metadata[indexIntoTourData + 1].page}`}className="book-nav right" >
    Next Tour <Glyphicon glyph="arrow-right" /></Link>) : null

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
          <Button className="close-modal" onClick={() => toggleTour({ item: undefined }, undefined)}>
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
  item: PropTypes.number,
  edition: PropTypes.string.isRequired,
  metadata: PropTypes.array.isRequired,
  side: PropTypes.oneOf(['recto', 'verso']),
  toggleTour: PropTypes.func,

}

const mapStateToProps = (state) => ({
  edition: state.edition.name,
  metadata: state.edition.tour,
  item: state.tourItem.item,
})

export default connect(
  mapStateToProps,
)(TourItem)

