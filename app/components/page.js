// Viewer for a single page (of a spread)
import React from 'react'
import PropTypes from 'prop-types'

import { Image, Label } from 'react-bootstrap'

const Page = ({ edition, num, category, signatures, color }) => {
  const pad = (`0000${num}`).substr(-4, 4)
  const img = require(`../images/book/${edition}/${pad}.jpg`) // eslint-disable-line global-require

  return (
    <div>
      <h3><Label style={{ background: color }}>Category: {category}</Label></h3>
      <h4><Label>{signatures}</Label></h4>
      <Image src={img} alt="" responsive />
    </div>
  )
}

Page.propTypes = {
  edition: PropTypes.string.isRequired,
  num: PropTypes.number.isRequired,
  category: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  signatures: PropTypes.string.isRequired,
}

export default Page
