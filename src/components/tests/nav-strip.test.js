import React from 'react'
import { shallow } from 'enzyme'

import { NavStrip } from '../nav-strip'

const props = {
  edition: 'test',
  pages: [
    { index: '1' },
    { index: '2' },
    { index: '3' },
    { index: '4' },
    { index: '5' },
    { index: '6' },
  ],
}
describe('<NavStrip />', () => {
  it('should render the navstrip', () => {
    const wrapper = shallow(<NavStrip {...props} currentPage={1} />)
    expect(wrapper.exists()).toBe(true)
  })

  it('Should not show a prev button if we are on the first page', () => {
    const wrapper = shallow(<NavStrip {...props} currentPage={1} />)
    expect(wrapper.find('NavArrow').length).toBe(1)
  })

  it('Should not show a next button if we are on the last page', () => {
    const wrapper = shallow(<NavStrip {...props} currentPage={6} />)
    expect(wrapper.find('NavArrow').length).toBe(1)
  })
  it('Should treat the penultimate page like the last, because of spreads', () => {
    const wrapper = shallow(<NavStrip {...props} currentPage={5} />)
    expect(wrapper.find('NavArrow').length).toBe(1)
  })

  it('Should should next/previous if we are on a middle page', () => {
    const wrapper = shallow(<NavStrip {...props} currentPage={3} />)
    expect(wrapper.find('NavArrow').length).toBe(2)
  })
})
