
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-theme.css'

import React from 'react'
import { Grid, Row, Col, Navbar } from 'react-bootstrap'
import Reader from '../../components/reader'


export default class HomePage extends React.Component { // eslint-disable-line react/prefer-stateless-function

  render() {
    return (
      <div className="page-container">
        <Navbar>
          <Navbar.Brand>
            <a href="#home">Used Books Reader</a>
          </Navbar.Brand>
        </Navbar>
        <Grid>
          <Row>
            <Col>
              <Reader />
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
}

