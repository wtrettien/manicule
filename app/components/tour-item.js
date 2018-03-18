/* eslint-disable no-danger */

// Tour components
import React from 'react'
import PropTypes from 'prop-types'
import { Panel, Grid, Row, Col, Image } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import NavStrip from './nav-strip'

const TourItem = ({ index, edition, data }) => {
  const { page, images } = data[index]
  // Get the HTML for this
  const html = require(`../tour/${edition}/${page}.html`) // eslint-disable-line global-require

  const hasPrev = index > 0
  const hasNext = index < data.length - 1

  const prevLink = hasPrev ? <Link to={`/tour/${edition}/${index - 1}`}>&larr; Previous Item</Link> : <span>&larr; Previous Item</span>
  const nextLink = hasNext ? <Link to={`/tour/${edition}/${index + 1}`}>Next Item &rarr;</Link> : <span>Next Item &rarr;</span>

  return (
    <Panel bsClass="tour">
      <Grid>
        <Row>
          <Col sm={4}>
            <TourImages images={images} edition={edition} />
          </Col>
          <Col sm={8}>
            <Row>
              <Col sm={6}>
                {prevLink}
              </Col>
              <Col sm={6}>
                {nextLink}
              </Col>
            </Row>

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
  data: PropTypes.array.isRequired,

}


const TourImages = ({ edition, images }) =>
  // Get all the images for this page
   (
     <div>
       {images.map((filename) => <TourImage key={filename} edition={edition} filename={filename} />)}
     </div>
  )


TourImages.propTypes = {
  images: PropTypes.array.isRequired,
  edition: PropTypes.string.isRequired,
}

const TourImage = ({ filename, edition }) => {
  const img = require(`../tour/${edition}/images/${filename}`)  // eslint-disable-line global-require
  return <Image responsive src={img} alt="" />
}
TourImage.propTypes = {
  filename: PropTypes.string.isRequired,
  edition: PropTypes.string.isRequired,
}

export default TourItem
