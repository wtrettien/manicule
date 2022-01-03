import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import Reader from 'components/reader'
import { parseString } from 'xml2js'

import { EditionContext } from 'containers/SiteContainer'
import { PageData, TourData, getStructure } from 'metadata'

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

const tour: TourData = []

const xml = `<?xml version="1.0"?>
<book>
    <url></url>
    <title>A test book</title>
    <author>A test author</author>
    <source>Rosenbach MS 1084/2</source>
    <quire n="*">
        <leaf n="1" mode="original" single="false" folio_number="1" conjoin="2">
            <page index="2" pagenum="1" side="r" />
            <page index="3" pagenum="2" side="v" />
        </leaf>
        <leaf n="2" mode="original" single="false" folio_number="2" conjoin="1">
            <page index="10" pagenum="9" side="r" />
            <page index="11" pagenum="10" side="v" />
        </leaf>
    </quire>
    <quire n="*">
        <leaf n="1" mode="original" single="false" folio_number="3" conjoin="2">
            <page index="4" pagenum="3" side="r" />
            <page index="5" pagenum="4" side="v" />
        </leaf>
        <leaf n="2" mode="original" single="false" folio_number="4" conjoin="1">
            <page index="8" pagenum="7" side="r" />
            <page index="9" pagenum="8" side="v" />
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

test('renders the reader page', () => {
    siteRender(<Reader page={1} />, { wrapper: MemoryRouter })
    const image = screen.getByAltText('Manuscript image 1 for edition test')
    expect(image).toBeInTheDocument()

    siteRender(<Reader page={2} />, { wrapper: MemoryRouter })
    const image2 = screen.getByAltText('Manuscript image 2 for edition test')
    expect(image2).toBeInTheDocument()
})
