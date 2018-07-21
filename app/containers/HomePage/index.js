
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-theme.css'
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Link } from 'react-router-dom'
import { Grid, Row, Col, ListGroup, ListGroupItem, Glyphicon } from 'react-bootstrap'
import SiteContainer from '../SiteContainer'
import MapView from '../../components/map-view'
import { setEdition } from '../../reducers/edition'

import im1 from '../../tour/penn/images/0013-1.jpg'
import im2 from '../../tour/penn/images/0007-1.jpg'

export class HomePage extends React.Component {
  constructor(props) {
    super(props)
    props.setEdition(props.edition)
  }

  render() {
    return (
      <SiteContainer>
        <Grid
          className="home"
          style={{
            backgroundSize: 'cover',
          }}
        >
          <Row>
            <Col>

              <Row>
                <Col sm={8}>
                  <div className="home-text">
                    <h1>
                      <i>Used</i> Books
                       </h1>
                    <img src={im2} className="img-circle" width="200" alt="Portrait of Benlowes" style={{ float: 'right' }} />
                    <p>
                        Edward Benlowes was an odd gentleman, obsessed with strange forms of poetry and language games—chronograms,
                        pattern poems, emblems, and so on. He also was interested in the technologies of printing and experimented
                        with them [...]
                      </p>
                    <img src={im1} className="img-rounded" width="200" alt="Engraving of a masked woman" style={{ float: 'left' }} />
                    <p>
                       Benlowes’s masterpiece was <i>Theophila</i>, a book-length poem about the progress of the soul (figured as the woman Theophila) to heaven. It was published in 1652.
                      </p>

                    <p className="clear"></p>

                  </div>
                </Col>
                <Col sm={4}>
                  <ListGroup>
                    <ListGroupItem> <Link to="/reader">
                      <Glyphicon glyph="zoom-in" /> Tour through this edition of Theophila</Link></ListGroupItem>

                    <ListGroupItem >
                      <Link to="/structure"> <Glyphicon glyph="book" /> Explore the book‘s physical structure</Link></ListGroupItem>
                  </ListGroup>
                  <MapView currentPage={0} />
                </Col>
              </Row>


            </Col>
          </Row>
        </Grid>
      </SiteContainer>
    )
  }
}

HomePage.propTypes = {
  edition: PropTypes.string.isRequired,
  setEdition: PropTypes.func.isRequired,
}
const mapStateToProps = (state, ownProps) => ({
  edition: ownProps.edition,

})

export default connect(
  mapStateToProps,
  { setEdition },
)(HomePage)
