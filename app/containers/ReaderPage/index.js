
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-theme.css'

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Row, Col } from 'react-bootstrap'

import Reader from '../../components/reader'
import SiteContainer from '../SiteContainer'
import { setEdition } from '../../reducers/edition'
import NavStrip from '../../components/nav-strip'

export class ReaderPage extends React.Component {
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
    const page = parseInt(this.props.page, 10)

    return (
      <SiteContainer>
        <Row>
          <Col>
            <Reader page={page} />
          </Col>
        </Row>
        <Row>
          <Col>
            <NavStrip currentPage={page} edition={this.props.edition} />
          </Col>
        </Row>

      </SiteContainer>
    )
  }
}
ReaderPage.propTypes = {
  edition: PropTypes.string.isRequired,
  page: PropTypes.string.isRequired,
  setEdition: PropTypes.func.isRequired,
}
const mapStateToProps = (state, ownProps) => ({
  page: ownProps.match.params.page,
  edition: ownProps.match.params.edition,
})


export default connect(
  mapStateToProps,
  { setEdition },
)(ReaderPage)

