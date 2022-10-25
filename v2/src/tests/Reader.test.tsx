import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import Reader from 'components/reader'
import { parseString } from 'xml2js'

import { EditionContext } from 'containers/SiteContainer'
import { PageData, TourData, getStructure } from 'metadata'
import MapView from 'components/map-view'
import NavStrip from 'components/nav-strip'
import Structure from 'containers/Structure'

const pages: PageData = new Map()
pages.set(1, {
    index: 1,
    signatures: 'signatures 1',
    pagenum: undefined,
    category: 'category 1',
    description: 'description 1',
    color: 'green',
    tourItem: undefined
})
pages.set(2, {
    index: 2,
    signatures: 'signatures 2',
    pagenum: undefined,
    category: 'category 2',
    description: 'description 2',
    color: 'red',
    tourItem: undefined
})
pages.set(3, {
    index: 3,
    signatures: 'signatures 3',
    pagenum: undefined,
    category: 'category 3',
    description: 'description 3',
    color: 'red',
    tourItem: undefined
})

const tour: TourData = []

const xml = `<?xml version="1.0"?>
<book>
    <url></url>
    <title>A test book</title>
    <author>A test author</author>
    <source>Rosenbach MS 1084/2</source>
    <quire n="*">
        <leaf n="1" mode="original" single="false" folio_number="1" conjoin="">
            <page index="1" pagenum="1" side="r" />
            <page index="2" pagenum="2" side="v" />
        </leaf>
        <leaf n="2" mode="original" single="false" folio_number="2" conjoin="">
            <page index="3" pagenum="3" side="r" />
        </leaf>
    </quire>
</book>`

const siteRender = async (ui: any, { ...renderOptions }) => {
    parseString(xml, (_, structure) => {
        return render(
            <EditionContext.Provider
                value={{
                    edition: 'test',
                    pages: pages,
                    tour,
                    structure: getStructure(structure)
                }}>
                {ui}
            </EditionContext.Provider>,
            renderOptions
        )
    })
}

test('renders the first reader page', () => {
    siteRender(<Reader page={1} />, { wrapper: MemoryRouter })
    const image = screen.getByAltText('Manuscript image 1 for edition test')
    expect(image).toBeInTheDocument()
})

test('renders the second reader page', () => {
    siteRender(<Reader page={2} />, { wrapper: MemoryRouter })
    const image = screen.getByAltText('Manuscript image 2 for edition test')
    expect(image).toBeInTheDocument()
})

test('renders the third reader page', () => {
    siteRender(<Reader page={3} />, { wrapper: MemoryRouter })
    const image = screen.getByAltText('Manuscript image 3 for edition test')
    expect(image).toBeInTheDocument()
})

test('renders the map view', () => {
    siteRender(<MapView page={1} />, { wrapper: MemoryRouter })
    const mapItems = screen.getAllByRole('button')
    expect(mapItems.length).toEqual(3)
})

test('renders the navstrip', () => {
    siteRender(<NavStrip page={1} pageData={pages} />, { wrapper: MemoryRouter })
    const mapItems = screen.getAllByRole('button')
    expect(mapItems.length).toEqual(3)
})

test('renders the structure', () => {
    siteRender(<Structure />, { wrapper: MemoryRouter })
    const quires = screen.getAllByRole('button')
    expect(quires.length).toEqual(3)
})
