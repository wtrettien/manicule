import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Grid, Row, Col } from 'react-bootstrap'
import TourItem from '../../components/tour-item'
import SiteContainer from '../SiteContainer'

import { setEdition } from '../../reducers/edition'

export class Tour extends React.Component {
  constructor(props) {
    super(props)
    props.setEdition(props.edition)
  }
  componentDidUpdate(prevProps) {
    if (this.props.edition !== prevProps.edition) {
      this.props.setEdition(this.props.edition)
    }
  }
  render() {
    return (<SiteContainer>
      <Grid>
        <Row>
          <Col>
            <TourItem
              index={parseInt(this.props.index, 10)}
            />
          </Col>
        </Row>
      </Grid>
    </SiteContainer>)
  }
}

Tour.propTypes = {
  edition: PropTypes.string.isRequired,
  index: PropTypes.string.isRequired,
  setEdition: PropTypes.func.isRequired,
}

const mapStateToProps = (state, ownProps) => ({
  edition: ownProps.match.params.edition,
  index: ownProps.match.params.index,
})

export default connect(
  mapStateToProps,
  {
    setEdition,
  }
)(Tour)

