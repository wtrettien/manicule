import React from 'react'
import { shallow } from 'enzyme'

import AboutPage from '../index'

describe('<AboutPage />', () => {
  it('should render the page', () => {
    const wrapper = shallow(
      <AboutPage setEdition={() => {}} edition="penn" />
    )
    expect(wrapper.exists()).toBe(true)
  })
})
