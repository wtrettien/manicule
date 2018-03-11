import React from 'react'
import { shallow } from 'enzyme'

import NotFoundPage from '../index'

describe('<NotFoundPage />', () => {
  it('should render the page message', () => {
    const renderedComponent = shallow(
      <NotFoundPage />
    )
    renderedComponent.isEmpty()
  })
})
