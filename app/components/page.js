// Viewer for a single page (of a spread)
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Row, Col, Label, Glyphicon } from 'react-bootstrap'

import { getTourForPage } from '../utils/metadata'
import PageImage from './page-image'

export class Page extends React.Component {

  render() {
    const { edition, num, category, signatures, color, pos, description } = this.props
    const tour = getTourForPage(edition, num)
    // The tour, if it exists, should open on the opposite side of the current page
    const tourSide = pos === 'verso' ? 'recto' : 'verso'
    const pageImage = (<PageImage
      num={num}
      edition={edition}
      toggleZoom={this.props.toggleZoom}
    />)

    return (
      <div className="page-panel">
        <div className="page-metadata">
          <Row>
            {
            pos === 'recto' && 
            	<Col sm={8}>
            		{pageImage}
            		<Label bsClass="metadata-label category-label" style={{ background: color }}>
           		 		{category}
            	    </Label>
            	</Col>
            }
            <Col sm={4}>

              { tour ? <Label
                bsClass="metadata-label tour-label"
                onClick={() => this.props.toggleTour(tour, tourSide)}
                style={{ color: color }}
              >
                <Glyphicon glyph="bookmark" />
              </Label>
              : <span>&nbsp;</span> }

              <Label bsClass="metadata-label description-label">
                {description}
              </Label>
              <Label bsClass="metadata-label signatures-label">
                {signatures}
              </Label>
            </Col>
            {
            pos === 'verso' && 
            	<Col sm={8}>
            		{pageImage}
            		<Label bsClass="metadata-label category-label" style={{ background: color }}>
           		 		{category}
            	    </Label>
            	</Col>
            }
          </Row>
        </div>
      </div>
    )
  }
}

Page.propTypes = {
  edition: PropTypes.string.isRequired,
  num: PropTypes.number.isRequired,
  category: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  signatures: PropTypes.string.isRequired,
  description: PropTypes.string,
  pos: PropTypes.string,
  toggleZoom: PropTypes.func,
  toggleTour: PropTypes.func,
}
const mapStateToProps = (state) => ({ edition: state.edition.name })

export default connect(
  mapStateToProps,
)(Page)

