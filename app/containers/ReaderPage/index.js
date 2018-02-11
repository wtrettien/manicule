
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-theme.css'

import React from 'react'
import { Grid, Row, Col } from 'react-bootstrap'
import Reader from '../../components/reader'
import SiteContainer from '../SiteContainer'

export default class ReaderPage extends React.Component { // eslint-disable-line react/prefer-stateless-function

  render() {
    return (
      <SiteContainer>
        <Grid>
          <Row>
            <Col>
              <Reader />
            </Col>
          </Row>
        </Grid>
      </SiteContainer>
    )
  }
}

