import React from 'react'
import PropTypes from 'prop-types'

import { Grid, Row, Col } from 'react-bootstrap'
import TourItem from '../../components/tour-item'
import SiteContainer from '../SiteContainer'

import { metadata } from '../../utils/metadata'

const Tour = ({ match }) => {
  const data = metadata[match.params.edition].tour

  return (<SiteContainer>
    <Grid>
      <Row>
        <Col>
          <TourItem
            edition={match.params.edition}
            index={parseInt(match.params.index, 10)}
            data={data}
          />
        </Col>
      </Row>
    </Grid>
  </SiteContainer>)
}

Tour.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      edition: PropTypes.string.isRequired,
      index: PropTypes.string.isRequired,
    }),
  }),
}
export default Tour
