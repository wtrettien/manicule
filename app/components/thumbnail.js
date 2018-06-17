import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { OverlayTrigger, Tooltip, Button, Glyphicon, Label } from 'react-bootstrap'

import { getTourForPage } from '../utils/metadata'
import { getImageUrl } from './page-image'

const Thumbnail = ({ pageData, edition, currentPage }) => {
  const page = parseInt(pageData.index, 10)
  const { index, color, signatures, category } = pageData

  const pos = page % 2 === 0 ? 'recto' : 'verso'
  const img = getImageUrl(edition, page, true)

  const cls = `nav-thumbnail thumbnail-${index} ${pos} ${page === currentPage || page === currentPage + 1 ? 'is-current' : ''}`
  const tour = getTourForPage(edition, page)

  const tourLabel = tour.length > 0 ? (<Label bsClass="metadata-label tour-label">
    <Link to={`/usedbooks/tour/${edition}/${tour[0].index}`} className="has-tour">
      <Glyphicon glyph="export" /> Tour
    </Link></Label>) : null

  return (
    <div
      className={cls}
      style={{ borderBottom: `10px solid ${color}` }}
    >
      <OverlayTrigger
        key={pageData.index}
        placement="top"
        overlay={<Tooltip id={index}>{signatures} - {category}</Tooltip>}
      >

        <Link to={`/usedbooks/reader/${edition}/${index}`}>
          <Button
            id={`page-${page}`}
            bsClass="page-thumbnail"
            style={{ backgroundImage: `url(${img})`,
            }}
          >
          </Button>
        </Link>
      </OverlayTrigger>
      { tourLabel }
    </div>
  )
}

Thumbnail.propTypes = {
  pageData: PropTypes.object.isRequired,
  currentPage: PropTypes.number,
  edition: PropTypes.string.isRequired,

}

export default Thumbnail
