
import React from 'react'
import PropTypes from 'prop-types'

import { Image } from 'react-bootstrap'

export const getImageUrl = (edition, num, thumbnail = false) => {
  const pad = (`0000${num}`).substr(-4, 4)
  const img = thumbnail ? require(`../images/book/${edition}/thumbnails/${pad}.jpg`) : require(`../images/book/${edition}/${pad}.jpg`)
  return img
}

const PageImage = ({ edition, num }) => {
  const img = getImageUrl(edition, num)
  return <Image src={img} alt="" responsive />
}
PageImage.propTypes = {
  edition: PropTypes.string.isRequired,
  num: PropTypes.number.isRequired,
}
export default PageImage

