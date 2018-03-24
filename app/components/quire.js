import React from 'react'
import PropTypes from 'prop-types'

import Thumbnail from './thumbnail'
import { getPageData } from '../utils/metadata'


const Quire = ({ quire, edition, face, currentPage }) => {
  const index = face === 'recto' ? 0 : 1
  return (<div className="quire">
    <h3>Quire: {quire.$.n}</h3>
    {

    quire.leaf.map((leaf) => (
      <Leaf page={parseInt(leaf.page[index].$.index, 10)} key={leaf.$.folio_number} edition={edition} currentPage={currentPage} />
    ))
   }
  </div>)
}
Quire.propTypes = {
  quire: PropTypes.object.isRequired,
  currentPage: PropTypes.object,
  edition: PropTypes.string.isRequired,
  face: PropTypes.string.isRequired,
}

const Leaf = ({ page, edition, currentPage }) => {
  // Get page data for this
  const pageData = getPageData(edition)[page]
  return <Thumbnail edition={edition} pageData={pageData} currentPage={currentPage} />
}
Leaf.propTypes = {
  page: PropTypes.number.isRequired,
  edition: PropTypes.string.isRequired,
  currentPage: PropTypes.number,
}

export default Quire
