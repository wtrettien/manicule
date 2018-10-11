import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { OverlayTrigger, Tooltip, Glyphicon } from 'react-bootstrap'

import { connect } from 'react-redux'
import { getTourForPage } from '../utils/metadata'

export class MapView extends React.Component {

  render() {
    const { pages, edition, currentPage } = this.props


    return (<div className="map-blocks">
      {
          pages.map((page) => {
            const index = parseInt(page.index, 10)
            const tour = getTourForPage(edition, index)
            return (
              <span key={page.index} style={{ display: 'inline-block' }}>
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip id={page.index}>{page.category}</Tooltip>}
                >
                  <Link to={`/reader/${edition}/${page.index}`}>

                    <span
                      className={`
                        ${index === currentPage ? 'current-page' : ''}
                        ${tour ? 'has-tour' : ''}
                        map-block
                        `}
                      style={{ background: page.color, color: page.color }}

                    >{ tour ? <Glyphicon glyph="bookmark" /> : '\u00A0'}</span>
                  </Link>
                </OverlayTrigger>

              </span>)
          })
        }
    </div>
    )
  }
}


MapView.propTypes = {
  edition: PropTypes.string.isRequired,
  currentPage: PropTypes.number,
  pages: PropTypes.array.isRequired,
}

const mapStateToProps = (state) => (
  {
    edition: state.edition.name,
    pages: state.edition.pages,
  }
)

export default connect(
  mapStateToProps,
)(MapView)
