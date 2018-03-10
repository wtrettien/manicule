import React from 'react'
import PropTypes from 'prop-types'

import { Grid, Row, Col } from 'react-bootstrap'
import TourItem from '../../components/tour-item'
import SiteContainer from '../SiteContainer'

const Tour = ({ edition }) => {
  const tourData = require(`../../tour/${edition}/tour.json`)   // eslint-disable-line global-require
  const { page, images } = tourData[0]  // FIXME state management

  return (<SiteContainer>
    <Grid>
      <Row>
        <Col>
          <TourItem page={page} edition={edition} images={images} />
        </Col>
      </Row>
    </Grid>
  </SiteContainer>)
}
Tour.propTypes = {
  edition: PropTypes.string.isRequired,
}
export default Tour
