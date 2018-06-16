import React from 'react'
import { shallow } from 'enzyme'

import { ReaderPage } from '../index'

describe('<ReaderPage />', () => {
  it('should render the page', () => {
    const props = {
      match: {
        params: {
          edition: 'test',
          page: '12',
        },
      },
      setEdition: () => {},
    }
    const wrapper = shallow(<ReaderPage {...props} />)
    expect(wrapper.exists()).toBe(true)
  })
})
