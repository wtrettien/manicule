import { getPageData } from './metadata'

it('should generate the expected pageData mapping', () => {
  const pageData = getPageData('test')

  // The "index" values should match indexes into the array
  expect(pageData[1].index).toEqual('1')
  expect(pageData[2].index).toEqual('2')

  // The categories and signature values should exist
  const verso = 1
  const recto = 2
  expect(pageData[verso].category).toEqual('flyleaf')
  expect(pageData[recto].category).toEqual('engraving')
})
