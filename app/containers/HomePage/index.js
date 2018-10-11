
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

import im1 from '../../tour/penn/images/001.jpg'
import im2 from '../../tour/penn/images/002.jpg'

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
                      Welcome
                       </h1>
                    <img src={im2} className="img-circle" width="200" alt="Portrait of Benlowes" style={{ float: 'right' }} />
                    <p>
                        This is the text that appears on your homepage.
                      </p>
                    <img src={im1} className="img-rounded" width="200" alt="Engraving of a masked woman" style={{ float: 'left' }} />
                    <p>
						The images here have been randomly chosen from the Penn in Hand website, which provides access to high-resolution facsimiles of manuscripts held at the University of Pennsylvania. You can change the images by uploading new images to a directory in your project and changing the "im1" or "im2" variables above to point to them.
                    </p>
					<p>
						You can also add new paragraphs, new images, or move around the homepage elements by altering the "index.js" file in /app/containers/HomePage/.
					</p>
                    <p className="clear"></p>

                  </div>
                </Col>
                <Col sm={4}>
                  <ListGroup>
                    <ListGroupItem> <Link to="/reader">
                      <Glyphicon glyph="bookmark" /> Tour through this edition of Theophila</Link></ListGroupItem>

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
