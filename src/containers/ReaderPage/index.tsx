import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-theme.css'

import React from 'react'
import { useParams } from 'react-router'
import { Row, Col } from 'react-bootstrap'

import Reader from '../../components/reader'
import { EditionContext } from '../SiteContainer'

import NavStrip from '../../components/nav-strip'
import { Page } from '../../utils/metadata'
import MapView from '../../components/map-view'

const ReaderPage = () => {
    const { pageString } = useParams()
    const page = parseInt(pageString as string, 10) || 1
    const context = React.useContext(EditionContext)
    return (
        <>
            <Row>
                <Col>
                    <Reader page={page} />
                </Col>
            </Row>
            <Row>
                <Col>
                    <NavStrip
                        page={page}
                        edition={context.edition as string}
                        pages={context.pages as Page[]}
                    />
                </Col>
            </Row>
            <Row>
                <Col>
                    <MapView page={page} />
                </Col>
            </Row>
        </>
    )
}

export default ReaderPage
