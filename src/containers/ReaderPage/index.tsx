import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-theme.css'

import React from 'react'
import { Row, Col } from 'react-bootstrap'

import Reader from '../../components/reader'
import SiteContainer from '../SiteContainer'
import { useParams } from 'react-router'
// import NavStrip from '../../components/nav-strip'
// import MapView from '../../components/map-view'

const ReaderPage = () => {
    const { pageString } = useParams()
    const page = parseInt(pageString as string, 10) || 1

    return (
        <SiteContainer>
            <Row>
                <Col>
                    <Reader page={page} />
                </Col>
            </Row>
            <Row>
                <Col>{/* <NavStrip currentPage={page} /> */}</Col>
            </Row>
            <Row>
                <Col>{/* <MapView currentPage={page} /> */}</Col>
            </Row>
        </SiteContainer>
    )
}

export default ReaderPage
