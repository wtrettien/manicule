import React from 'react'
import { shallow } from 'enzyme'

import NotFoundPage from '../index'

describe('<NotFoundPage />', () => {
  it('should render the page message', () => {
    const wrapper = shallow(
      <NotFoundPage />
    )
    expect(wrapper.exists()).toBe(true)
  })
})
