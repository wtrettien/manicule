// Reader for the book
import React from 'react'
// import styled from 'styled-components'
import { Pager } from 'react-bootstrap'

import Page from './page'

// const Wrapper = styled.article`
//     min-height: 100%;
//     max-width: 80%;
//     margin: auto;
// `

const MAX_PAGE = 172

export default class Reader extends React.Component {
  constructor(props) {
    super(props)

    this.next = this.changePage.bind(this, 'next')
    this.prev = this.changePage.bind(this, 'prev')

    this.state = {
      page: 1,
    }
  }
  changePage(dir) {
    if (dir === 'prev') {
      this.setState({ page: this.state.page - 1 })
    } else {
      this.setState({ page: this.state.page + 1 })
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
      <Page num={this.state.page} />
    </div>)
  }
}
