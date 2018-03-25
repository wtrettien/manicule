
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-theme.css'

import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { Navbar, Nav, NavItem } from 'react-bootstrap'


export default class SiteContainer extends React.Component { // eslint-disable-line react/prefer-stateless-function

  render() {
    return (
      <div className="page-container">
        <Navbar inverse>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/">Used Books</Link>
            </Navbar.Brand>
          </Navbar.Header>
          <Nav>
            <NavItem>
              <Link to="/browse">Browse</Link>
            </NavItem>
            <NavItem>
              <Link to="/tour">Tour</Link>
            </NavItem>
            <NavItem>
              <Link to="/structure">Structure</Link>
            </NavItem>
          </Nav>

        </Navbar>
        {this.props.children}

        <footer>
          Some credit, copyright, and usage info here.
        </footer>

      </div>
    )
  }
}

SiteContainer.propTypes = {
  children: PropTypes.any,
}
