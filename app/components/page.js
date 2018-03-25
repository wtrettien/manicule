// Viewer for a single page (of a spread)
import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { Row, Col, Image, Label, Glyphicon } from 'react-bootstrap'

import { getTourForPage } from '../utils/metadata'

const Page = ({ edition, num, category, signatures, color }) => {
  const pad = (`0000${num}`).substr(-4, 4)
  const img = require(`../images/book/${edition}/${pad}.jpg`) // eslint-disable-line global-require
  const tour = getTourForPage(edition, num)

  return (
    <div className="page-panel">
      <div className="page-metadata">
        <Row className="page-metadata-grid">
          <Col md={4}>
            <Label bsClass="metadata-label category-label" style={{ background: color }}>
              <Glyphicon glyph="tag" /> {category}
            </Label>

          </Col>
          <Col md={4}>
            <Label bsClass="metadata-label signatures-label">
              <Glyphicon glyph="info-sign" /> {signatures}
            </Label>
          </Col>
          <Col md={4}>

            { tour.length > 0 ? <Label bsClass="metadata-label tour-label">
              <Link to={`/tour/${edition}/${tour[0].index}`} className="has-tour">
                <Glyphicon glyph="export" /> Tour
                </Link></Label>
              : <span>&nbsp;</span> }
          </Col>
        </Row>
      </div>
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
