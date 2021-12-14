import React from 'react'
import { useParams } from 'react-router'

import Reader from '../../components/reader'
import { EditionContext } from '../SiteContainer'

import NavStrip from '../../components/nav-strip'
import MapView from '../../components/map-view'

const ReaderPage = () => {
    const { pageString } = useParams()
    const page = parseInt(pageString as string, 10) || 1
    const context = React.useContext(EditionContext)
    return (
        <>
            <Reader page={page} />
            <NavStrip page={page} edition={context.edition} pageData={context.pages} />
            <MapView page={page} />
        </>
    )
}

export default ReaderPage
