// Reader for the book
import React from 'react'
// import styled from 'styled-components'
import { Grid, Row, Col, Pager } from 'react-bootstrap'

import Page from './page'
import pageData from '../../data/pages-penn.json'

// const Wrapper = styled.article`
//     min-height: 100%;
//     max-width: 80%;
//     margin: auto;
// `

const MAX_PAGE = pageData.length

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
    const data = {}
    pd.forEach((p) => {
      data[p.index] = p
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
        <Pager.Item next onClick={this.next} disabled={this.state.page > MAX_PAGE}>
                Next Page &rarr;
            </Pager.Item>
      </Pager>
      <Grid>
        <Row>
          <Col md={6}>
            <Page num={this.state.verso} category={this.pageData[this.state.verso].category} pos="verso" />
          </Col>
          <Col md={6}>
            <Page num={this.state.recto} category={this.pageData[this.state.recto].category} pos="recto" />
          </Col>
        </Row>
      </Grid>
    </div>)
  }
}
