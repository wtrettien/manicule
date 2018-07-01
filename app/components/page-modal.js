
import React from 'react'
import PropTypes from 'prop-types'

import { Panel, Well, Image, Button } from 'react-bootstrap'

const PageModal = ({ url, toggleModal, style }) => (
  <Panel className="page-modal" style={style}>
    <Well>
      <p>
      Scroll around this pop-up to examine the page in detail.
      <Button onClick={() => toggleModal(null)}>
        Close
      </Button>
      </p>
    </Well>
    <div className="img-container">
      <Image src={url} alt="" />
    </div>

  </Panel>
  )
PageModal.propTypes = {
  url: PropTypes.string.isRequired,
  toggleModal: PropTypes.func.isRequired,
  style: PropTypes.object,
}
export default PageModal

