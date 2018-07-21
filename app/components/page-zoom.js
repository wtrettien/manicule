
import React from 'react'
import PropTypes from 'prop-types'

import { Panel, Well, Image, Button } from 'react-bootstrap'

const PageZoom = ({ url, toggleZoom, style }) => (
  <Panel className="page-modal" style={style}>
    <Well>
      <p>
      Scroll around this pop-up to examine the page in detail.
      <Button onClick={() => toggleZoom(null)}>
        Close
      </Button>
      </p>
    </Well>
    <div className="img-container">
      <Image src={url} alt="" />
    </div>

  </Panel>
  )
PageZoom.propTypes = {
  url: PropTypes.string.isRequired,
  toggleZoom: PropTypes.func.isRequired,
  style: PropTypes.object,
}
export default PageZoom

