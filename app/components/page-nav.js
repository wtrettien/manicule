// Nav
import React from 'react'
import PropTypes from 'prop-types'

const PageNav = ({ dir }) => {
  const arrow = <div className="arrow">{dir === 'left' ? '<' : '>'}</div>
  return (<div className="ub-nav">
    {arrow}
  </div>)
}

PageNav.propTypes = {
  dir: PropTypes.string.isRequired,
}

export default PageNav
