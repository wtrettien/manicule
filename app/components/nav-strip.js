import React from 'react'
import PropTypes from 'prop-types'

import { Well, OverlayTrigger, Tooltip, Button, ButtonGroup } from 'react-bootstrap'

const NavStrip = ({ data, setPage }) =>

   (<Well>
     <ButtonGroup>{data.map((p) => (
       <OverlayTrigger key={p.index} placement="top" overlay={<Tooltip id={p.index}>{p.signatures} - {p.category}</Tooltip>}>
         <Button
           style={{ background: p.color, color: 'white', height: '30px', width: '20px' }}
           onClick={() => setPage(parseInt(p.index, 10))}
         >

         </Button>
       </OverlayTrigger>
      ))}
     </ButtonGroup>
   </Well>
  )

NavStrip.propTypes = {
  data: PropTypes.array.isRequired,
  setPage: PropTypes.func.isRequired,
}
export default NavStrip
