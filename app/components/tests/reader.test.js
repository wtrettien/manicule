import React from 'react'
import { shallow } from 'enzyme'

import Reader from '../reader'

const props = {
  edition: 'test',
  page: 1,
}

describe('<Reader />', () => {
  it('should render the page', () => {
    const wrapper = shallow(<Reader {...props} />)
    expect(wrapper.exists()).toBe(true)
  })

  it('should load page data', () => {
    const wrapper = shallow(<Reader {...props} />)
    // This will be +1 the length of pagedata, because zero-indexing
    expect(wrapper.instance().pageData.length).toBe(3)
  })

  it('should paginate correctly from the first page', () => {
    const wrapper = shallow(<Reader {...props} />)
    expect(wrapper.instance().hasPrevPage()).toBe(false)
    expect(wrapper.instance().hasNextPage()).toBe(true)
  })

  it('should paginate correctly from the last page', () => {
    const myProps = {
      edition: 'test',
      page: 2,
    }
    const wrapper = shallow(<Reader {...myProps} />)
    expect(wrapper.instance().hasPrevPage()).toBe(true)
    expect(wrapper.instance().hasNextPage()).toBe(false)
  })
})
