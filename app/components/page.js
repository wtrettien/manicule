// Viewer for a single page
import React from 'react'
import PropTypes from 'prop-types'

import { Image } from 'react-bootstrap'

const Page = ({ num }) => {
  const pad = (`0000${num}`).substr(-4, 4)
  const img = require(`../images/book/pg_${pad}.jpg`) // eslint-disable-line global-require

  return (<div className="ub-page">
    <Image src={img} alt="" responsive />
  </div>)
}

Page.propTypes = {
  num: PropTypes.number.isRequired,
}

export default Page
