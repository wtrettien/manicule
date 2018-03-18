import React from 'react'
import PropTypes from 'prop-types'

import { Grid, Row, Col } from 'react-bootstrap'
import TourItem from '../../components/tour-item'
import SiteContainer from '../SiteContainer'

import { metadata } from '../../utils/metadata'

export default class Tour extends React.Component {

  constructor(props) {
    super(props)
    this.next = this.next.bind(this)
    this.prev = this.prev.bind(this)
    this.getData = this.getData.bind(this)
    this.tourData = metadata[props.edition].tour

    this.state = {
      index: props.index,
    }
  }
  getData(index) {
    return this.tourData[index]
  }
  prev() {
    this.setState({
      index: this.state.index - 1,
    })
  }
  next() {
    this.setState({
      index: this.state.index + 1,
    })
  }
  render() {
    const hasPrev = this.state.index > 0
    const hasNext = this.state.index < this.tourData.length - 1

    return (<SiteContainer>
      <Grid>
        <Row>
          <Col>
            <TourItem
              edition={this.props.edition}
              index={this.state.index}
              next={this.next}
              prev={this.prev}
              getData={this.getData}
              hasPrev={hasPrev}
              hasNext={hasNext}
            />
          </Col>
        </Row>
      </Grid>
    </SiteContainer>)
  }
}

Tour.propTypes = {
  edition: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
}
Tour.defaultProps = {
  index: 0,
}
