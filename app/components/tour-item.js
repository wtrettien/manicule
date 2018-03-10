/* eslint-disable no-danger */

// Tour components
import React from 'react'
import PropTypes from 'prop-types'

const TourItem = ({ page, edition }) => {
  // Get the HTML for this
  const html = require(`../tour/${edition}/${page}.html`) // eslint-disable-line global-require
  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}
TourItem.propTypes = {
  page: PropTypes.string.isRequired,
  edition: PropTypes.string.isRequired,
}

export default TourItem
