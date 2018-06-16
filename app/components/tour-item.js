/* eslint-disable no-danger */

// Tour components
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Panel, Grid, Row, Col, Image, Carousel, Glyphicon } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import NavStrip from './nav-strip'

const TourItem = ({ index, edition, metadata }) => {
  const { page, images } = metadata[index]
  // Get the HTML for this
  const html = require(`../tour/${edition}/${page}.html`) // eslint-disable-line global-require

  const hasPrev = index > 0
  const hasNext = index < metadata.length - 1

  const prevLink = hasPrev ? (<Link to={`/tour/${edition}/${index - 1}`} className="book-nav left">
    <Glyphicon glyph="arrow-left" /> Previous Item</Link>) : <span>&larr; Previous Item</span>
  const nextLink = hasNext ? (<Link to={`/tour/${edition}/${index + 1}`}className="book-nav right" >
    Next Item <Glyphicon glyph="arrow-right" /></Link>) : <span>Next Item &rarr;</span>

  return (
    <Panel bsClass="tour">
      <Grid>
        <Row>
          <Col sm={6}>
            {prevLink}
          </Col>
          <Col sm={6}>
            {nextLink}
          </Col>
        </Row>
        <Row className="tour-grid">
          <Col sm={4} className="image-panel">
            <TourImages images={images} edition={edition} />
          </Col>
          <Col sm={1}>&nbsp;</Col>
          <Col sm={7}>
            <Panel bsClass="tour-panel">
              <div dangerouslySetInnerHTML={{ __html: html }} />
            </Panel>
          </Col>
        </Row>
        <Row>
          <Col>
            <NavStrip currentPage={page} edition={edition} />
          </Col>
        </Row>
      </Grid>
    </Panel>
  )
}
TourItem.propTypes = {
  index: PropTypes.number.isRequired,
  edition: PropTypes.string.isRequired,
  metadata: PropTypes.array.isRequired,

}


const TourImages = ({ edition, images }) => {
  // Get all the images for this page
  if (images.length === 1) {
    const img = require(`../tour/${edition}/images/${images[0]}`)  // eslint-disable-line global-require
    return <Image responsive src={img} alt="" />
  }
  return (
    <Carousel>
      {images.map((filename) => {
        const img = require(`../tour/${edition}/images/${filename}`)  // eslint-disable-line global-require
        return (<Carousel.Item key={filename}>
          <Image responsive src={img} width={400} alt="" />
        </Carousel.Item>)
      })}
    </Carousel>
  )
}
TourImages.propTypes = {
  images: PropTypes.array.isRequired,
  edition: PropTypes.string.isRequired,
}

const mapStateToProps = (state) => ({
  edition: state.edition.name,
  metadata: state.edition.tour,
})

export default connect(
  mapStateToProps,
)(TourItem)

