
import React from 'react'
import Page from '../../components/page'

export default class HomePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <Page num={2} />
      </div>
    )
  }
}

