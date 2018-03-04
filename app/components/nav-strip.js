import React from 'react'
import PropTypes from 'prop-types'

import { Well, OverlayTrigger, Tooltip, Button, ButtonGroup } from 'react-bootstrap'

const NavStrip = ({ data, setPage, currentPage, window }) => {
  // Before window is `window` unless we're less than window
  const beforeSlots = currentPage <= window ? currentPage - 1 : window

  // After window is `window` unless we're near the end
  const afterSlots = currentPage + window > data.length ? data.length - currentPage : window

  const before = Array.from({ length: beforeSlots }, (v, k) => data[currentPage - k - 1]).reverse()
  const after = Array.from({ length: afterSlots }, (v, k) => data[currentPage + 2 + k])

  return (<Well>
    <div style={{ margin: 'auto', textAlign: 'center' }}>
      <NavGroup data={before} setPage={setPage} />
      <NavGroup data={[data[currentPage], data[currentPage + 1]]} setPage={setPage} isCurrent />
      <NavGroup data={after} setPage={setPage} />
    </div>
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
  window: 4,
}

const NavGroup = ({ data, setPage, isCurrent }) =>
  (<ButtonGroup>{data.map((p) => {
    const pos = parseInt(p.index, 10) % 2 === 0 ? 'recto' : 'verso'
    const pad = (`0000${p.index}`).substr(-4, 4)
    const edition = 'penn' // FIXME make this something switchable
    const img = require(`../images/book/${edition}/thumbnails/${pad}.jpg`) // eslint-disable-line global-require

    const cls = `nav-thumbnail ${pos} ${isCurrent ? 'is-current' : ''}`

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
  isCurrent: PropTypes.bool,
}
NavGroup.defaultProps = {
  isCurrent: false,
}
export default NavStrip
