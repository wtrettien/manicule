// Reader for the book
import React from 'react'
import PropTypes from 'prop-types'

import { Panel, Grid, Row, Col, Pager } from 'react-bootstrap'
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

  initializePageData(pd) {
    // Create an index table into the page values displayed here
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
    const recto = this.props.page + 1

    return (<div>

      <Pager>
        <Link to={`/reader/${this.props.edition}/${prevPage}`}>
          <button className="prev" disabled={this.props.page <= 1}>
                &larr; Previous Page
            </button>
        </Link>
        <Link to={`/reader/${this.props.edition}/${nextPage}`}>
          <button className="next" disabled={this.props.page > this.pageData.length}>
                Next Page &rarr;
            </button>
        </Link>
      </Pager>
      <Panel>
        <Grid>
          <Row>
            <Col md={6}>
              <Page
                edition={this.props.edition}
                num={verso}
                pos="verso"
                {...this.pageData[verso]}
              />
            </Col>
            <Col md={6}>
              <Page
                edition={this.props.edition}
                num={recto}
                pos="recto"
                {...this.pageData[recto]}
              />
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

