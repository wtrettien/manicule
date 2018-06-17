
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
              <Link to="/usedbooks/">Used Books</Link>
            </Navbar.Brand>
          </Navbar.Header>
          <Nav>
            <NavItem>
              <Link to="/usedbooks/reader">Browse</Link>
            </NavItem>
            <NavItem>
              <Link to="/usedbooks/tour">Tour</Link>
            </NavItem>
            <NavItem>
              <Link to="/usedbooks/structure">Structure</Link>
            </NavItem>
          </Nav>

        </Navbar>
        {this.props.children}

        <footer>
          <a rel="license" href="http://creativecommons.org/licenses/by/4.0/">
            <img
              alt="Creative Commons License"
              style={{ borderWidth: 0 }}
              src="https://i.creativecommons.org/l/by/4.0/80x15.png"
            /></a>
          <br />          This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 International License</a>.
        </footer>

      </div>
    )
  }
}

SiteContainer.propTypes = {
  children: PropTypes.any,
}
