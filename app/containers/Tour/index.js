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
    props.setEdition(props.match.params.edition)
  }
  componentDidUpdate(prevProps) {
    if (this.props.match.params.edition !== prevProps.match.params.edition) {
      this.props.setEdition(this.props.match.params.edition)
    }
  }
  render() {
    return (<SiteContainer>
      <Grid>
        <Row>
          <Col>
            <TourItem
              index={parseInt(this.props.match.params.index, 10)}
            />
          </Col>
        </Row>
      </Grid>
    </SiteContainer>)
  }
}

Tour.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      edition: PropTypes.string.isRequired,
      index: PropTypes.string.isRequired,
    }),
  }),
  setEdition: PropTypes.func.isRequired,
}

const mapStateToProps = () => ({ })

export default connect(
  mapStateToProps,
  {
    setEdition,
  }
)(Tour)

