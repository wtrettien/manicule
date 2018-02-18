// Viewer for a single page
import React from 'react'
import PropTypes from 'prop-types'

import { Image, Label } from 'react-bootstrap'

const Categories = {
  preliminary: 'gray',
  'commendatory verse': 'blue',
  engraving: 'purple',
  blank: 'lightgrey',
  'title page': 'green',
  'original engraving': 'orange',
  'poem (English)': 'red',
  'pattern poem': 'violet',
  'repurposed image': 'black',
  'poem (Latin)': 'yellow',
}

const Page = ({ num, category }) => {
  const pad = (`0000${num}`).substr(-4, 4)
  const img = require(`../images/book/${pad}.jpg`) // eslint-disable-line global-require

  return (
    <div>
      <h3><Label style={{ background: Categories[category] }}>Category: {category}</Label></h3>
      <Image src={img} alt="" responsive />
    </div>
  )
}

Page.propTypes = {
  num: PropTypes.number.isRequired,
  category: PropTypes.string.isRequired,
}

export default Page
