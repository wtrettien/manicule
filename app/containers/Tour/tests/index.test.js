import React from 'react'
import { shallow } from 'enzyme'

import { Tour } from '../index'

describe('<Tour />', () => {
  it('should render the tour', () => {
    const props = {
      edition: 'test',
      index: '1',
      setEdition: () => {},
    }
    const wrapper = shallow(<Tour {...props} />)
    expect(wrapper.exists()).toBe(true)
  })
})
