import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { OverlayTrigger, Tooltip, Button } from 'react-bootstrap'

const Thumbnail = ({ pageData, edition, currentPage }) => {
  const page = parseInt(pageData.index, 10)
  const index = pageData.index
  const color = pageData.color
  const signatures = pageData.signatures
  const category = pageData.category

  const pos = page % 2 === 0 ? 'recto' : 'verso'
  const pad = (`0000${index}`).substr(-4, 4)
  const img = require(`../images/book/${edition}/thumbnails/${pad}.jpg`) // eslint-disable-line global-require
  const cls = `nav-thumbnail thumbnail-${index} ${pos} ${page === currentPage || page === currentPage + 1 ? 'is-current' : ''}`

  return (<OverlayTrigger
    key={pageData.index}
    placement="top"
    overlay={<Tooltip id={index}>{signatures} - {category}</Tooltip>}
  >
    <div
      className={cls}
      style={{ borderBottom: `10px solid ${color}` }}
    >
      <Link to={`/reader/${edition}/${index}`}>
        <Button
          style={{ backgroundImage: `url(${img})`,
          }}
        >
        </Button>
      </Link>
    </div>

  </OverlayTrigger>)
}

Thumbnail.propTypes = {
  pageData: PropTypes.object.isRequired,
  currentPage: PropTypes.number,
  edition: PropTypes.string.isRequired,

}

export default Thumbnail
