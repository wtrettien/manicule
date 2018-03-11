// Reader for the book
import React from 'react'
import PropTypes from 'prop-types'

import { Panel, Grid, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import Page from './page'
import NavStrip from './nav-strip'

const categoryColors = {
  blank: 'lightgrey',
  flyleaf: 'lightgrey',
  'commendatory verse': '#3366cc',
  engraving: '#dc3912',
  'original engraving': '#ff9900',
  'pattern poem': '#109618',
  'poem (English)': '#316395',
  'poem (Latin)': '#0099c6',
  preliminary: '#dd4477',
  'repurposed image': '#66aa00',
  'title page': '#b82e2e',
}

export default class Reader extends React.Component {
  constructor(props) {
    super(props)
    const pageDataFile = require(`../../data/${props.edition}/pages.json`)  // eslint-disable-line global-require
    this.pageData = this.initializePageData(pageDataFile)
  }

  getPagination(dir) {
    if (dir === 'next') {
      return this.hasNextPage()
    }
    return this.hasPrevPage()
  }
  getPage(page, leaf) {
    if (page > 0) {
      return (<Page
        edition={this.props.edition}
        num={page}
        pos={leaf}
        {...this.pageData[page]}
      />)
    }
    return null
  }
  getLink(page, dir) {
    if (dir === 'prev' && this.hasPrevPage()) {
      return (<Link to={`/reader/${this.props.edition}/${page}`}>
      &larr; Previous Page
      </Link>)
    } else if (dir === 'next' && this.hasNextPage()) {
      return (<Link to={`/reader/${this.props.edition}/${page}`}>
       Next Page &rarr;
      </Link>)
    }
    return null
  }
  hasNextPage() {
    return this.props.page < this.pageData.length - 1  // Subtract one for the extra element
  }
  hasPrevPage() {
    return this.props.page > 1
  }
  initializePageData(pd) {
    // Create an index table into the page values displayed here
    // There will be one more element than the number of pages, because we didn't want visible zero-indexing
    const data = new Array(pd.length)
    pd.forEach((p) => {
      const item = Object.assign({ color: '' }, p)
      item.color = categoryColors[item.category]
      data[parseInt(item.index, 10)] = item
    })
    return data
  }

  render() {
    const nextPage = Math.max(this.props.page + 1, 1)
    const prevPage = Math.min(this.props.page - 1, this.pageData.length)
    const verso = this.props.page
    let recto = verso + 1
    if (recto >= this.pageData.length) {
      recto = null
    }

    return (<div>

      <Panel>
        <Grid>
          <Row>
            <Col md={6}>
              {this.getLink(prevPage, 'prev')}

            </Col>
            <Col md={6}>
              {this.getLink(nextPage, 'next')}
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              {this.getPage(verso, 'verso')}
            </Col>
            <Col md={6}>
              {this.getPage(recto, 'recto')}
            </Col>
          </Row>
        </Grid>
      </Panel>

      <NavStrip data={this.pageData} currentPage={verso} edition={this.props.edition} />

    </div>)
  }
}


Reader.propTypes = {
  edition: PropTypes.string.isRequired,
  page: PropTypes.number.isRequired,
}

