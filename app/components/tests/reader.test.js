import React from 'react'
import { shallow } from 'enzyme'

import { Reader } from '../reader'
import { metadata } from '../../utils/metadata'

const props = {
  edition: 'test',
  page: 1,
  pages: metadata.test.pages,
}

describe('<Reader />', () => {
  it('should render the page', () => {
    const wrapper = shallow(<Reader {...props} />)
    expect(wrapper.exists()).toBe(true)
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
      pages: metadata.test.pages,
    }
    const wrapper = shallow(<Reader {...myProps} />)
    expect(wrapper.instance().hasPrevPage()).toBe(true)
    expect(wrapper.instance().hasNextPage()).toBe(false)
  })
})
