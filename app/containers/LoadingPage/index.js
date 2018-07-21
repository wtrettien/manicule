import React from 'react'
import { Jumbotron, Grid, Col, Row } from 'react-bootstrap'

import SiteContainer from '../SiteContainer'


export default class LoadingPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <SiteContainer>
        <Grid
          className="home"
        >
          <Row>
            <Col>
              <Jumbotron>
                <h2>
        Loading...
          </h2>
              </Jumbotron>
            </Col>
          </Row>
        </Grid>

      </SiteContainer>
    )
  }
}
