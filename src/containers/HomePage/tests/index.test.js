import React from 'react'
import { shallow } from 'enzyme'

import { HomePage } from '../index'

describe('<HomePage />', () => {
  it('should render the page', () => {
    const wrapper = shallow(
      <HomePage setEdition={() => {}} edition="penn" />
    )
    expect(wrapper.exists()).toBe(true)
  })
})
