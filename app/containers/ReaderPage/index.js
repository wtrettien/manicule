
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-theme.css'

import React from 'react'
import PropTypes from 'prop-types'

import { Grid, Row, Col } from 'react-bootstrap'
import Reader from '../../components/reader'
import SiteContainer from '../SiteContainer'

export default class ReaderPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const page = parseInt(this.props.match.params.page, 10)
    return (
      <SiteContainer>
        <Grid>
          <Row>
            <Col>
              <Reader edition={this.props.match.params.edition} page={page} />
            </Col>
          </Row>
        </Grid>
      </SiteContainer>
    )
  }
}
ReaderPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      edition: PropTypes.string.isRequired,
      page: PropTypes.string.isRequired,
    }),
  }),

}

