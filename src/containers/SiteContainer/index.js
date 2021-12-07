
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-theme.css'

import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { Navbar, Nav, NavItem } from 'react-bootstrap'
import cc from '../../images/cc.svg'
import by from '../../images/by.svg'
import manic from '../../images/manicule-white.png'

export default class SiteContainer extends React.Component { // eslint-disable-line react/prefer-stateless-function

  render() {
    return (
      <div className="page-container">
        <Navbar inverse>
          <Navbar.Header>
            <Navbar.Brand>
            	<NavItem componentClass={Link} to="/" href="/"><img src={manic} alt="manicule" style={{ height: '1em' }} /> Manicule</NavItem></Navbar.Brand>
          </Navbar.Header>
          <Nav>
            <NavItem componentClass={Link} to="/reader" href="/reader">
             Browse
            </NavItem>
            <NavItem componentClass={Link} to="/structure" href="/structure">Structure</NavItem>
            <NavItem componentClass={Link} to="/about" href="/about">About</NavItem>
          </Nav>

        </Navbar>
        {this.props.children}

        <footer>
          This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by/4.0/">
            Creative Commons Attribution 4.0 International License</a> <img src={cc} alt="Creative Commons" style={{ height: '2em' }} />
          <img src={by} alt="Attribution" style={{ height: '2em' }} />

        </footer>

      </div>
    )
  }
}

SiteContainer.propTypes = {
  children: PropTypes.any,
}
