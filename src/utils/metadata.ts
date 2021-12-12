import defaultStructure from '../data/default/structure.xml'
import defaultData from '../data/default/pages.json'
import defaultTour from '../data/default/tour/tour.json'

import testData from '../data/test/pages.json'
import testTour from '../data/test/tour/tour.json'

import benloweStructure from '../data/benlowe/structure.xml'
import benloweData from '../data/benlowe/pages.json'
import benloweTour from '../data/benlowe/tour/tour.json'

console.log(defaultStructure)

const categoryColors: Record<string, string> = {
    flyleaf: '#000000',
    'Reeve’s Tale': '#2550a1',
    'Cook’s Tale': '#658539',
    'Man of Law’s Tale': '#963f39',
    'Canon’s Yeoman’s Tale': '#876331',
    'Tale of Sir Thopas': '#b09e8d',
    'Parson’s Tale': '#cae1ed',
    'Squire’s Tale': '#365414'
}

export type EditionName = string
export type PageNum = number | undefined

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
                if (p.$.index === pageIndex) {
                    quire = q
                    page = p
                }
            })
        })
    })
    return { quire, page }
}

export type Page = {
    index: number
    signatures: string
    pagenum: PageNum
    category: string
    description: string
    color?: string
    tourItem?: TourItem
}

/* Representation of the looser types that could come in as strings or numbers */

export type SourcePage = {
    index: number | string
    signatures: string
    pagenum: PageNum | string
    category: string
    description: string
}
export type PageData = Record<number, Page>


// get all of the information about the individual pages in the book
export const getPageData = (pages: SourcePage[], tour: TourData) => {
    let data: Page[] = []

    pages.forEach((p) => {

        if (typeof p.pagenum === "string") {
            p.pagenum = parseInt(p.pagenum, 10)
        }
        if (typeof p.index === "string") {
            p.index = parseInt(p.index, 10)
        }
        const page = {
            color: categoryColors[p.category],
            index: p.index,
            signatures: p.signatures,
            pagenum: p.pagenum,
            category: p.category,
            description: p.description,
            tourItem: getTourForPage(tour, p.index)
        }
        data[page.index] = page

    })
    return data
}

export type TourData = TourItem[]

export interface TourItem {
    item: number
    page: number
    leaf?: LeafSide // Populated at render time
}

// Given an edition, find any possible tour data for a page
export const getTourForPage = (tour: TourData, page: number) => {
    const data = tour.filter((item) => item.page === page)[0]
    return data
}

export type Metadata = Record<string, MetadataRecord>

export type LeafSide = "recto" | "verso" | undefined

export interface LeafPage {
    "$": {
        index: number
        pagenum: number
        side: "r" | "v"
    }
}
export interface Leaf {
    "$": {
        n: number
        mode: string
        single: "true" | "false"
        folio_number: string
        conjoin: number | null
    }
    page: LeafPage[]
}
export interface Quire {
    "$": {
        n: string
    }
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

export const metadata: Metadata = {
    default: {
        structure: defaultStructure.book,
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
        structure: benloweStructure.book,
        pages: getPageData(benloweData, benloweTour),
        tour: benloweTour
    },
}
