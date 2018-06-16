import React from 'react'
import PropTypes from 'prop-types'
import $ from 'jquery'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import { Well, ButtonGroup, Button } from 'react-bootstrap'

import Thumbnail from './thumbnail'


export class NavStrip extends React.Component {
  constructor(props) {
    super(props)
    this.centerCurrentPage = this.centerCurrentPage.bind(this)
    const { currentPage } = props

    const before = Array.from({ length: currentPage - 1 }, (v, k) => props.pages[currentPage - k - 1]).reverse()
    const after = Array.from({ length: props.pages.length - currentPage - 2 }, (v, k) => props.pages[currentPage + 2 + k])

    const current = [props.pages[currentPage], props.pages[currentPage + 1]]
    const items = before.concat(current).concat(after)

    this.state = {
      items,
    }
  }
  componentDidMount() {
    this.centerCurrentPage()
  }
  componentDidUpdate() {
    this.centerCurrentPage()
  }
  centerCurrentPage() {
    // Take the natural horizontal position of the current page element...
    let offset = $(`.thumbnail-${this.props.currentPage + 1}`).position().left
    offset -= ($('.nav-group').width() / 2) // divide the current filmstrip in half
    $('.nav-group').scrollLeft(offset)
  }
  render() {
    return (
      <div className="nav-strip-container">
        <NavArrow dir="prev" currentPage={this.props.currentPage} edition={this.props.edition} items={this.state.items} />
        <Well bsClass="nav-group">
          <NavGroup data={this.state.items} currentPage={this.props.currentPage} edition={this.props.edition} />
        </Well>
        <NavArrow dir="next" currentPage={this.props.currentPage} edition={this.props.edition} items={this.state.items} />
      </div>
    )
  }
}

NavStrip.propTypes = {
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
)(NavStrip)


export const NavArrow = ({ items, currentPage, dir, edition }) => {
  if (dir === 'prev' && currentPage === 1) {
    return null
  }

  if (dir === 'next' && currentPage === items.length) {
    return null
  }

  if (dir === 'next') {
    return (
      <Link to={`/reader/${edition}/${currentPage + 1}`} className="nav-strip-button next">
        <Button bsClass="button">
        &gt;
        </Button>
      </Link>
    )
  }
  return (
    <Link to={`/reader/${edition}/${currentPage - 1}`} className="nav-strip-button prev">
      <Button bsClass="button">
      &lt;
      </Button>
    </Link>
  )
}

NavArrow.propTypes = {
  items: PropTypes.array.isRequired,
  currentPage: PropTypes.number.isRequired,
  dir: PropTypes.string.isRequired,
  edition: PropTypes.string.isRequired,
}

const NavGroup = ({ data, currentPage, edition }) => (
  <ButtonGroup >
    {data.map((p) => <Thumbnail pageData={p} currentPage={currentPage} edition={edition} key={p.index} />)}
  </ButtonGroup>)


NavGroup.propTypes = {
  data: PropTypes.array.isRequired,
  currentPage: PropTypes.number.isRequired,
  edition: PropTypes.string.isRequired,
}

