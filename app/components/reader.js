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

export default class Reader extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      page: 1,
    }
  }
  render() {
    return (<div>
      <Pager>
        <Pager.Item previous href="#">
                &larr; Previous Page
            </Pager.Item>
        <Pager.Item next href="#">
                Next Page &rarr;
            </Pager.Item>
      </Pager>
      <Page num={this.state.page} />
    </div>)
  }
}
