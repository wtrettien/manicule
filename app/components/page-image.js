
import React from 'react'
import PropTypes from 'prop-types'

import { Image } from 'react-bootstrap'

const PageImage = ({ edition, num }) => {
  const pad = (`0000${num}`).substr(-4, 4)
  const img = require(`../images/book/${edition}/${pad}.jpg`) // eslint-disable-line global-require
  return <Image src={img} alt="" responsive />
}
PageImage.propTypes = {
  edition: PropTypes.string.isRequired,
  num: PropTypes.number.isRequired,
}
export default PageImage
