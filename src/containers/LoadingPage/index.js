import React from 'react'
import { Grid, Col, Row } from 'react-bootstrap'

import SiteContainer from '../SiteContainer'


export default class LoadingPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <SiteContainer>
        <Grid
          className="loader"
        >
          <Row>
            <Col>

              <h1>
                  Loading...
                </h1>

            </Col>
          </Row>
        </Grid>

      </SiteContainer>
    )
  }
}
