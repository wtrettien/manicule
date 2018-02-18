// Reader for the book
import React from 'react'
import { Panel, Grid, Row, Col, Pager } from 'react-bootstrap'

import Page from './page'
import NavStrip from './nav-strip'

import pageData from '../../data/pages-penn.json'

const categoryColors = {
  blank: 'lightgrey',
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

    this.next = this.changePage.bind(this, 'next')
    this.prev = this.changePage.bind(this, 'prev')
    this.setPage = this.setPage.bind(this)

    this.pageData = this.initializePageData(pageData)
    this.state = {
      verso: 1,
      recto: 2,
    }
  }
    // Set the verso page; this may need to normalize to reset to the actual verso page
  setPage(versoPage) {
    this.setState({
      verso: versoPage,
      recto: versoPage + 1,
    })
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
  changePage(dir) {
    if (dir === 'prev') {
      this.setState({
        verso: this.state.verso - 1,
        recto: this.state.recto - 1,
      })
    } else {
      this.setState({
        verso: this.state.verso + 1,
        recto: this.state.recto + 1,
      })
    }
  }

  render() {
    return (<div>

      <Pager>
        <Pager.Item previous onClick={this.prev} disabled={this.state.page <= 1}>
                &larr; Previous Page
            </Pager.Item>
        <Pager.Item next onClick={this.next} disabled={this.state.page > pageData.length}>
                Next Page &rarr;
            </Pager.Item>
      </Pager>
      <Panel>
        <Grid>
          <Row>
            <Col md={6}>
              <Page
                num={this.state.verso}
                pos="verso"
                {...this.pageData[this.state.verso]}
              />
            </Col>
            <Col md={6}>
              <Page
                num={this.state.recto}
                pos="recto"
                {...this.pageData[this.state.recto]}
              />
            </Col>
          </Row>
        </Grid>
      </Panel>

      <NavStrip data={this.pageData} setPage={this.setPage} />

    </div>)
  }
}
