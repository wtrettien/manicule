import React from 'react'
import PropTypes from 'prop-types'
import $ from 'jquery'

import { Well, ButtonGroup } from 'react-bootstrap'
import { getPageData } from '../utils/metadata'

import Thumbnail from './thumbnail'


class NavStrip extends React.Component {

  constructor(props) {
    super(props)
    const { currentPage, edition } = props
    const data = getPageData(edition)

    const before = Array.from({ length: currentPage - 1 }, (v, k) => data[currentPage - k - 1]).reverse()
    const after = Array.from({ length: data.length - currentPage - 2 }, (v, k) => data[currentPage + 2 + k])

    const current = [data[currentPage], data[currentPage + 1]]
    const items = before.concat(current).concat(after)
    this.state = {
      items,
      current,
    }
  }
  componentDidUpdate() {
    // Take the natural horizontal position of the current page element...
    let offset = $(`.thumbnail-${this.props.currentPage + 1}`).position().left
    offset -= ($('.nav-group').width() / 2)  // divide the current filmstrip in half
    $('.nav-group').scrollLeft(offset)
  }
  render() {
    return (<Well bsClass="nav-group">
      <NavGroup data={this.state.items} currentPage={this.props.currentPage} edition={this.props.edition} />
    </Well>
    )
  }
}

NavStrip.propTypes = {
  edition: PropTypes.string.isRequired,
  currentPage: PropTypes.number,
}

const NavGroup = ({ data, currentPage, edition }) => (<ButtonGroup >
  {data.map((p) => <Thumbnail pageData={p} currentPage={currentPage} edition={edition} key={p.index} />)}
</ButtonGroup>)


NavGroup.propTypes = {
  data: PropTypes.array.isRequired,
  currentPage: PropTypes.number.isRequired,
  edition: PropTypes.string.isRequired,
}

export default NavStrip
