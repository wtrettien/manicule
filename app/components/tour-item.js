/* eslint-disable no-danger */

// Tour components
import React from 'react'
import PropTypes from 'prop-types'
import { Panel, Grid, Row, Col, Image } from 'react-bootstrap'

const TourItem = ({ page, edition, images }) => {
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
            <div dangerouslySetInnerHTML={{ __html: html }} />
          </Col>
        </Row>
      </Grid>
    </Panel>
  )
}
TourItem.propTypes = {
  page: PropTypes.string.isRequired,
  edition: PropTypes.string.isRequired,
  images: PropTypes.array.isRequired,
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
