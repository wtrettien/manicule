import React from 'react'
import PropTypes from 'prop-types'

import { Grid, Row, Col } from 'react-bootstrap'
import SiteContainer from '../SiteContainer'

import { metadata } from '../../utils/metadata'

export default class Structure extends React.Component {

  constructor(props) {
    super(props)
    this.structure = metadata[props.edition].structure
  }

  render() {
    console.log(this.structure)
    return (<SiteContainer>
      <Grid>
        {this.structure.quire.map((quire) =>

          (<Row>
            <Col>
              <h3>Quire: {quire.$.n}</h3>
            </Col>
          </Row>)
        )}

      </Grid>
    </SiteContainer>)
  }
}

Structure.propTypes = {
  edition: PropTypes.string.isRequired,
}

