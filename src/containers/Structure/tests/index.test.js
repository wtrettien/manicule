import React from 'react'
import { shallow } from 'enzyme'

import Structure from '../index'

describe('<Structure />', () => {
  it('should render the Structure layout', () => {
    const wrapper = shallow(<Structure edition="test" />)
    expect(wrapper.exists()).toBe(true)
  })
})
