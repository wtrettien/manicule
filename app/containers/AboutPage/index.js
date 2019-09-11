// Don't edit this page; edit about.html at the top of the project
import React from 'react'
import { Grid, Row, Col } from 'react-bootstrap'

import SiteContainer from '../SiteContainer'


import content from '../../about.html'

export default class AboutPage extends React.Component {

  render() {
    return (
      <SiteContainer>
        <Grid>
          <Row>
            <Col>
              <div className="about">
                <div dangerouslySetInnerHTML={{ __html: content }} />
              </div>
            </Col>
          </Row>
        </Grid>
      </SiteContainer>
    )
  }
}

