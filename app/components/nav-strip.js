import React from 'react'
import PropTypes from 'prop-types'
import $ from 'jquery'
import { connect } from 'react-redux'
import { Motion, spring, presets } from 'react-motion'

import { Well, ButtonGroup, Button } from 'react-bootstrap'

import Thumbnail from './thumbnail'


export class NavStrip extends React.Component {
  constructor(props) {
    super(props)

    const { currentPage } = props
    const before = Array.from({ length: currentPage - 1 }, (v, k) => props.pages[currentPage - 1 - k]).reverse()

    const after = Array.from({ length: props.pages.length - currentPage - 2 }, (v, k) => props.pages[currentPage + 2 + k])
    const current = [props.pages[currentPage]]
    if (props.pages[currentPage + 1]) { // Is there one more page? If so add it to the current spread
      current.push(props.pages[currentPage + 1])
    }
    let items = before.concat(current)
    if (after) {
      items = items.concat(after)
    }
    this.scrollTimeout = undefined
    this.scrollTimer = 100

    this.state = {
      items,
      offset: 0,
      lastOffset: 0,
    }
  }

  componentDidMount() {
    this.setState({ // eslint-disable-line react/no-did-mount-set-state
      offset: this.computeCenteredPage(this.props.currentPage),
    })
  }
  componentWillReceiveProps(newProps) {
    this.setState({
      offset: this.computeCenteredPage(newProps.currentPage),
      lastOffset: this.state.offset,
    })
  }

  onScroll(motion) {
    if ($('.nav-group')) {
      $('.nav-group').scrollLeft(motion.offset)
    }
    return null
  }
  // When the arrow is held, change the offset value
  onTriggerScroll = (dir) => {
    let offset = this.state.offset
    if (dir === 'next') {
      offset += 100
    } else {
      offset -= 100
    }
    this.setState({
      lastOffset: this.state.offset,
      offset,
    })
    this.scrollTimeout = setTimeout(() => this.onTriggerScroll(dir), this.scrollCounter)
    this.scrollCounter /= 2
  }
  onTriggerEnd = () => {
    clearTimeout(this.scrollTimeout)
    this.scrollCounter = 100
  }
  computeCenteredPage(currentPage) {
    // Take the natural horizontal position of the current page element...
    let offset = 0
    const currentThumbnail = $(`.thumbnail-${currentPage + 1}`)
    if (currentThumbnail.position()) {
      offset = currentThumbnail.position().left
      offset -= ($('.nav-group').width() / 2) // divide the current filmstrip in half
    }
    return offset
  }

  render() {
    return (
      <div className="nav-strip-container">
        { this.props.currentPage > 1 &&
          <NavArrow dir="prev" onTriggerScroll={this.onTriggerScroll} onTriggerEnd={this.onTriggerEnd} />
        }

        <Motion
          defaultStyle={{ offset: this.state.lastOffset }}
          style={{ offset: spring(this.state.offset, presets.stiff) }}
        >
          {this.onScroll}
        </Motion>
        <Well bsClass="nav-group">
          <NavGroup data={this.state.items} currentPage={this.props.currentPage} edition={this.props.edition} />
        </Well>
        { this.props.currentPage < this.state.items.length &&
          <NavArrow dir="next" onTriggerScroll={this.onTriggerScroll} onTriggerEnd={this.onTriggerEnd} />
        }
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


export const NavArrow = ({ dir, onTriggerScroll, onTriggerEnd }) => (
  <div className={`nav-strip-button ${dir}`}>
    <Button bsClass="button" onMouseDown={() => onTriggerScroll(dir)} onMouseUp={onTriggerEnd}>
      { dir === 'prev' ? '≪' : '≫' }
    </Button>
  </div>)


NavArrow.propTypes = {
  dir: PropTypes.string.isRequired,
  onTriggerScroll: PropTypes.func.isRequired,
  onTriggerEnd: PropTypes.func.isRequired,
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

