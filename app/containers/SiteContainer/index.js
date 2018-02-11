
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-theme.css'

import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { Navbar } from 'react-bootstrap'


export default class SiteContainer extends React.Component { // eslint-disable-line react/prefer-stateless-function

  render() {
    return (
      <div className="page-container">
        <Navbar inverse>
          <Navbar.Brand>
            <Link to="/">“Used” Books</Link>
          </Navbar.Brand>
        </Navbar>
        {this.props.children}
        <footer>

        </footer>

      </div>
    )
  }
}

SiteContainer.propTypes = {
  children: PropTypes.any,
}
