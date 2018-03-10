import React from 'react'
import PropTypes from 'prop-types'

import { Grid, Row, Col } from 'react-bootstrap'
import TourItem from '../../components/tour-item'
import SiteContainer from '../SiteContainer'


const Tour = ({ edition }) => (
  <SiteContainer>
    <Grid>
      <Row>
        <Col>
          <TourItem page={7} edition={edition} />
        </Col>
      </Row>
    </Grid>
  </SiteContainer>
  )
Tour.propTypes = {
  edition: PropTypes.string.isRequired,
}
export default Tour
