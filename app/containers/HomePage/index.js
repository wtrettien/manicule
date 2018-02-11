
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-theme.css'

import React from 'react'
import { Link } from 'react-router-dom'
import { Grid, Row, Col, Jumbotron, Image, ListGroup, ListGroupItem } from 'react-bootstrap'
import SiteContainer from '../SiteContainer'

import sample from '../../images/site/sample.jpg'


export default class HomePage extends React.Component { // eslint-disable-line react/prefer-stateless-function

  render() {
    return (
      <SiteContainer>
        <Grid>
          <Row>
            <Col>
              <Jumbotron>
                <Row>
                  <Col sm={4}>
                    <Image src={sample} alt="Sample page from Benlowes" rounded responsive />
                  </Col>
                  <Col sm={8}>
                    <h1>
                      “Used” Books
                    </h1>
                    <p>Edward Benlowes was an odd gentleman, obsessed with strange forms of poetry and language games—chronograms,
                      pattern poems, emblems, and so on. He also was interested in the technologies of printing and experimented
                      with them [...]</p>
                    <p>
                       Benlowes’s masterpiece was <i>Theophila</i>, a book-length poem about the progress of the soul (figured as the woman Theophila) to heaven. It was published in 1652.
                    </p>

                    <ListGroup>
                      <ListGroupItem> <Link to="/reader">Browse through this edition of Theophila</Link></ListGroupItem>

                      <ListGroupItem > Take a tour! </ListGroupItem>
                      <ListGroupItem > Browse the figures</ListGroupItem>
                      <ListGroupItem > Biography of Edward Belowes</ListGroupItem>
                      <ListGroupItem > Belowes’ social network</ListGroupItem>
                      <ListGroupItem > Download the page images and metadata</ListGroupItem>
                    </ListGroup>
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

