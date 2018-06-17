
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-theme.css'

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Grid, Row, Col } from 'react-bootstrap'

import Reader from '../../components/reader'
import SiteContainer from '../SiteContainer'
import { setEdition } from '../../reducers/edition'

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
        <Grid>
          <Row>
            <Col>
              <Reader page={page} />
            </Col>
          </Row>
        </Grid>
      </SiteContainer>
    )
  }
}
ReaderPage.propTypes = {
  edition: PropTypes.string.isRequired,
  page: PropTypes.string.isRequired,
  setEdition: PropTypes.func.isRequired,
}
const mapStateToProps = () => ({ })

export default connect(
  mapStateToProps,
  {
    setEdition,
  }
)(ReaderPage)

