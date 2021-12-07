import React from 'react'
import { Grid, Col, Row } from 'react-bootstrap'

import SiteContainer from '../SiteContainer'


export default class NotFound extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <SiteContainer>
        <Grid
          className="loader"
        >
          <Row>
            <Col>
              <h1>
        Page Not Found
          </h1>

            </Col>
          </Row>
        </Grid>

      </SiteContainer>
    )
  }
}
