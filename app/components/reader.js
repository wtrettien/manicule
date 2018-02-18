// Reader for the book
import React from 'react'
import { Grid, Row, Col, Pager } from 'react-bootstrap'

import Page from './page'
import NavStrip from './nav-strip'

import pageData from '../../data/pages-penn.json'

const categoryColors = {
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

export default class Reader extends React.Component {
  constructor(props) {
    super(props)

    this.next = this.changePage.bind(this, 'next')
    this.prev = this.changePage.bind(this, 'prev')

    this.pageData = this.initializePageData(pageData)
    this.state = {
      verso: 1,
      recto: 2,
    }
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
      <NavStrip data={this.pageData} />
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

    </div>)
  }
}
