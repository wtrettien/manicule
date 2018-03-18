/* eslint-disable no-danger */

// Tour components
import React from 'react'
import PropTypes from 'prop-types'
import { Panel, Grid, Row, Col, Image, Pager } from 'react-bootstrap'

import NavStrip from './nav-strip'

const TourItem = ({ index, edition, getData, next, prev, hasNext, hasPrev }) => {
  const { page, images } = getData(index)
  // Get the HTML for this
  const html = require(`../tour/${edition}/${page}.html`) // eslint-disable-line global-require
  return (
    <Panel bsClass="tour">
      <Grid>
        <Row>
          <Col sm={4}>
            <TourImages images={images} edition={edition} />
          </Col>
          <Col sm={8}>

            <Pager>
              <Pager.Item previous onClick={prev} disabled={!hasPrev}>
                &larr; Previous Item
              </Pager.Item>
              <Pager.Item next onClick={next} disabled={!hasNext}>
                Next Item &rarr;
              </Pager.Item>
            </Pager>

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
  next: PropTypes.func.isRequired,
  prev: PropTypes.func.isRequired,
  getData: PropTypes.func.isRequired,
  hasNext: PropTypes.bool.isRequired,
  hasPrev: PropTypes.bool.isRequired,

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
