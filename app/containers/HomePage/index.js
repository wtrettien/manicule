
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

import im1 from '../../images/birds.png'
import im2 from '../../images/eclipses.jpg'
import im3 from '../../images/cygnus.jpg'
import im4 from '../../images/holzschuher.jpg'

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
                  	<h1>An Astronomical Anthology</h1>
                  	<h2>UPenn LJS 445 (c. 1440)</h2>
                    <img src={im1} width="400" alt="drawing of the Man of Law" style={{ float: 'right' }} />
                    <p>
                   A late-fifteenth-century astronomical anthology, LJS 445 contains a diverse array of texts that reveal the importance of astronomical principles for a range of medieval pursuits, as well as the fluidity of the boundary between manuscript and early print. Encompassing topics such as medicine, calendrical calculation, and prognostication, this sizeable codex includes material from three print volumes: Johannes Lichtenberger’s <i>Prognosticatio</i>, a book of astronomical predictions first published in 1488, and two editions of Johannes Regiomontanus’s <i>Calendarium</i>, both from the 1470s. In many cases, the scribe reproduces the characteristics of these editions, including title pages and image captions. Yet the layouts and illustrations of LJS 445 also draw on long-standing manuscript traditions and benefit from the greater flexibility of handwritten texts in this period, such as the potential for artists to create richly colored images and moveable volvelles.
                    </p>
                    <p>
                    <img src={im2} width="300" alt="drawing of the Man of Law" style={{ float: 'left' }} />
					 Currently held at the Kislak Center for Special Collections, Rare Books and Manuscripts at the University of Pennsylvania in Philadelphia, LJS 445 can be traced to Bavaria, and particularly to two of the sons of a Nuremberg patrician, Georg Veit (1573-1606) and Veit Engelhard (1581-1656) Holtzschuher. With its irregular quiring and partial copies of certain texts, this codex was likely rebound at least once in its history. Composed of 227 leaves with modern finding tabs, it also contains many signs of use, including spaces where images have been extracted, whimsical doodles, and shaky inscriptions by children learning the alphabet.
                    </p>
					<p>
					This interactive facsimile of LJS 445 is designed to provide a comprehensive introduction to the many remarkable features of this manuscript. Click on <a href="http://aylinmalcolm.com/ljs445/reader">“Browse”</a> to scroll through its pages sequentially, or use the <a href="http://aylinmalcolm.com/ljs445/reader/8">“Tour this edition”</a> option to view a series of “tour stops” highlighting some of its more unusual characteristics. Marginal notes describe the contents of notable pages of this facsimile. Color-coded categories provide information about the content of each page and the thematic composition of the book, although these categories should be regarded as approximations of concepts that were in fact interconnected, given the medieval world view of celestial bodies as exerting influences on terrestrial ones. Finally, the <a href="http://aylinmalcolm.com/ljs445/structure">Structure</a> view uses the VisColl data model to depict the physical makeup of this book, including quires of different sizes as well as missing and inserted leaves.
					</p>
					<h2>About the Editor</h2>
					<p>
					<img src={im3} width="300" alt="drawing of the Man of Law" style={{ float: 'right' }} />
Aylin Malcolm is a Ph.D. candidate in English at the University of Pennsylvania, with research interests in late medieval poetry, the history of ecological science, and manuscript studies. To find out more about Aylin’s work, visit <a href="http://aylinmalcolm.com">aylinmalcolm.com</a>. Please direct all questions and feedback concerning this edition to Aylin at <a href="mailto: malcolma@sas.upenn.edu">malcolma@sas.upenn.edu</a>.
					</p>
                    <p className="clear"></p>

                  </div>
                </Col>
                <Col sm={4}>
                  <ListGroup>
                    <ListGroupItem> <Link to="/reader/penn/5">
                      <Glyphicon glyph="bookmark" /> Tour this edition</Link>
                    </ListGroupItem>
                    <ListGroupItem >
                      <Link to="/structure"> <Glyphicon glyph="book" /> Explore the book‘s physical structure</Link>
                    </ListGroupItem>
                  </ListGroup>
                  <MapView currentPage={0} />
                  <img src={im4} width="300" alt="engraved portrait of Holzschuher" style={{ float: 'right' }} />
                  <p style={{ opacity: '.5' }}><i>An engraved portrait of Veit Engelhard Holzschuher as an adult. Holzchuher was eight years old when he owned and annotated this book.</i></p> 

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
