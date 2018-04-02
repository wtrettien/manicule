
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-theme.css'

import React from 'react'
import { Link } from 'react-router-dom'
import { Grid, Row, Col, Jumbotron, Image, ListGroup, ListGroupItem, Glyphicon } from 'react-bootstrap'
import SiteContainer from '../SiteContainer'

import bg from '../../tour/penn/images/0290-1.jpg'
import im1 from '../../tour/penn/images/0013-1.jpg'
import im2 from '../../tour/penn/images/0007-1.jpg'
import im3 from '../../tour/penn/images/0229-1.jpg'
import im4 from '../../tour/penn/images/0059-1.jpg'

export default class HomePage extends React.Component { // eslint-disable-line react/prefer-stateless-function

  render() {
    return (
      <SiteContainer>
        <Grid
          className="home"
          style={{
            background: `url(${bg})`,
            backgroundSize: 'cover',
          }}
        >
          <Row>
            <Col>
              <Jumbotron >
                <Row>
                  <Col sm={10}>
                    <h1>
                      <i>Used</i> Books
                    </h1>
                    <p>Edward Benlowes was an odd gentleman, obsessed with strange forms of poetry and language games—chronograms,
                      pattern poems, emblems, and so on. He also was interested in the technologies of printing and experimented
                      with them [...]
                    </p>
                    <p>
                       Benlowes’s masterpiece was <i>Theophila</i>, a book-length poem about the progress of the soul (figured as the woman Theophila) to heaven. It was published in 1652.
                    </p>
                    <ListGroup>
                      <ListGroupItem> <Link to="/reader">
                        <Glyphicon glyph="zoom-in" /> Browse through this edition of Theophila</Link></ListGroupItem>

                      <ListGroupItem > <Link to="/tour">
                        <Glyphicon glyph="export" /> Take a tour!</Link> </ListGroupItem>
                      <ListGroupItem > <Link to="/structure"> <Glyphicon glyph="book" /> Explore the book‘s physical structure</Link></ListGroupItem>
                    </ListGroup>
                  </Col>
                  <Col sm={2} className="image-col">
                    <Image width="200" src={im1} />
                    <Image width="200" src={im2} />
                    <Image width="200" src={im3} />
                    <Image width="200" src={im4} />
                  </Col>
                </Row>
              </Jumbotron>

            </Col>
          </Row>
        </Grid>
      </SiteContainer>
    )
  }
}

