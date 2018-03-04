import React from 'react'
import PropTypes from 'prop-types'

import { Well, OverlayTrigger, Tooltip, Button, ButtonGroup } from 'react-bootstrap'

const NavStrip = ({ data, setPage, currentPage, window }) => {
  let before
  let after

  // If "window" is -1, then the window is infinite and we assume that the UI will handle
  // constraining the number of visible spreads.
  if (window === -1) {
    before = Array.from({ length: currentPage - 1 }, (v, k) => data[currentPage - k - 1]).reverse()
    after = Array.from({ length: data.length - currentPage - 2 }, (v, k) => data[currentPage + 2 + k])
  } else {
    // Before window is `window` unless we're less than window
    const beforeSlots = currentPage <= window ? currentPage - 1 : window

    // After window is `window` unless we're near the end
    const afterSlots = currentPage + window > data.length ? data.length - currentPage : window

    before = Array.from({ length: beforeSlots }, (v, k) => data[currentPage - k - 1]).reverse()
    after = Array.from({ length: afterSlots }, (v, k) => data[currentPage + 2 + k])
  }
  const current = [data[currentPage], data[currentPage + 1]]
  const items = before.concat(current).concat(after)

  return (<Well bsClass="nav-group">
    <NavGroup data={items} setPage={setPage} currentPage={currentPage} />
    {/* <NavGroup data={before} setPage={setPage} />
    <NavGroup data={[data[currentPage], data[currentPage + 1]]} setPage={setPage} isCurrent />
    <NavGroup data={after} setPage={setPage} /> */}
  </Well>
  )
}
NavStrip.propTypes = {
  data: PropTypes.array.isRequired,
  setPage: PropTypes.func.isRequired,
  currentPage: PropTypes.number,
  window: PropTypes.number,
}
NavStrip.defaultProps = {
  currentPage: 10,
  window: -1, // The length of the window of pages before/after. -1 is infinite
}

const NavGroup = ({ data, setPage, currentPage }) =>
  (<ButtonGroup>{data.map((p) => {
    const page = parseInt(p.index, 10)
    const pos = page % 2 === 0 ? 'recto' : 'verso'
    const pad = (`0000${p.index}`).substr(-4, 4)
    const edition = 'penn' // FIXME make this something switchable
    const img = require(`../images/book/${edition}/thumbnails/${pad}.jpg`) // eslint-disable-line global-require
    const cls = `nav-thumbnail ${pos} ${page === currentPage || page === currentPage + 1 ? 'is-current' : ''}`

    return (<OverlayTrigger key={p.index} placement="top" overlay={<Tooltip id={p.index}>{p.signatures} - {p.category}</Tooltip>}>
      <Button
        bsClass={cls}
        style={{ backgroundImage: `url(${img})`,
          margin: pos === 'verso' ? '5px 0 5px 5px' : '5px 5px 5px 0',
          borderBottom: `10px solid ${p.color}`,
        }}
        onClick={() => setPage(parseInt(p.index, 10))}
      >
      </Button>
    </OverlayTrigger>)
  })}
  </ButtonGroup>)


NavGroup.propTypes = {
  data: PropTypes.array.isRequired,
  setPage: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
}

export default NavStrip
