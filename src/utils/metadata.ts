import defaultStructure from '../data/default/structure.xml'
import defaultData from '../data/default/pages.json'
import defaultTour from '../data/default/tour/tour.json'

import testData from '../data/test/pages.json'
import testTour from '../data/test/tour/tour.json'

import benloweStructure from '../data/benlowe/structure.xml'
import benloweData from '../data/benlowe/pages.json'
import benloweTour from '../data/benlowe/tour/tour.json'

console.log(defaultStructure)


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const pastelPalette = ['#8dd3c7','#ffffb3','#bebada','#fb8072','#80b1d3','#fdb462','#b3de69','#fccde5','#d9d9d9','#bc80bd','#ccebc5','#ffed6f']
const distinctPalette = ['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f','#ff7f00','#cab2d6','#6a3d9a','#ffff99','#b15928']
const categoryPalette = distinctPalette

export type EditionName = string
export type Metadata = Record<string, MetadataRecord>

export type LeafSide = "recto" | "verso" | undefined

export type Page = {
    index: number
    signatures: string
    pagenum: PageNum
    category: string
    description: string
    color?: string
    tourItem?: TourItem
}
export interface TourItem {
    item: number
    page: number
    leaf?: LeafSide // Populated at render time
}
export type PageNum = number | undefined
export type TourData = TourItem[]
export type PageData = Map<number, Page>

export interface LeafPage {
    index: number
    pagenum: number
    side: "r" | "v"

}
export interface Leaf {
    n: string
    mode: string
    single: "true" | "false"
    folio_number: string
    conjoin: string | null
    page: LeafPage[]
}
export interface Quire {
    n: string
    leaf: Leaf[]
}

export interface Structure {
    url?: string
    title?: string
    author?: string
    source?: string
    quire: Quire[]
}
export type MetadataRecord = {
    structure: Structure
    pages: PageData
    tour: TourData
}
// Get the current quire from the page structure for the current verso page
export const getCurrentQuire = (edition: EditionName, pageIndex: number) => {
    const quires = metadata[edition].structure.quire
    let quire
    let page

    quires.forEach((q) => {
        const leaves = q.leaf
        leaves.forEach((l) => {
            const pages = l.page
            pages.forEach((p) => {
                if (p.index === pageIndex) {
                    quire = q
                    page = p
                }
            })
        })
    })
    return { quire, page }
}



/* Representation of the looser types that could come in as strings or numbers */
type SourcePage = {
    index: number | string
    signatures: string
    pagenum: PageNum | string
    category: string
    description: string
}

interface SourceStructure {
    url?: string
    title?: string
    author?: string
    source?: string
    quire: SourceQuire[]
}
interface SourceQuire {
    "$": {
        n: string
    }
    leaf: SourceLeaf[]
}
interface SourceLeaf {
    "$": {
        n: string
        mode: string
        single: "true" | "false"
        folio_number: string
        conjoin: string | null
    }
    page: SourceLeafPage[]
}
interface SourceLeafPage {
    "$": {
        index: string
        pagenum: string
        side: "r" | "v"
    }
}

// get all of the information about the individual pages in the book
export const getPageData = (pages: SourcePage[], tour: TourData): PageData => {
    const data: PageData = new Map()

    const categories = Array.from(new Set([...pages.map((p) => p.category)]))

    if (categories.length > categoryPalette.length) {
        console.error(`There are more categories (${categories.length}) than available category colors
        (${categoryPalette.length})). Either consolidate some categories or add more colors to
        src/utils/metadata.ts categoryPalette`)
    }

    pages.forEach((p) => {
        let pagenum = 0
        let index = 0

        if (typeof p.pagenum === "string") {
            pagenum = parseInt(p.pagenum, 10)
        }
        else {
            pagenum = p.pagenum || 0
        }
        if (typeof p.index === "string") {
            index = parseInt(p.index, 10)
        }
        else {
            index = p.index
        }
        const page = {
            color: categoryPalette[categories.indexOf(p.category)],
            index: index,
            signatures: p.signatures,
            pagenum: pagenum,
            category: p.category,
            description: p.description,
            tourItem: getTourForPage(tour, index)
        }
        data.set(index, page)

    })
    return data
}



// Given an edition, find any possible tour data for a page
export const getTourForPage = (tour: TourData, page: number) => {
    const data = tour.filter((item) => item.page === page)[0]
    return data
}

/**
 * Convert a source structure, with string types, to a public structure, with guaranteed numeric types
 *
 * @param structure the source structure in the native XML import format
 */
const getStructure = (source: SourceStructure): Structure => {
    const quires = source.quire.map((q) => {
        const leaves = q.leaf.map((l) => {
            const pages = l.page.map((p) => {
                const page: LeafPage = {
                    index: parseInt(p.$.index, 10),
                    pagenum: parseInt(p.$.pagenum, 10),
                    side: p.$.side
                }
                return page
            })
            const leaf: Leaf = {
                n: l.$.n,
                mode: l.$.mode,
                single: l.$.single,
                folio_number: l.$.folio_number,
                conjoin: l.$.conjoin,
                page: pages
            }
            return leaf
        })
        const quire: Quire = {
            n: q.$.n,
            leaf: leaves
        }
        return quire
    })
    const structure: Structure = {
        url: source.url,
        title: source.title,
        author: source.author,
        source: source.source,
        quire: quires
    }
    return structure
}

export const metadata: Metadata = {
    default: {
        structure: getStructure(defaultStructure.book),
        pages: getPageData(defaultData, defaultTour),
        tour: defaultTour
    },
    test: {
        structure: {
            quire: []
        },
        pages: getPageData(testData, testTour),
        tour: testTour
    },
    benlowe: {
        structure: getStructure(benloweStructure.book),
        pages: getPageData(benloweData, benloweTour),
        tour: benloweTour
    },
}
