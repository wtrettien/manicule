import React from 'react'
import { shallow } from 'enzyme'
import { metadata } from '../../utils/metadata'

import { NavStrip, NavArrow } from '../nav-strip'

const props = {
  edition: 'test',
  pages: metadata.test.pages,
}
describe('<NavStrip />', () => {
  it('should render the navstrip', () => {
    const wrapper = shallow(<NavStrip {...props} page="1" />)
    expect(wrapper.exists()).toBe(true)
  })

  it('Should not show a button if we are on the first page', () => {
    const wrapper = shallow(<NavArrow items={['1']} currentPage={1} {...props} dir="prev" />)
    expect(wrapper.find('Button').length).toBe(0)
  })

  it('Should not show a button if we are on the last page', () => {
    const wrapper = shallow(<NavArrow items={['1', '2']} currentPage={2} {...props} dir="next" />)
    expect(wrapper.find('Button').length).toBe(0)
  })
  it('Should show a next button if there are more pages', () => {
    const wrapper = shallow(<NavArrow items={['1', '2']} currentPage={1} {...props} dir="next" />)
    expect(wrapper.find('Button').length).toBe(1)
  })
  it('Should show a prev button if there are fewer pages', () => {
    const wrapper = shallow(<NavArrow items={['1', '2']} currentPage={2} {...props} dir="prev" />)
    expect(wrapper.find('Button').length).toBe(1)
  })
})
