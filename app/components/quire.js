import React from 'react'
import PropTypes from 'prop-types'

// import Thumbnail from './thumbnail'

const Quire = ({ quire, page, edition }) => (<div>
  {quire}
  {page}
  {edition}
</div>)
Quire.propTypes = {
  quire: PropTypes.object.isRequired,
  page: PropTypes.object.isRequired,
  edition: PropTypes.string.isRequired,
}

export default Quire
