
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
                    <p>Edward Benlowes was an odd gentleman, obsessed with playful forms of poetry and language games. He also was interested in the technologies of printing. He owned a press for printing intaglio plates at his Essex estate and employed an actual Dutch printer, Jan Schoren, who helped him in his technological experimentations.</p>
      		    <p>Benlowes’ masterpiece — the work he spent decades perfecting — was <i>Theophila</i>, an epic poem about the progress of the soul (figured as the woman Theophila) to heaven. It was published in 1652. As a poem, it is a failure. As a book, though, it fascinates. It is a multimedia document featuring fabulous typography. It was set to music by John Jenkins. Perhaps most interestingly, Benlowes designed and printed several engravings to illustrate different parts of the poem. He then made up each individual copy, inserting these engravings — alongside other prints he had collected — in different locations in the text. Thus every existing copy of Theophila is a unique assemblage, making it ripe for comparative study.</p>
      		    <p>Taking Theophila as its test case — and the book artist Benlowes as its inspiration — this project asks:</p>
		    <p><b>How can we leverage digital media to tell richer, more textured stories about early readers, writers, and printers?<b></p>
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

