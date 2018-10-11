
import React from 'react'
import PropTypes from 'prop-types'

import { Image } from 'react-bootstrap'

export const getImageUrl = (edition, num, thumbnail = false) => {
  const pad = (`0000${num}`).substr(-4, 4)
  const img = thumbnail ? require(`../images/book/${edition}/thumbnails/${pad}.jpg`) : require(`../images/book/${edition}/${pad}.jpg`)
  return img
}

const PageImage = ({ edition, num, toggleZoom }) => {
  const img = getImageUrl(edition, num)
  return (
  
    <div>
      <Image src={img} alt="" responsive onClick={() => toggleZoom(img)} />
    </div>
  )
}
PageImage.propTypes = {
  edition: PropTypes.string.isRequired,
  num: PropTypes.number.isRequired,
  toggleZoom: PropTypes.func,
}
export default PageImage

