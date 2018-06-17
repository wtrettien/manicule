// Viewer for a single page (of a spread)
import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Row, Col, Label, Glyphicon } from 'react-bootstrap'

import { getTourForPage } from '../utils/metadata'
import PageImage from './page-image'

const Page = ({ edition, num, category, signatures, color }) => {
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
      <PageImage num={num} edition={edition} />
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
const mapStateToProps = (state) => ({ edition: state.edition.name })

export default connect(
  mapStateToProps,
)(Page)

